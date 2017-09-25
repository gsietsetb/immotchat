// @flow

import { StyleSheet } from "react-native";
import { Colors, Metrics, Fonts } from "../../Themes/";

export default StyleSheet.create({
  container: {
    //position: "absolute",
    bottom: 0,
    height: Metrics.tabBarHeight,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: Colors.tabColor,
    borderTopWidth: Metrics.line,
    borderColor: Colors.listLineSeparator
  },
  tab: {
    flex: 1,
    padding: Metrics.baseSpace,
    justifyContent: "center",
    alignItems: "center"
  },
  tabIcon: {
    color: "#ffffff",
    fontSize: Metrics.icons.medium
  },
  tabLine: {
    position: "absolute",
    backgroundColor: "#ffffff",
    left: 0,
    right: 0,
    bottom: 0
  }
});
