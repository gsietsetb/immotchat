import { StackNavigator, TabNavigator } from "react-navigation";
import ChatListScreen from "../Containers/ChatListScreen";
import ChatScreen from "../Containers/ChatScreen";
import ProfileScreen from "../Containers/ProfileScreen";
import LaunchScreen from "../Containers/LaunchScreen";

import { Colors } from "../Themes";
import styles from "./Styles/NavigationStyles";

// Manifest of possible screens
const PrimaryNav = TabNavigator(
  {
    ChatListScreen: {
      screen: ChatListScreen
    }
    /*ProfileScreen: {
      screen: ProfileScreen
    }*/
  },
  {
    // Default config for all screens
    //headerMode: "none",
    initialRouteName: "ChatListScreen"
  }
);

const StackNav = StackNavigator({
  Home: {
    screen: PrimaryNav
  },
  Chat: { screen: ChatScreen }
});

export default StackNav;
