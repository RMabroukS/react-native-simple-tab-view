
import React, {
    FC,
    ReactNode,
    useRef,
    useState,
    useEffect
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
    TextStyle,
    I18nManager,
    Platform
} from 'react-native';
import Animated from 'react-native-reanimated';
import {
    ScrollableContent
} from './ScrollableContent';
import {
    FadingContent
} from './FadingContent';
import {
    Indicator
} from './indicator';
import styles from './styles';
import {
    TabViewItem
} from './TabViewItem';
const { width
} = Dimensions.get("window")


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
    bounces?: boolean,
    mode: "fade" | "vertcal" | "horizontal",
    initialIndex?: number
}


const TabView: FC<ViewProps & TabViewProps> = ({
    indicatorStyle,
    indicatorColor,
    textStyle,
    activeTextStyle,
    onChangeIndex,
    scrollEnabled,
    bounces,
    mode,
    initialIndex,
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

    let [fromContent, setFromContent] = useState(false)

    const children = [...Array.isArray(props.children) ? props.children : [props.children]]


    const onPressOut = (event: GestureResponderEvent, index: number) => {
        if (event.nativeEvent.touches && event.nativeEvent.touches.length === 0) {
            let scrollTo = listOfItemsWidth.slice(0, index).reduce((a, b) => a + b.value, 0) - (width / 2)
            setIndex(index)
            onChangeIndex(index)
            if (selectedIndex !== index) {
                if (mode !== "fade")
                    flatlistRef.current?.scrollToIndex({ index:(I18nManager.isRTL && mode == "horizontal"&&Platform.OS==="ios")?children.length-index-1:index, animated: true })
                setActiveItemWidth(listOfItemsWidth[index].value)
            }
            scrollViewRef.current?.scrollTo({ animated: true, x: scrollTo })
            // if ((event.nativeEvent.pageX >= (width - activeItemWidth) && valueStart === event.nativeEvent.pageX)) {
            //     scrollViewRef.current?.scrollTo({ animated: true, x: activeItemWidth * (index - (renderIndex - 2)) })
            // }
            // if ((event.nativeEvent.pageX <= activeItemWidth && valueStart === event.nativeEvent.pageX)) {
            //     scrollViewRef.current?.scrollTo({ animated: true, x: activeItemWidth * (index - 1) })
            // }
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
        <View style={[{ flex: 1 }, props.containerStyle]}>
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

                    {children.map((item, index) => {
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
                            value={item && item.props.title}
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


            {mode === "fade" && <FadingContent
                initialIndex={initialIndex}
                activeIndex={selectedIndex}
                children={props.children} />}
            {mode !== "fade" && <ScrollableContent
                mode={mode}
                selectedIndex={selectedIndex}
                setIndex={(index) => {
                    setIndex(index)
                    let scrollTo = listOfItemsWidth.slice(0, index).reduce((a, b) => a + b.value, 0) - (width / 2)
                    scrollViewRef.current?.scrollTo({ animated: true, x: scrollTo })
                }}
                children={props.children}
                fromContent={fromContent}
                listOfItemsWidth={listOfItemsWidth}
                setActiveItemWidth={setActiveItemWidth}
                setFromContent={setFromContent}
                bounces={bounces}
                key={"ScrollableContent"}
                onChangeIndex={onChangeIndex}
                vertical={mode === "vertcal"}
                ref={flatlistRef}
            />}


        </View>

    )
}




TabView.defaultProps = {
    onChangeIndex: (index) => { },
    scrollEnabled: true,
    bounces: true,
    mode: "horizontal",
    initialIndex: 0

}

const TabItem: FC<ViewProps & { title: string }> = ({ ...props }) => {
    const [isLoaded, setLoading] = useState(false)
    useEffect(() => {
        setTimeout(() => {
            setLoading(true)
        }, 0);
    })
    return (
        <View
            {...props}
            style={[{ width }, props.style]}
        >
            {isLoaded && props.children}
            {/* {!isLoaded && < ActivityIndicator
                size={"large"}
                color={"#2e2e2e"}
                style={styles.activityIndicator}
            />} */}
        </View>
    )
}

export {
    TabView,
    TabItem
}
