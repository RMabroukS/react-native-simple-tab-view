
import React, {
    FC,
    useEffect,
    useState
} from 'react';
import {
    LayoutChangeEvent,
    TouchableOpacityProps,
    Dimensions
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated';
import {
    ScaleButton
} from './ScaleButton';
import styles from './styles';
const { height, width } = Dimensions.get("window")
type TabViewItemProps = {
    index: number,
    value?: string,
    isActive: boolean,
    onSetItemWidth: ((width: number) => void),
    scrollEnabled?: boolean,
    itemsLength: number
}

const TabViewItem: FC<TouchableOpacityProps & TabViewItemProps> = ({
    onSetItemWidth,
    index,
    isActive,
    value, scrollEnabled, itemsLength, ...props
}) => {
    const [ITEM_WIDTH, setWidth] = useState(0)

    const textStyle = useAnimatedStyle(() => {
        const opacity = withTiming(isActive ? 0 : 1)
        return { opacity }
    })
    const activeTextStyle = useAnimatedStyle(() => {
        const opacity = withTiming(isActive ? 1 : 0)
        return { opacity }
    })

    useEffect(() => {
        if (!scrollEnabled){
            onSetItemWidth(width / itemsLength)
            setWidth(width / itemsLength)
        }
           
    }, [])
    const onLayout = (event: LayoutChangeEvent) => {
        if (ITEM_WIDTH === 0 && scrollEnabled) {
            onSetItemWidth(event.nativeEvent.layout.width + 16)
            setWidth(event.nativeEvent.layout.width + 16)
        }
    }

    return (
        <ScaleButton
            {...props}
            style={[styles.tabItemContainer, { width: ITEM_WIDTH }]}>
            <Animated.Text
                onLayout={onLayout}
                style={[styles.activeText, activeTextStyle]}
            >{value}</Animated.Text>
            <Animated.Text
                style={[styles.text, textStyle]}
            >{value}</Animated.Text>
        </ScaleButton>
    )
}

export { TabViewItem }
