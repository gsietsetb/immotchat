// @flow

import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Modal,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform
} from "react-native";

import { Colors, Metrics } from "../Themes";
import styles from "./Styles/ModalPickerStyles";

import I18n from "react-native-i18n";

export default class ModalPicker extends Component {
  constructor() {
    super();

    //this._bind("onChange", "open", "close", "renderChildren");

    this.state = {
      animationType: "slide",
      modalVisible: false,
      transparent: false,
      selected: "please select"
    };
  }

  componentDidMount() {
    this.setState({ selected: this.props.initValue });
    this.setState({ cancelText: this.props.cancelText });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initValue != this.props.initValue) {
      this.setState({ selected: nextProps.initValue });
    }
  }

  onChange = item => {
    this.props.onChange(item);
    this.setState({ selected: item.label });
    this.close();
  };

  close = () => {
    this.setState({
      modalVisible: false
    });
  };

  open = () => {
    this.setState({
      modalVisible: true
    });
  };

  renderSection = section => {
    return (
      <View
        key={section.key}
        style={[styles.sectionStyle, this.props.sectionStyle]}
      >
        <Text style={[styles.sectionTextStyle, this.props.sectionTextStyle]}>
          {section.label}
        </Text>
      </View>
    );
  };

  renderOption = option => {
    return (
      <TouchableOpacity key={option.key} onPress={() => this.onChange(option)}>
        <View style={[styles.optionStyle, this.props.optionStyle]}>
          <Text style={[styles.optionTextStyle, this.props.optionTextStyle]}>
            {option.label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderOptionList = () => {
    const { data, overlayStyle } = this.props;

    var options = data.map(item => {
      if (item.section) {
        return this.renderSection(item);
      } else {
        return this.renderOption(item);
      }
    });

    return (
      <View style={[styles.overlayStyle, overlayStyle]} key={"modalPicker"}>
        <View style={styles.optionContainer}>
          <ScrollView keyboardShouldPersistTaps="always">
            <View>{options}</View>
          </ScrollView>
        </View>
        <View style={styles.cancelContainer}>
          <TouchableOpacity onPress={this.close}>
            <View style={[styles.cancelStyle, this.props.cancelStyle]}>
              <Text
                style={[styles.cancelTextStyle, this.props.cancelTextStyle]}
              >
                {this.props.cancelText}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  renderChildren = () => {
    if (this.props.children) {
      return this.props.children;
    }
    return (
      <View style={[styles.selectStyle, this.props.selectStyle]}>
        <Text style={[styles.selectTextStyle, this.props.selectTextStyle]}>
          {this.state.selected}
        </Text>
      </View>
    );
  };

  render() {
    const dp = (
      <Modal
        transparent={true}
        ref="modal"
        visible={this.state.modalVisible}
        onRequestClose={this.close}
        animationType={this.state.animationType}
      >
        {this.renderOptionList()}
      </Modal>
    );

    return (
      <View style={this.props.style}>
        {dp}
        <TouchableOpacity onPress={this.open}>
          {this.renderChildren()}
        </TouchableOpacity>
      </View>
    );
  }
}
