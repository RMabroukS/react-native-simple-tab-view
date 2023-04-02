
import React, {
    FC,
    useEffect,
    useState
} from 'react';
import {
    LayoutChangeEvent,
    TouchableOpacityProps,
    Dimensions,
    StyleProp,
    TextStyle
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
    itemsLength: number,
    activeTextStyle?: StyleProp<TextStyle>,
    textStyle?: StyleProp<TextStyle>,
    renderCustomTab?: (index: number, isActive: boolean) => void,
    containerWidth: any
}

const TabViewItem: FC<TouchableOpacityProps & TabViewItemProps> = ({
    onSetItemWidth,
    index,
    isActive,
    value,
    scrollEnabled,
    textStyle,
    activeTextStyle,
    renderCustomTab,
    containerWidth,
    itemsLength, ...props
}) => {
    const [ITEM_WIDTH, setWidth] = useState(0)
    const _textStyle = useAnimatedStyle(() => {
        const opacity = withTiming(isActive ? 0 : 1)
        return { opacity }
    })
    const _activeTextStyle = useAnimatedStyle(() => {
        const opacity = withTiming(isActive ? 1 : 0)
        return { opacity }
    })

    useEffect(() => {
        if (!scrollEnabled) {
            onSetItemWidth(containerWidth / itemsLength)
            setWidth(containerWidth / itemsLength)
        }
    }, [containerWidth])
    
    const onLayout = (event: LayoutChangeEvent) => {
        if (ITEM_WIDTH === 0 && scrollEnabled) {
            onSetItemWidth(event.nativeEvent.layout.width + 16)
            setWidth(event.nativeEvent.layout.width + 16)
        }
    }

    return (
        <ScaleButton
            {...props}
            // style={[styles.tabItemContainer, { width: ITEM_WIDTH||(value&&value.length*6+16 )}]}
            style={[styles.tabItemContainer, !scrollEnabled && { width: ITEM_WIDTH }]}
        >
            {renderCustomTab ? renderCustomTab(index, isActive) : (     //* added the ability to add custom tab
                <>
                    <Animated.Text
                        onLayout={onLayout}
                        style={[styles.activeText, _activeTextStyle, activeTextStyle]}
                    >{value}</Animated.Text>
                    <Animated.Text
                        style={[styles.text, _textStyle, textStyle]}
                    >{value}</Animated.Text>
                </>
            )}
        </ScaleButton>
    )
}

export { TabViewItem }
