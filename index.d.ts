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
    bounces?: boolean,
    mode?: "fade" | "vertcal" | "horizontal",
    initialIndex?: number,
    disableIndicator?: boolean,
    renderCustomTab?: (index: number, isActive: boolean) => void
}

export interface TabItemProps {
    title: string
}


declare const TabView: React.FC<ViewProps & TabViewProps>

export declare const TabItem: React.FC<
    ViewProps & TabItemProps
>;

export default TabView