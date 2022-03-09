
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
    Dimensions
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

}


const TabView: FC<ViewProps & TabViewProps> = ({ scrollEnabled = true, ...props }) => {
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
                        activeItemWidth={activeItemWidth}
                        translateXTo={translateXTo}
                    />

                </ScrollView>
            </Animated.View>

            <FlatList
                onScroll={(event) => {
                    const _index = Math.round(event.nativeEvent.contentOffset.x / width)
                    if (fromContent && _index !== selectedIndex) {
                        setIndex(_index)
                    }
                }}
                onScrollBeginDrag={() => {
                    setFromContent(true)
                }}
                ref={flatlistRef}
                // bounces={false}
                snapToAlignment={"start"}
                showsHorizontalScrollIndicator={false}
                snapToInterval={width}
                decelerationRate={0}
                horizontal
                data={props.children}
                renderItem={({ item }) => item}
            />

        </View>

    )
}
const TabContent: FC<ViewProps & { title: string }> = ({ ...props }) => {
    return (
        <View
            {...props}
            style={[{ width }, props.style]}
        />
    )
}


export { TabView, TabContent }
