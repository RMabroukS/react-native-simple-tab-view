
import React, {
    FC
} from 'react';

import Animated, {
    Easing,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated';
import styles from './styles';



const Indicator: FC<{
    activeItemWidth: number, translateXTo: number
}> = ({
    activeItemWidth,
    translateXTo }) => {

        const indicatorAnimatedStyle = useAnimatedStyle(() => {
            const translateX = withTiming(translateXTo, { easing: Easing.elastic() })
            const width = withTiming(activeItemWidth, { easing: Easing.elastic() })
            return { transform: [{ translateX: translateX }], width }
        })

        return (
            <Animated.View
                style={[styles.indicator,
                    indicatorAnimatedStyle]}
            />
        )
    }



export { Indicator }
