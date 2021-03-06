// @flow

import { StyleSheet } from "react-native";
import { ApplicationStyles, Metrics, Colors } from "../../Themes/";

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  listHeaderContaiener: {
    padding: 10,
    backgroundColor: "#ff000080"
  },
  listFooterContaiener: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  footerMessage: {
    textAlign: "center",
    color: Colors.primaryDark
  },
  separator: {
    flex: 1,
    height: Metrics.smallLine,
    backgroundColor: Colors.listLineSeparator
  },
  listContent: {},
  headerRightButton: {
    width: 50,
    height: 45,
    marginRight: Metrics.baseSpace,
    justifyContent: "center",
    alignItems: "flex-end"
  },
  actionBtn: {
    height: 44,
    width: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  actionIco: {
    color: Colors.secondaryDark
  }
});
