import { StackNavigator, TabNavigator, TabBarBottom } from "react-navigation";

import ChatListScreen from "../Containers/ChatListScreen";
import ChatScreen from "../Containers/ChatScreen";
import InfoChatScreen from "../Containers/InfoChatScreen";
import UserScreen from "../Containers/UserScreen";
import ProfileScreen from "../Containers/ProfileScreen";
import LaunchScreen from "../Containers/LaunchScreen";

import { Colors, Metrics } from "../Themes";
import styles from "./Styles/NavigationStyles";

// Manifest of possible screens
const PrimaryNav = TabNavigator(
  {
    ChatListScreen: {
      screen: ChatListScreen
      //tabBarIcon: {}
    },
    ProfileScreen: {
      screen: ProfileScreen
    }
  },
  {
    tabBarOptions: {
      activeTintColor: Colors.secondaryDark,
      inactiveTintColor: Colors.primaryLight,
      labelStyle: {
        fontSize: 12
      },
      style: {
        backgroundColor: Colors.clear
      }
    },

    lazy: true,
    // Default config for all screens
    //headerMode: "none",
    initialRouteName: "ChatListScreen"
  }
);

const StackNav = StackNavigator(
  {
    Home: {
      screen: PrimaryNav
    },
    Chat: { screen: ChatScreen },
    InfoChat: { screen: InfoChatScreen },
    User: { screen: UserScreen }
  },
  {
    navigationOptions: {
      headerStyle: {
        marginTop: Metrics.statusBar
      }

      /*headerStyle: {
        marginTop: 24
      }*/
    }
  }
);

export default StackNav;
