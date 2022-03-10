import {
    StyleProp,
    TextStyle,
    ViewProps,
    ViewStyle
} from 'react-native';

export interface TabViewProps {
    tabContainerStyle?: StyleProp<ViewStyle>,
    onChangeIndex?: (index: number) => void,
    scrollEnabled?: boolean,
    containerStyle?: StyleProp<ViewStyle>,
    indicatorStyle?: StyleProp<ViewStyle>,
    indicatorColor?: string,
    activeTextStyle?: StyleProp<TextStyle>,
    textStyle?: StyleProp<TextStyle>,
    vertical?: boolean
}

export interface TabContentProps {
    title: string
}


declare const TabView: React.FC<ViewProps & TabViewProps>

export declare const TabContent: React.FC<
    ViewProps & TabContentProps
>;

export default TabView