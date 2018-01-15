// @flow

import { StyleSheet, Dimensions } from "react-native";
import { Colors, Metrics, Fonts } from "../../Themes/";

const { height, width } = Dimensions.get("window");

const BORDER_RADIUS = 5;
const FONT_SIZE = 16;
const HIGHLIGHT_COLOR = "rgba(0,118,255,0.9)";

export default StyleSheet.create({
  overlayStyle: {
    width: width,
    height: height,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.7)"
  },

  optionContainer: {
    borderRadius: BORDER_RADIUS,
    width: width * 0.8,
    backgroundColor: "rgba(255,255,255,0.8)"
  },

  cancelContainer: {},

  selectStyle: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: Metrics.baseSpace
  },
  selectTextStyle: {
    textAlign: "center",
    color: "#333",
    fontSize: FONT_SIZE
  },
  cancelStyle: {
    borderRadius: BORDER_RADIUS,
    width: width * 0.8,
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: Metrics.baseSpace
  },
  cancelTextStyle: {
    textAlign: "center",
    color: "#333",
    fontSize: FONT_SIZE
  },
  optionStyle: {
    padding: Metrics.baseSpace,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc"
  },
  optionTextStyle: {
    textAlign: "center",
    fontSize: FONT_SIZE,
    color: HIGHLIGHT_COLOR
  },
  sectionStyle: {
    padding: Metrics.baseSpace * 2,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc"
  },
  sectionTextStyle: {
    textAlign: "center",
    fontSize: FONT_SIZE
  }
});
