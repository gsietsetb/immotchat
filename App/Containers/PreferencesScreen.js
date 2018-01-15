// @flow

import React from "react";
import {
  ScrollView,
  Text,
  KeyboardAvoidingView,
  View,
  ListView,
  Image,
  WebView,
  Alert,
  Linking,
  TouchableOpacity,
  Share
} from "react-native";

import KeyboardSpacer from "react-native-keyboard-spacer";

import { observer, inject } from "mobx-react/native";
import _ from "lodash";

import { Metrics } from "../Themes";
import NavBar from "../Components/NavBar";
// external libs
//import Icon from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/Entypo";
//import Animatable from "react-native-animatable";

//import FooterBrand from "../Components/FooterBrand";

//import AlertMessage from "../Components/AlertMessage";
//import { connect } from "react-redux";
import GooglePlacesAutocomplete from "../Components/GooglePlacesAutocomplete";
import ModalPicker from "../Components/ModalPicker";
import ModalPlacePicker from "../Components/ModalPlacePicker";

import t from "tcomb-form-native";

//import { RoomsActions } from "../Redux/RoomRedux";
// Styles
import styles from "./Styles/PreferencesScreenStyles";

import FormStyle from "../Components/Styles/FormStyle";

/*import { createIconSetFromFontello } from "react-native-vector-icons";
import fontelloConfig from "../Themes/Fonts/config.json";
const Icon = createIconSetFromFontello(fontelloConfig, "immo");*/

const Form = t.form.Form;

const Preferences = t.struct({
  phone: t.String,
  agency: t.String,
  url: t.String
});

const budgets = [
  {
    key: 100000,
    label: 100000
  },
  {
    key: 200000,
    label: 200000
  }
];
const types = [
  {
    key: "flat",
    label: "Flat"
  },
  {
    key: "house",
    label: "House"
  }
];

const sizes = [
  {
    key: "<50",
    label: "Under 50"
  },
  {
    key: "50",
    label: "50 - 100"
  },
  {
    key: "100",
    label: "50 - 100"
  },
  {
    key: "1000",
    label: "Over 100"
  }
];

// I18n
import I18n from "react-native-i18n";

@inject("nav", "userStore")
@observer
export default class PreferencesScreen extends React.Component {
  constructor(props) {
    super(props);
    // If you need scroll to bottom, consider http://bit.ly/2bMQ2BZ
    const { userStore } = props;

    console.log("userinfo", userStore.info);
    if (userStore.info.type && userStore.info.type === "agent") {
      this.state = {
        value: {
          phone:
            (userStore.info.preferences && userStore.info.preferences.phone) ||
            null,
          agency:
            (userStore.info.preferences && userStore.info.preferences.agency) ||
            null,
          url:
            (userStore.info.preferences && userStore.info.preferences.url) ||
            null
        },
        area:
          (userStore.info.preferences && userStore.info.preferences.area) ||
          null
      };
    } else {
      this.state = {
        budget:
          (userStore.info.preferences && userStore.info.preferences.budget) ||
          null,
        type:
          (userStore.info.preferences && userStore.info.preferences.type) ||
          null,
        size:
          (userStore.info.preferences && userStore.info.preferences.size) ||
          null,
        area:
          (userStore.info.preferences && userStore.info.preferences.area) ||
          null
      };
    }
  }

  skip = () => {
    const { userStore, nav } = this.props;

    const { afterLogin } = nav.params;

    if (afterLogin) {
      userStore.justCreated = false;
      nav.reset("Home");
    } else {
      nav.goBack();
    }
  };

  save = () => {
    const { budget, type, area, size, value } = this.state;

    const { userStore, nav } = this.props;
    const { afterLogin } = nav.params;

    let preferences = {};

    if (userStore.info.type && userStore.info.type === "agent") {
      console.log("value", value);

      preferences = {
        ...value,
        area
      };
    } else {
      preferences = {
        budget,
        type,
        area,
        size
      };
    }

    let profile = { preferences };
    console.log("profile", profile);
    userStore.updateUserProfile(profile);

    if (afterLogin) {
      userStore.justCreated = false;
      nav.reset("Home");
    } else {
      nav.goBack();
    }
  };

  onChange = value => {
    this.setState({
      value
    });
  };
  selectBudget = budget => {
    console.log("budget", budget);
    this.setState({
      budget
    });
  };
  selectType = type => {
    console.log("type", type);
    this.setState({
      type
    });
  };
  selectSize = size => {
    console.log("size", size);
    this.setState({
      size
    });
  };
  selectArea = area => {
    console.log("area", area);
    this.setState({
      area
    });
  };

  googlePlacesInput = () => {
    const { area } = this.state;
    return (
      <ModalPlacePicker
        initValue={
          (area && area.address) || I18n.t("preferences.picker.area.select")
        }
        cancelText={I18n.t("preferences.picker.cancel")}
        overlayStyle={styles.overlayStyle}
        selectStyle={styles.selectStyle}
        optionStyle={styles.optionStyle}
        onChange={this.selectArea}
      />
    );
  };
  renderIntro = () => {
    const { userStore } = this.props;

    if (userStore.info.type && userStore.info.type === "agent") {
      return (
        <Text style={styles.description}>
          {I18n.t("preferences.picker.agent.description")}
        </Text>
      );
    }
    return (
      <Text style={styles.description}>
        {I18n.t("preferences.picker.general.description")}
      </Text>
    );
  };

