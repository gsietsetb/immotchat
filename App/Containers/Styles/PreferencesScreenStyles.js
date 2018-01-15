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
    padding: Metrics.baseSpace,
    backgroundColor: Colors.secondaryLight
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  footerButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    height: 50,
    padding: Metrics.baseSpace
  },
  submit: {
    color: Colors.secondaryDark
  },
  cancel: {
    color: Colors.primaryLight
  },
  listFooterContaiener: {
    padding: Metrics.baseSpace,
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
    padding: Metrics.baseSpace,
    alignItems: "stretch",
    flexWrap: "wrap",
    flex: 1
  },
  imgContainer: {
    width: 60,
    paddingVertical: Metrics.baseSpace,
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
  },
  itemGrid: {
    flex: 1,
    width: Metrics.screenWidth / 4,
    height: Metrics.screenWidth / 4,
    padding: 2,
    backgroundColor: "#eeeeee"
  },
  mediaGrid: {
    justifyContent: "flex-start",
    margin: 0
  },
  imageGrid: {
    width: Metrics.screenWidth / 4 - 4,
    height: Metrics.screenWidth / 4 - 4
  },
  description: {
    padding: Metrics.baseSpace,
    color: Colors.primaryLight
  },
  label: {
    padding: Metrics.baseSpace,
    fontWeight: "bold",
    color: Colors.primaryDark
  },
  overlayStyle: {
    paddingTop: 50,
    justifyContent: "flex-start"
  },
  selectStyle: {
    backgroundColor: "#ffffff",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10
  },
  optionStyle: {
    alignItems: "center",
    justifyContent: "center",
    height: 50
  }
});
