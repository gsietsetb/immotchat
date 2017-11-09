// @flow

import { StyleSheet } from "react-native";
import { Colors, Metrics, ApplicationStyles } from "../../Themes/";

export default StyleSheet.create({
  row: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    /*marginVertical: Metrics.smallMargin,*/
    justifyContent: "center"
    /*borderBottomWidth: Metrics.smallLine,
    borderBottomColor: Colors.listLineSeparator*/
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
    backgroundColor: Colors.listImageBorder,
    borderColor: Colors.listImageBorder
  },
  boldLabel: {
    fontWeight: "bold",
    color: Colors.secondaryDark,
    textAlign: "left",
    marginBottom: Metrics.smallMargin
  },
  label: {
    textAlign: "left"
    /*color: Colors.snow*/
  },
  partecipants: {
    color: Colors.secondaryDark,
    fontWeight: "bold",
    fontSize: 11
  },
  lastMessageText: {
    fontSize: 11,
    color: "#666666"
  },
  nameContainer: {
    height: 18,
    alignItems: "stretch",
    justifyContent: "center"
  }
});
