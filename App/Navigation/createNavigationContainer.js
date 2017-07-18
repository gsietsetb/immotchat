// @flow
import { addNavigationHelpers } from "react-navigation";
import { inject, observer } from "mobx-react/native";
import React from "react";

import { Constants } from "expo";

import { Linking } from "react-native";

import autobind from "autobind-decorator";

import NavigationStore from "../MobX/NavigationStore";
import handleBackButton from "../Lib/handleBackButton";

import qs from "querystringify";

export default function createNavigationContainer(
  Component: ReactClass<*>
): ReactClass<*> {
  @inject("nav")
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
      this.addLinkingListener();
    }
    componentDidUnMount() {
      Linking.removeEventListener("url", this.handleDeepLink);
    }
    addLinkingListener = () => {
      console.log("adding linking listener");
      Linking.addEventListener("url", this.handleDeepLink);
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

            if (finalUrl) {
              Linking.openURL(Constants.linkingUri + finalUrl);
            }
          }
        })
        .catch(err => console.error("An error occurred", err));
    };

    handleDeepLink = event => {
      const { nav } = this.props;
      console.log("event", event);
      //alert(event);
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
      }
      /*let data;
      if (query) {
        data = qs.parse(query);
      } else {
        data = null;
      }

      this.setState({redirectData: data});*/
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
