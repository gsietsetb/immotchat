import { StyleSheet, Platform } from "react-native";
import { Metrics, Colors } from "../../Themes";

export default StyleSheet.create({
  wrapper: {
    height: Metrics.navBarHeight,
    width: Metrics.screenWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.navBarColor,
    paddingTop: Metrics.statusBarHeight,
    borderBottomWidth: Metrics.line,
    borderColor: Colors.listLineSeparator
  },
  button: {
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    flex: 0,
    flexDirection: "row"
  },
  backButton: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    flex: 0,
    flexDirection: "row"
  },
  backButtonText: {
    alignSelf: "center",
    textAlign: "left",
    fontSize: 16,
    color: Colors.secondaryDark
  },
  titleWrapper: {
    position: "absolute",
    top: Metrics.statusBarHeight,
    left: 80,
    right: 80,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  rightWrapper: {
    top: Metrics.statusBarHeight,
    right: 0,
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 17,
    color: Colors.secondaryDark,
    fontWeight: "600"
  }
});
