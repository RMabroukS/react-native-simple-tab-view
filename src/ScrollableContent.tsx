
import React, {
    FC,
    forwardRef,
    ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import {
    FlatList,
    Dimensions,
    StyleProp,
    ViewStyle,
    View,
    ListRenderItem,
    ViewProps,
    ViewToken
} from 'react-native';
const { width, height } = Dimensions.get("window")


type TabViewProps = {
    children: Array<ReactNode & { props: { title: string } }>,
    onChangeIndex?: (index: number) => void,
    vertical?: boolean,
    bounces?: boolean,
    setActiveItemWidth: (width: number) => void,
    setFromContent: (value: boolean) => void,
    fromContent: boolean,
    listOfItemsWidth: Array<{ value: number }>,
    style?: StyleProp<ViewStyle>,
    selectedIndex: number,
    setIndex: (index: number) => void
}


const ScrollableContent = forwardRef<FlatList, TabViewProps>(({
    onChangeIndex,
    vertical,
    bounces,
    children,
    setActiveItemWidth,
    setFromContent,
    fromContent,
    listOfItemsWidth,
    style,
    selectedIndex,
    setIndex
}, ref) => {
    let [viewableItemIndex, setViewableItemIndex] = useState(0)







    useEffect(() => {
        if (fromContent && viewableItemIndex !== selectedIndex) {
            onChangeIndex(viewableItemIndex)
            setActiveItemWidth(listOfItemsWidth[viewableItemIndex].value)
            setIndex(viewableItemIndex)
        }
    }, [viewableItemIndex, fromContent])


    const renderItem: ListRenderItem<ReactNode> = ({ item, index }) =>
        <RenderItem
            onSetTabHeight={(itemHeight) => {
            }}
            key={`ScrollableTabItem${index}`} children={item} />

            

    const onViewableItemsChanged = (info: { viewableItems: Array<ViewToken>; changed: Array<ViewToken> }) => {
        if (info.viewableItems.length) {
            const index = info.viewableItems[0].index
                setViewableItemIndex(index)
        }
    }

    const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 }
    const viewabilityConfigCallbackPairs = useRef([
        { onViewableItemsChanged, viewabilityConfig },
    ]);


    return (
        <FlatList
            viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
            style={style}
            // onScroll={(event) => {
            //     const _index = Math.round(event.nativeEvent.contentOffset[vertical ? "y" : "x"] / width)
            //     if (fromContent && _index !== selectedIndex) {
            //         onChangeIndex(_index)
            //         setActiveItemWidth(listOfItemsWidth[_index].value)
            //         setIndex(_index)
            //     }
            // }}
            onScrollBeginDrag={() => {
                if (!fromContent)
                    setFromContent(true)
            }}
            ref={ref}
            bounces={bounces}
            {...!vertical && {
                snapToAlignment: "start",
                showsHorizontalScrollIndicator: false,
                snapToInterval: width,
                decelerationRate: 0
            }}
            horizontal={!vertical}
            data={React.Children.toArray(children)}
            renderItem={renderItem}
        />
    )
})


const RenderItem: FC<ViewProps & { onSetTabHeight: (itemHeight: number) => void }> = ({ onSetTabHeight, ...props }) => {
    const [height, setHeight] = useState(0)
    return (
        <View
            onLayout={(event) => {
                if (height === 0 && event.nativeEvent.layout.height > 0) {
                    onSetTabHeight(event.nativeEvent.layout.height)
                    setHeight(event.nativeEvent.layout.height)
                }
            }}
            {...props} />
    )
}

ScrollableContent.defaultProps = {
    onChangeIndex: (index) => null
}

export {
    ScrollableContent
}
