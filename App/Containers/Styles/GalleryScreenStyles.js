import { StyleSheet, Dimensions } from "react-native";
import { Metrics, ApplicationStyles, Colors } from "../../Themes/";

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  mainContainer: {
    flex: 1
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    flex: 1
  },
  backButton: {
    position: "absolute",
    backgroundColor: Colors.transparent,
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    left: 0,
    top: Metrics.statusBarHeight
  },
  backIcon: {
    color: Colors.whiteFull,
    fontSize: Metrics.icons.medium
  }
});
