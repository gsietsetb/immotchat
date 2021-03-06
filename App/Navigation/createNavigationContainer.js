// @flow
import { addNavigationHelpers } from "react-navigation";
import { inject, observer } from "mobx-react/native";
import React from "react";

//import firebase from "../Lib/firebase";

import FCM, {
  FCMEvent,
  RemoteNotificationResult,
  WillPresentNotificationResult,
  NotificationType
} from "react-native-fcm";

import { Linking, Platform } from "react-native";

import autobind from "autobind-decorator";

import NavigationStore from "../MobX/NavigationStore";
import handleBackButton from "../Lib/handleBackButton";

import { routeMatcher } from "route-matcher";

export default function createNavigationContainer(
  Component: ReactClass<*>
): ReactClass<*> {
  @inject("nav", "roomStore", "userStore")
  @handleBackButton
  @observer
  class NavigationContainer extends React.Component {
    static defaultProps = {
      nav: null
    };
    props: {
      nav: NavigationStore
    };

    componentDidMount() {
      /*if (Platform.OS === "android") {
        Linking.getInitialURL().then(url => {
          console.log("url", url);
          this.navigate(url);
        });
      } else {
        Linking.addEventListener("url", this.handleOpenURL);
      }*/

      /*firebase.messaging().requestPermissions(); //for IOS
      firebase
        .messaging()
        .getToken()
        .then(token => {
          console.log("Device FCM Token: ", token);
        });
      */
      FCM.getInitialNotification().then(notif => {
        console.log("INITIAL NOTIFICATION", notif);
      });
      /*firebase
        .messaging()
        .getInitialNotification()
        .then(notif => {
          console.log("INITIAL NOTIFICATION", notif);
        });
        */
      this.notificationListener = FCM.on(FCMEvent.Notification, async notif => {
        // do some component related stuff

        if (notif.local_notification) {
          //this is a local notification
        }
        if (notif.opened_from_tray) {
          //app is open/resumed because user clicked banner
        }
        // await someAsyncCall();

        if (Platform.OS === "ios") {
          //optional
          //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
          //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
          //notif._notificationType is available for iOS platfrom
          switch (notif._notificationType) {
            case NotificationType.Remote:
              notif.finish(RemoteNotificationResult.NewData); //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
              break;
            case NotificationType.NotificationResponse:
              notif.finish();
              break;
            case NotificationType.WillPresent:
              notif.finish(WillPresentNotificationResult.All); //other types available: WillPresentNotificationResult.None
              break;
          }
        }
      });
      /*this.notificationListener = firebase.messaging().onMessage(notif => {
        console.log("notif: ", notif);
      });*/
      /*firebase.messaging().onMessage(message => {
        console.log("message: ", message);
        // TODO
      });*/
      /*firebase.messaging().onTokenRefresh(token => {
        console.log("Refreshed FCM token: ", token);
      });*/
      this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, token => {
        console.log("RefreshToken FCM", token);
        // fcm token may not be available on first load, catch it here
      });
      /*this.refreshTokenListener = firebase.messaging().onTokenRefresh(token => {
        console.log("refresh token: ", token);
        // fcm token may not be available on first load, catch it here
      });
      */
      /*
      Linking.getInitialURL()
        .then(url => {
          if (url) {
            console.log("Initial url is: " + url);

            const baseUrl = Constants.linkingUri.replace("+", "");
            console.log("linkingUri", Constants.linkingUri);
            console.log("baseUrl", baseUrl);
            let finalUrl = url;

            if (finalUrl.indexOf(Constants.linkingUri) !== -1) {
              finalUrl = finalUrl.replace(Constants.linkingUri, "");
            }
            if (finalUrl.indexOf(baseUrl) !== -1) {
              finalUrl = finalUrl.replace(baseUrl, "");
            }
            let query = qs.parse(finalUrl);
            console.log("query", query);

            if (query.room) {
              setTimeout(() => {
                nav.navigate("Chat", { chatRoom: { id: query.room } });
              }, 500);
            }
          }
        })
        .catch(err => console.error("An error occurred", err));
        */
    }
    componentDidUnMount() {
      //Linking.removeEventListener("url", this.handleOpenURL);
      this.notificationListener.remove();
      this.refreshTokenListener.remove();
    }

    handleOpenURL = event => {
      console.log("event", event);

      this.navigate(event.url);
      //alert(event);
      /*
      let url = event.url;
      const baseUrl = Constants.linkingUri.replace("+", "");
      if (url.indexOf(Constants.linkingUri) !== -1) {
        url = url.replace(Constants.linkingUri, "");
      }
      if (url.indexOf(baseUrl) !== -1) {
        url = url.replace(baseUrl, "");
      }
      let query = qs.parse(url);

      console.log("query", query);

      if (query.room) {
        setTimeout(() => {
          nav.navigate("Chat", { chatRoom: { id: query.room } });
        }, 500);
      }*/
      /*let data;
      if (query) {
        data = qs.parse(query);
      } else {
        data = null;
      }

      this.setState({redirectData: data});*/
    };

    navigate = url => {
      const { nav, userStore, roomStore } = this.props;

      if (url) {
        const route = url.replace(/.*?:\/\//g, "");
        let roomDL = routeMatcher("room/:roomId");

        let found = roomDL.parse(route);
        if (found) {
          console.log("found", found);
          const { roomId } = found;
          roomStore.enterRoom(roomId, userStore.currentUser);
          nav.navigate("Chat", { chatRoom: { id: roomId } });
        }
      }
    };

    @autobind
    backButtonPressed(): boolean {
      const { nav } = this.props;
      const result: boolean = !!nav.goBack();
      if (nav.state.routeName === "AppDispatcher") {
        return !!nav.goBack();
      }
      return result;
    }

    render() {
      const { nav } = this.props;
      const navigationHelper = addNavigationHelpers({
        dispatch: nav.dispatchNavigation,
        state: nav.navigationState
      });
      return <Component navigation={navigationHelper} />;
    }
  }
  return NavigationContainer;
}
