import { StackNavigator, TabNavigator, TabBarBottom } from "react-navigation";

import ChatListScreen from "../Containers/ChatListScreen";
import ChatScreen from "../Containers/ChatScreen";
import InfoChatScreen from "../Containers/InfoChatScreen";
import UserScreen from "../Containers/UserScreen";
import ProfileScreen from "../Containers/ProfileScreen";
import LaunchScreen from "../Containers/LaunchScreen";
import LoginScreen from "../Containers/LoginScreen";
import BrowserScreen from "../Containers/BrowserScreen";
import GalleryScreen from "../Containers/GalleryScreen";

import { Colors, Metrics } from "../Themes";
import styles from "./Styles/NavigationStyles";

// Manifest of possible screens
const TabNav = TabNavigator(
  {
    ChatTab: {
      screen: ChatListScreen
      //tabBarIcon: {}
    },
    ProfileTab: {
      screen: ProfileScreen
    }
  },
  {
    headerMode: "none",
    swipeEnabled: false,
    animationEnabled: false,
    lazy: true,
    navigationOptions: { tabBarVisible: false },
    // Default config for all screens
    //headerMode: "none",
    initialRouteName: "ChatTab"
  }
);

const StackNav = StackNavigator(
  {
    Home: {
      screen: TabNav
    },
    Chat: { screen: ChatScreen },
    InfoChat: { screen: InfoChatScreen },
    User: { screen: UserScreen },
    Browser: {
      screen: BrowserScreen
    },
    Gallery: {
      screen: GalleryScreen
    },
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    headerMode: "none",
    navigationOptions: {
      /*headerStyle: {
        marginTop: 24
      }*/
    }
  }
);

export default StackNav;
