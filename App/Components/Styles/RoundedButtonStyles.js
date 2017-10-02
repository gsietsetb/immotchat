import { StyleSheet } from "react-native";
import { Fonts, Colors, Metrics } from "../../Themes/";

export default StyleSheet.create({
  button: {
    height: 45,
    borderRadius: 5,
    marginHorizontal: Metrics.baseSpace,
    marginVertical: Metrics.baseSpace,
    backgroundColor: "#5688a2",
    justifyContent: "center"
  },
  buttonText: {
    color: Colors.snow,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: Fonts.size.medium,
    marginVertical: Metrics.baseMargin
  }
});
