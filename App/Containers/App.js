import "../Config";
import DebugConfig from "../Config/DebugConfig";
import React, { Component } from "react";

import { Provider } from "mobx-react/native";
import branch from "react-native-branch";

import { autorun } from "mobx";

import stores from "../MobX";
import { routeMatcher } from "route-matcher";

import createNavigationContainer from "../Navigation/createNavigationContainer";

import AppNavigation from "../Navigation/AppNavigation";

stores.nav.setNavigator(AppNavigation);

let branchReceiving = false;
const AppNavigationMobx = createNavigationContainer(AppNavigation);

autorun("NavigationStore State", () => {
  console.log("navigationState", stores.nav.navigationState);
  console.log("current state", stores.nav.state);
});

let _unsubscribeFromBranch = null;
export default class App extends Component {
  componentWillMount() {
    //const { userStore } = stores;
    //userStore.roomAfterLogin = "-KnZUG1LMdOlBa9ixO24";
    //OneSignal.addEventListener("received", this.onReceived);
    _unsubscribeFromBranch = branch.subscribe(results => {
      const { error, params } = results;
      console.log("error", error);
      if (branchReceiving) {
        return;
      }
      if (error) {
        return;
      }
      if (params["+non_branch_link"]) {
        setTimeout(() => {
          this.navigate(params["+non_branch_link"]);
        }, 500);

        return;
      }
      if (params["+clicked_branch_link"]) {
        setTimeout(() => {
          this.navigateBranch(params);
        }, 500);
        // this is for branch link
        return;
      }

      branchReceiving = true;
      setTimeout(() => {
        branchReceiving = false;
      }, 3000);
    });
  }

  navigateBranch = params => {
    console.log("navigateBranch", params);
    const { userStore } = stores;
    const { userId, roomId } = params;
    if (userId) {
      userStore.userInviteAfterLogin = userId;
    }
    if (roomId) {
      userStore.roomAfterLogin = roomId;
    }
  };
  navigate = url => {
    const { nav, userStore, roomStore } = stores;
    console.log("navigate", url);
    if (url) {
      const route = url.replace(/.*?:\/\//g, "");
      let roomDL = routeMatcher("room/:roomId");

      let foundRoom = roomDL.parse(route);
      if (foundRoom) {
        console.log("found", foundRoom);
        const { roomId } = foundRoom;
        userStore.roomAfterLogin = roomId;
      }
      let userInvite = routeMatcher("userinvite/:userId");
      let foundInvite = userInvite.parse(route);
      if (foundInvite) {
        console.log("found", foundInvite);
        const { userId } = foundInvite;
        userStore.userInviteAfterLogin = userId;
      }
    }
  };

  componentWillUnmount() {
    const { userStore } = stores;
    userStore.releaseBranch();

    if (_unsubscribeFromBranch) {
      _unsubscribeFromBranch();
      _unsubscribeFromBranch = null;
    }
  }
  render() {
    return (
      <Provider {...stores}>
        <AppNavigationMobx />
      </Provider>
    );
  }
}
