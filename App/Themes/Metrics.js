import { Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

// Used via Metrics.baseMargin
const metrics = {
  marginHorizontal: 10,
  marginVertical: 10,
  section: 25,
  baseSpace: 10,
  smallSpace: 5,
  doubleSpace: 20,
  baseRadius: 4,
  borderLine: 0.5,
  inputHeight: 44,
  line: 1,
  smallLine: 0.5,
  baseSpace: 10,
  baseMargin: 10,
  doubleBaseMargin: 20,
  smallMargin: 5,
  doubleSection: 50,
  horizontalLineHeight: 1,
  searchBarHeight: 30,
  statusBar: Platform.OS === "ios" ? 0 : 0,
  statusBarHeight: Platform.OS === "ios" ? 18 : 0,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  navBarHeight: Platform.OS === "ios" ? 64 : 54,
  buttonHeight: 44,
  buttonRadius: 4,
  icons: {
    tiny: 15,
    small: 20,
    medium: 30,
    large: 45,
    xl: 50
  },
  images: {
    small: 20,
    medium: 40,
    large: 60,
    logo: 200
  }
};

export default metrics;
