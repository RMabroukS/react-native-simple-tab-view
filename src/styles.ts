import {
    StyleSheet,
    Dimensions
} from "react-native";
const { height, width } = Dimensions.get("window")

const styles = StyleSheet.create({
    container: {
        width: width,
        height: 40,
        backgroundColor: "white",

        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#F5F5F5"
    },
    tabItemContainer: {
        height: "100%",
        // backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal:8
    },
    text: {
        // fontFamily: Typography.REGULAR,
        fontSize: 12,
        color: "#8D8D8D",
        position: "absolute"
    },
    activeText: {
        // fontFamily: Typography.REGULAR,
        fontSize: 12,
        color: "#7322A7",
        // position: "absolute",
        fontWeight: "600"
    },
    indicator: {
        position: "absolute",
        bottom: 0,
        backgroundColor: "#8D8D8D",
        height: 2,
        borderRadius: 1
    },
    activityIndicator: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
})

export default styles