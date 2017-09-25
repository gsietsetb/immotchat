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
  headerContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center"
  },
  rightContainer: {
    flexDirection: "column",
    padding: 10,
    alignItems: "stretch",
    flexWrap: "wrap",
    flex: 1
  },
  imgContainer: {
    width: 60,
    paddingVertical: 10,
    alignItems: "flex-end",
    justifyContent: "center"
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: Metrics.buttonRadius,
    borderWidth: Metrics.smallLine,
    backgroundColor: "#33333380",
    borderColor: Colors.listImageBorder
  },
  boldLabel: {
    fontWeight: "bold",
    /*color: Colors.snow,*/
    textAlign: "left",
    marginBottom: Metrics.smallMargin
  },
  label: {
    textAlign: "left"
    /*color: Colors.snow*/
  },
  userRow: {
    height: 50,
    padding: Metrics.baseSpace,
    alignItems: "stretch",
    justifyContent: "center"
  }
});
