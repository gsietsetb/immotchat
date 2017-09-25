import React from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Animated,
  Image,
  TouchableOpacity,
  Platform
} from "react-native";
import styles from "./Styles/NavBarStyle";

import Icon from "react-native-vector-icons/Entypo";

import { observer, inject } from "mobx-react/native";
import { Colors, Metrics, Icons, Images } from "../Themes";
import I18n from "react-native-i18n";

@inject("nav")
@observer
class NavBar extends React.Component {
  renderTitle = () => {
    const { showLogo, title } = this.props;
    if (showLogo) {
      return <Image source={Images.logoSmall} resizeMode="contain" />;
    } else {
      return (
        <Text numberOfLines={1} style={styles.title} ellipsizeMode="tail">
          {title}
        </Text>
      );
    }
  };

  rightButton = () => {
    const { rightButton } = this.props;

    if (rightButton) {
      return rightButton;
    }
  };

  goBack = () => {
    const { nav } = this.props;
    nav.goBack();
  };

  leftButton = () => {
    const { leftButton } = this.props;

    if (leftButton) {
      return (
        <TouchableOpacity style={styles.backButton} onPress={this.goBack}>
          <Icon
            name="chevron-thin-left"
            size={Metrics.icons.medium}
            color={Colors.secondaryDark}
          />
        </TouchableOpacity>
      );
    }
  };

  render() {
    return (
      <View key="navbar" style={styles.wrapper}>
        {this.leftButton()}
        <View style={styles.titleWrapper} pointerEvents="box-none">
          {this.renderTitle()}
        </View>
        <View style={styles.rightWrapper}>{this.rightButton()}</View>
      </View>
    );
  }
}

export default NavBar;