  renderBudget = () => {
    const { budget } = this.state;

    return (
      <View>
        <Text style={styles.label}>
          {I18n.t("preferences.picker.budget.label")}
        </Text>
        {/*<Text style={styles.description}>
        {I18n.t("preferences.picker.budget.description")}
      </Text>*/}
        <ModalPicker
          data={budgets}
          initValue={
            (budget && budget.label) ||
            I18n.t("preferences.picker.budget.select")
          }
          cancelText={I18n.t("preferences.picker.cancel")}
          selectStyle={styles.selectStyle}
          optionStyle={styles.optionStyle}
          onChange={this.selectBudget}
        />
      </View>
    );
  };

  renderType = () => {
    const { type } = this.state;

    return (
      <View>
        <Text style={styles.label}>
          {I18n.t("preferences.picker.type.label")}
        </Text>
        {/*<Text style={styles.description}>
        {I18n.t("preferences.picker.type.description")}
      </Text>*/}
        <ModalPicker
          data={types}
          initValue={
            (type && type.label) || I18n.t("preferences.picker.type.select")
          }
          cancelText={I18n.t("preferences.picker.cancel")}
          selectStyle={styles.selectStyle}
          optionStyle={styles.optionStyle}
          onChange={this.selectType}
        />
      </View>
    );
  };

  renderSize = () => {
    const { size } = this.state;

    return (
      <View>
        <Text style={styles.label}>
          {I18n.t("preferences.picker.size.label")}
        </Text>
        {/*<Text style={styles.description}>
        {I18n.t("preferences.picker.size.description")}
      </Text>*/}
        <ModalPicker
          data={sizes}
          initValue={
            (size && size.label) || I18n.t("preferences.picker.size.select")
          }
          cancelText={I18n.t("preferences.picker.cancel")}
          selectStyle={styles.selectStyle}
          optionStyle={styles.optionStyle}
          onChange={this.selectSize}
        />
      </View>
    );
  };

  renderPrivateForm = () => {
    const { userStore } = this.props;

    if (userStore.info.type && userStore.info.type === "agent") {
      return;
    }
    return (
      <View>
        {this.renderIntro()}
        {this.renderBudget()}
        {this.renderType()}
        {this.renderSize()}
      </View>
    );
  };

  renderAgentForm = () => {
    const { userStore } = this.props;

    if (userStore.info.type && userStore.info.type !== "agent") {
      return;
    }

    const { value } = this.state;

    const options = {
      stylesheet: FormStyle,
      auto: "placeholders",
      fields: {
        phone: {
          label: I18n.t("preferences.form.agent.phone.label"),
          placeholder: I18n.t("preferences.form.agent.phone.placeholder")
        },
        agency: {
          label: I18n.t("preferences.form.agent.phone.label"),
          placeholder: I18n.t("preferences.form.agent.agency.placeholder")
        },
        url: {
          label: I18n.t("preferences.form.agent.url.label"),
          placeholder: I18n.t("preferences.form.agent.url.placeholder"),
          autoCapitalize: "none",
          keyboardType: "email-address"
        }
      }
    };
    return (
      <View>
        {this.renderIntro()}
        <Form
          ref={preferencesForm => {
            this.preferencesForm = preferencesForm;
          }}
          type={Preferences}
          onChange={this.onChange}
          value={value}
          options={options}
        />
      </View>
    );
  };

  renderForm = () => {
    const { budget, type, size } = this.state;
    return (
      <ScrollView keyboardShouldPersistTaps="always">
        {this.renderPrivateForm()}
        {this.renderAgentForm()}
        <Text style={styles.label}>
          {I18n.t("preferences.picker.area.label")}
        </Text>
        {/*<Text style={styles.description}>
          I18n.t("preferences.picker.area.description")
        </Text>*/}

        {this.googlePlacesInput()}
        <KeyboardSpacer />
      </ScrollView>
    );
  };

  renderSkip = () => {
    const { nav } = this.props;
    const { afterLogin } = nav.params;

    if (afterLogin) {
      return (
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => this.skip()}
        >
          <Text style={[styles.button, styles.cancel]}>
            {I18n.t("preferences.buttons.skip")}
          </Text>
        </TouchableOpacity>
      );
    }
  };
  renderFooter = () => {
    return (
      <View style={styles.footer}>
        {this.renderSkip()}
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => this.save()}
        >
          <Text style={[styles.button, styles.submit]}>
            {I18n.t("preferences.buttons.save")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  render() {
    const { nav } = this.props;
    const { afterLogin } = nav.params;

    return (
      <View style={styles.mainContainer}>
        <NavBar
          leftButton={!afterLogin}
          title={I18n.t("preferences.window.title")}
        />
        {this.renderForm()}
        {this.renderFooter()}
      </View>
    );
  }
}
