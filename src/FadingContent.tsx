
import React, {
    FC,
    useEffect,
} from 'react';
import {
    View,
    ViewProps,
} from 'react-native';
import Animated
, {
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

type FadingContentProps = {
    activeIndex: number,
    lazy?: boolean,
    initialIndex?: number
}
type FadingItemProps = {
    index: number,
    length: number,
    active: boolean,
    initialIndex?: number
}

const FadingContent: FC<ViewProps & FadingContentProps> = ({
    children,
    activeIndex,
    initialIndex,
    ...props
}) => {
    const length = React.Children.count(children)
    return (
        <View
            style={[{ flex: 1 }, props.style]}>
            {React.Children.map(children, (child, index) => (
                <FadingItem
                    initialIndex={initialIndex}
                    key={`FadingItem_${index}`}
                    children={child}
                    index={index}
                    active={activeIndex === index}
                    length={length} />
            ))}
        </View>
    )
}


const FadingItem: FC<ViewProps & FadingItemProps> = ({
    index,
    length,
    children,
    active,
    initialIndex
}) => {
    const _opacity = useSharedValue(index === 0 ? 1 : 0)
    const fadingStyle = useAnimatedStyle(() => {
        const opacity = withTiming(_opacity.value)
        return { opacity }
    })

    useEffect(() => {
        if (active)
            _opacity.value = 1
        else _opacity.value = 0
    }, [active])
    return (
        <Animated.View
            style={[fadingStyle, {
                position: active ? "relative" : "absolute",
                zIndex: active ? length : index
            }]}
        >
            {children}
        </Animated.View>
    )
}
FadingItem.defaultProps = {
    initialIndex: 0
}

export { FadingContent }
