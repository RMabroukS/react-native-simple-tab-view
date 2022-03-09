
import React, {
    FC,
    memo
} from 'react';
import {
    GestureResponderEvent,
    StyleProp,
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle
} from 'react-native'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';



const ScaleButton: FC<TouchableOpacityProps &
{
    buttonScale?: number,
    containerStyle?: StyleProp<ViewStyle>
}> =
    memo(({ ...props }) => {
        const scale = useSharedValue(1)
        const onPressIn = (event: GestureResponderEvent) => {
            if (props.onPressIn)
                props.onPressIn(event)
            scale.value = withSpring(props.buttonScale || .98, {
                damping: 10,
                mass: 1,
                stiffness: 500,
            })
        }
        const onPressOut = (event:GestureResponderEvent) => {
            if (props.onPressOut)
              props.onPressOut(event)
            scale.value = withSpring(1, {
                damping: 10,
                mass: 1,
                stiffness: 500,
            })
        }

        const animatedScale = useAnimatedStyle(() => {
            return { transform: [{ scale: scale.value }] }
        })
        return <Animated.View
            style={[animatedScale, props.containerStyle]}
        >
            <TouchableOpacity
                {...props}
                activeOpacity={.91}
                onPressIn={onPressIn}
                onPressOut={onPressOut}

            />
        </Animated.View>
    }
    )


export { ScaleButton }
