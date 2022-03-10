
import React, {
    FC,
    ReactNode,
    useRef,
    useState
} from 'react';
import {
    FlatList,
    GestureResponderEvent,
    ScrollView,
    StyleProp,
    View,
    ViewProps,
    ViewStyle,
    Dimensions,
    TextStyle
} from 'react-native';
import Animated
    from 'react-native-reanimated';


import {
    Indicator
} from './indicator';
import styles from './styles';
import {
    TabViewItem
} from './TabViewItem';
const { width } = Dimensions.get("window")


type TabViewProps = {
    containerStyle?: StyleProp<ViewStyle>,
    tabContainerStyle?: StyleProp<ViewStyle>,
    children: Array<ReactNode & { props: { title: string } }>,
    scrollEnabled?: boolean,
    indicatorStyle?: StyleProp<ViewStyle>,
    indicatorColor?: string,
    textStyle?: StyleProp<ViewStyle>,
    activeTextStyle?: StyleProp<TextStyle>,
    onChangeIndex?: (index: number) => void,
    vertical?: boolean
}


const TabView: FC<ViewProps & TabViewProps> = ({
    indicatorStyle,
    indicatorColor,
    textStyle,
    activeTextStyle,
    onChangeIndex,
    scrollEnabled,
    vertical,
    ...props
}) => {
    const scrollViewRef = useRef<ScrollView>(null)
    const flatlistRef = useRef<FlatList>(null)

    const [valueStart, setValueStart] = useState(0)
    const [selectedIndex, setIndex] = useState(0)

    let [listOfItemsWidth, setwidthItemsList] = useState<Array<{ index: number, value: number }>>([])
    let translateXTo = listOfItemsWidth.slice(0, selectedIndex).reduce((a, b) => a + b.value, 0)
    const [activeItemWidth, setActiveItemWidth] = useState(0)
    const renderIndex = Math.floor(width / activeItemWidth)

    const [fromContent, setFromContent] = useState(false)


    const onPressOut = (event: GestureResponderEvent, index: number) => {
        if (event.nativeEvent.touches && event.nativeEvent.touches.length === 0) {
            setIndex(index)
            onChangeIndex(index)

            if (selectedIndex !== index)
                flatlistRef.current?.scrollToIndex({ index: index, animated: true })
            setActiveItemWidth(listOfItemsWidth[index].value)
            if ((event.nativeEvent.pageX >= (width - activeItemWidth) && valueStart === event.nativeEvent.pageX)) {
                scrollViewRef.current?.scrollTo({ animated: true, x: activeItemWidth * (index - (renderIndex - 2)) })
            }
            if ((event.nativeEvent.pageX <= activeItemWidth && valueStart === event.nativeEvent.pageX)) {
                scrollViewRef.current?.scrollTo({ animated: true, x: activeItemWidth * (index - 1) })
            }
        }
    }

    const onPressIn = (event: GestureResponderEvent, index: number) => {
        setFromContent(false)
        if (event.nativeEvent.pageX >= width - activeItemWidth) {
            setValueStart(event.nativeEvent.pageX)
        }
        if (event.nativeEvent.pageX <= activeItemWidth) {
            setValueStart(event.nativeEvent.pageX)
        }
    }



    return (
        <View {...props.containerStyle}>
            <Animated.View
                style={[styles.container, props.tabContainerStyle]}>
                <ScrollView
                    bounces={false}
                    ref={scrollViewRef}
                    snapToAlignment={"start"}
                    snapToInterval={activeItemWidth}
                    decelerationRate={0}
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    horizontal
                >

                    {[...Array.isArray(props.children) ? props.children : [props.children]].map((item, index) => {
                        return <TabViewItem
                            activeTextStyle={activeTextStyle}
                            textStyle={textStyle}
                            itemsLength={Array.isArray(props.children) ? props.children.length : 1}
                            scrollEnabled={scrollEnabled}
                            onSetItemWidth={(itemWidth) => {
                                let old = listOfItemsWidth
                                old.push({ index: index, value: itemWidth })
                                let newList = old.sort((a, b) => { return a.index - b.index });
                                setActiveItemWidth(newList[0].value)
                                setwidthItemsList(newList)

                            }}
                            isActive={index === selectedIndex}
                            onPressOut={(event) => onPressOut(event, index)}
                            onPressIn={(event) => onPressIn(event, index)}
                            key={`TabViewItemKey_${index}`}
                            value={item.props.title}
                            index={index} />
                    })}

                    <Indicator
                        indicatorColor={indicatorColor}
                        indicatorStyle={indicatorStyle}
                        activeItemWidth={activeItemWidth}
                        translateXTo={translateXTo}
                    />

                </ScrollView>
            </Animated.View>

            <FlatList
                onScroll={(event) => {
                    const _index = Math.round(event.nativeEvent.contentOffset[vertical ? "y" : "x"] / width)
                    if (fromContent && _index !== selectedIndex) {
                        onChangeIndex(_index)
                        setActiveItemWidth(listOfItemsWidth[_index].value)
                        setIndex(_index)
                    }
                }}
                onScrollBeginDrag={() => {
                    setFromContent(true)
                }}
                ref={flatlistRef}
                bounces={true}
                {...!vertical && {
                    snapToAlignment: "start",
                    showsHorizontalScrollIndicator: false,
                    snapToInterval: width,
                    decelerationRate: 0
                }}
                horizontal={!vertical}
                data={props.children}
                renderItem={({ item }) => item}
            />

        </View>

    )
}

TabView.defaultProps = {
    onChangeIndex: (index) => { },
    scrollEnabled: true,
    vertical: false
}

const TabContent: FC<ViewProps & { title: string }> = ({ ...props }) => {
    return (
        <View
            {...props}
            style={[{ width }, props.style]}
        />
    )
}


export {
    TabView,
    TabContent
}
