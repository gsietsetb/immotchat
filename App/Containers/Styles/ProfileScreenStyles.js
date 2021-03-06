// @flow

import { StyleSheet } from "react-native";
import { ApplicationStyles, Metrics, Colors } from "../../Themes/";

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  ...ApplicationStyles.common,
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  form: {
    backgroundColor: Colors.snow,
    margin: Metrics.baseSpace,
    borderRadius: 4
  },
  row: {
    paddingVertical: Metrics.baseSpace,
    paddingHorizontal: Metrics.baseSpace
  },
  rowLabel: {
    color: Colors.charcoal
  },
  textInput: {
    paddingHorizontal: Metrics.baseSpace,
    borderRadius: Metrics.buttonRadius,
    borderColor: Colors.steel,
    borderWidth: Metrics.smallLine,
    height: Metrics.inputHeight,
    color: Colors.coal
  },
  textInputReadonly: {
    height: Metrics.inputHeight,
    color: Colors.steel
  },
  menuIcon: {
    padding: 8,
    color: Colors.primaryNormal
  },
  titleRow: {
    padding: 8,
    color: Colors.primaryNormal
  },
  spinner: {
    alignSelf: "center"
  },
  standardButton: {
    flex: 1,
    height: Metrics.buttonHeight,
    marginTop: Metrics.baseSpace,
    marginHorizontal: Metrics.baseSpace,
    borderRadius: Metrics.buttonRadius,
    justifyContent: "center",
    backgroundColor: Colors.primaryLight
  },
  emptyButton: {
    backgroundColor: Colors.clear
  },
  emptyButtonText: {
    textAlign: "center",
    color: Colors.secondaryDark
  },
  activeButton: {
    backgroundColor: Colors.secondaryDark
  },
  activeButtonText: {
    textAlign: "center",
    color: Colors.whiteFull
  },
  loginText: {
    textAlign: "center",
    color: Colors.silver
  },
  errorMessage: {
    flex: 1,
    textAlign: "center",
    padding: Metrics.baseSpace,
    color: Colors.error
  },
  cardTitle: {
    padding: Metrics.baseSpace,
    color: Colors.secondaryDark
  },
  infoText: {
    padding: Metrics.baseSpace
  },
  avatar: {
    width: 100,
    height: 100,
    alignSelf: "center",
    borderRadius: 50
  },
  boxLinks: {
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  rowLink: {
    height: 50,
    paddingVertical: Metrics.baseSpace,
    paddingHorizontal: Metrics.baseSpace
  },
  rowText: {
    color: Colors.secondaryDark
  },
  privacyText: {
    padding: Metrics.baseSpace,
    color: Colors.secondaryDark,
    textAlign: "center"
  },
  privacyButton: {
    color: Colors.secondaryDark,
    fontWeight: "bold"
  },
  header: {
    justifyContent: "center",
    alignItems: "center"
  },
  loadingAction: {
    padding: 20,
    height: 140,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  photoContainer: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center"
  },
  pictureHeaderText: {
    top: 0,
    alignSelf: "center",
    position: "absolute",
    textAlign: "center",
    padding: Metrics.smallSpace,
    fontSize: 11,
    fontWeight: "bold"
  },
  pickerAction: {
    padding: 20,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  pickerIco: {
    position: "absolute",
    alignSelf: "center",
    backgroundColor: Colors.transparent,
    color: "#ffffff80",
    fontSize: 60
  }
});
