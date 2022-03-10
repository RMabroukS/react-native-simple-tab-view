
import React, {
    FC
} from 'react';
import {
    StyleProp,
    ViewStyle
} from 'react-native';

import Animated, {
    Easing,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated';
import styles from './styles';



const Indicator: FC<{
    activeItemWidth: number,
    translateXTo: number,
    indicatorStyle?: StyleProp<ViewStyle>,
    indicatorColor?: string
}> = ({
    activeItemWidth,
    translateXTo,
    indicatorStyle,
    indicatorColor
}) => {

        const indicatorAnimatedStyle = useAnimatedStyle(() => {
            const translateX = withTiming(translateXTo, { easing: Easing.elastic() })
            const width = withTiming(activeItemWidth, { easing: Easing.elastic() })
            return { transform: [{ translateX: translateX }], width }
        })

        return (
            <Animated.View
                style={[styles.indicator,
                    indicatorAnimatedStyle,
                { backgroundColor: indicatorColor },
                    indicatorStyle]}
            />
        )
    }

Indicator.defaultProps = {
    indicatorColor: "#8D8D8D"
}

export { Indicator }
