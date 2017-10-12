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
  userContainer: {
    padding: Metrics.baseSpace,
    alignItems: "center",
    justifyContent: "center"
  },
  avatar: {
    marginTop: 50,
    width: 100,
    height: 100,
    alignSelf: "center",
    borderRadius: 50
  }
});
