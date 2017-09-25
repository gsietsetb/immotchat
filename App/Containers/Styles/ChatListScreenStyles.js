// @flow

import { StyleSheet } from "react-native";
import { ApplicationStyles, Metrics, Colors } from "../../Themes/";

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    //marginTop: Metrics.navBarHeight,
    backgroundColor: Colors.background
  },
  listHeaderContaiener: {
    padding: 10,
    backgroundColor: Colors.secondaryLight
  },
  listFooterContaiener: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  separator: {
    flex: 1,
    height: Metrics.smallLine,
    backgroundColor: Colors.listLineSeparator
  },
  listContent: {},
  headerRightButton: {
    marginRight: Metrics.baseSpace,
    justifyContent: "center",
    alignItems: "center"
  }
});
