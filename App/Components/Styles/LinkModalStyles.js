import { StyleSheet } from "react-native";
import { Metrics, ApplicationStyles, Colors } from "../../Themes/";

export default StyleSheet.create({
  linkModal: {
    flex: 1,
    backgroundColor: Colors.transparent,
    justifyContent: "center",
    alignItems: "stretch"
  },
  container: {
    padding: Metrics.baseSpace,
    margin: Metrics.baseSpace,
    backgroundColor: "#ffffff",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#cdcdcd",
    justifyContent: "center",
    alignItems: "stretch"
  },
  avatar: {
    width: 80,
    height: 80,
    alignSelf: "center",
    borderRadius: 40
  },
  invitationTitle: {
    padding: Metrics.baseSpace,
    alignSelf: "center",
    textAlign: "center",
    fontSize: 20
  },
  denyText: {
    color: Colors.blueFull,
    textAlign: "center",
    fontWeight: "bold"
  },
  denyButton: {
    height: 45,
    margin: Metrics.baseSpace,
    backgroundColor: Colors.transparent,
    alignItems: "center",
    justifyContent: "center"
  },
  acceptText: {
    color: Colors.snow,
    paddingHorizontal: Metrics.baseSpace,
    textAlign: "center",
    fontWeight: "bold"
  },
  acceptButton: {
    height: 45,
    borderRadius: 4,
    margin: Metrics.baseSpace,
    backgroundColor: Colors.blueFull,
    alignItems: "center",
    justifyContent: "center"
  }
});
