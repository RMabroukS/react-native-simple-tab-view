import {
    StyleProp,
    ViewProps,
    ViewStyle
} from 'react-native';

export interface TabViewProps {
    tabContainerStyle?: StyleProp<ViewStyle>,
    onChangeIndex?: (index: number) => void,
    scrollEnabled?: boolean,
    containerStyle?: StyleProp<ViewStyle>,
}

export interface TabContentProps {
    title: string
}


declare const TabView: React.FC<ViewProps & TabViewProps>

export declare const TabContent: React.FC<
    ViewProps & TabContentProps
>;

export default TabView