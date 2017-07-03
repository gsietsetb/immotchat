// @flow

import React from "react";
import {
  ScrollView,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  LayoutAnimation
} from "react-native";

// I18n
import I18n from "react-native-i18n";

import Icon from "@expo/vector-icons/Entypo";

import { Metrics, Colors } from "../Themes";
// external libs

import Animatable from "react-native-animatable";

import Spinner from "../Components/Spinner";
// Styles
import styles from "./Styles/ProfileScreenStyles";

import { observer, inject } from "mobx-react/native";

@inject("userStore")
@observer
class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: I18n.t("Profile"),
    tabBarLabel: I18n.t("Profile"),
    tabBarIcon: ({ tintColor }) =>
      <Icon
        name="user"
        size={Metrics.icons.small}
        style={[styles.tabIcon, { color: tintColor }]}
      />
  };
  constructor(props) {
    super(props);
    this.state = {
      fullName: "", //"Paolo Mosca",
      email: "", //"paolo@idev.io",
      password: "", //"123456",
      password2: "", //"123456",
      typeForm: "login"
    };
  }
  componentDidMount() {
    // this.props.init();

    const { userStore } = this.props;
    console.log("userinfo", userStore.userInfo);

    /*userStore.saveProfile({
      displayName: "Paolo Mosca"
    });*/
  }

  componentWillUnmount() {}

  goToLogin = () => {
    this.setState({
      typeForm: "login"
    });
  };
  goToRegister = () => {
    this.setState({
      typeForm: "register"
    });
  };
  goToPassword = () => {
    this.setState({
      typeForm: "password"
    });
  };

  componentWillUpdate = () => {
    LayoutAnimation.spring();
  };

  logout = () => {
    const { userStore } = this.props;
    userStore.logout();
  };

  logoutButton = () => {
    const { userStore } = this.props;
    const { fetching } = userStore;

    if (fetching) {
      return <Spinner style={styles.spinner} color={Colors.secondaryDark} />;
    }

    return (
      <TouchableOpacity
        style={[styles.standardButton, styles.activeButton]}
        onPress={this.logout}
      >
        <Text style={styles.activeButtonText}>
          {I18n.t("Disconnect")}
        </Text>
      </TouchableOpacity>
    );
  };

  handleSubmit = () => {
    const { userStore } = this.props;

    const { fullName, email, password, password2, typeForm } = this.state;
    const profile = {
      displayName: fullName
    };
    switch (typeForm) {
      case "login":
        userStore.login(email, password);

        break;
      case "register":
        userStore.createUser(email, password, profile);
        break;
      default:
        break;
    }
  };

  errorMessage = () => {
    const { userStore } = this.props;
    const { errorMessage } = userStore;

    if (errorMessage) {
      return (
        <Text style={styles.errorMessage}>
          {errorMessage}
        </Text>
      );
    }
  };
  loginButton = () => {
    const { userStore } = this.props;
    const { fetching } = userStore;
    const { typeForm } = this.state;

    if (fetching) {
      return <Spinner style={styles.spinner} color={Colors.secondaryDark} />;
    }

    return (
      <TouchableOpacity
        style={[
          styles.standardButton,
          styles.activeButton,
          styles.loginButtonWrapper
        ]}
        onPress={() => {
          this.handleSubmit(typeForm);
        }}
      >
        <Text style={styles.loginText}>
          {I18n.t("signIn")}
        </Text>
      </TouchableOpacity>
    );
  };

  registerButton = () => {
    const { userStore } = this.props;
    const { fetching } = userStore;

    const { typeForm } = this.state;

    if (fetching) {
      return <Spinner style={styles.spinner} color={Colors.secondaryDark} />;
    }

    return (
      <TouchableOpacity
        style={[
          styles.standardButton,
          styles.activeButton,
          styles.loginButtonWrapper
        ]}
        onPress={() => {
          this.handleSubmit(typeForm);
        }}
      >
        <Text style={styles.loginText}>
          {I18n.t("signUp")}
        </Text>
      </TouchableOpacity>
    );
  };

  renderFullNameField = () => {
    const { userStore } = this.props;
    const { fetching } = userStore;

    const { fullName } = this.state;

    return (
      <TextInput
        ref="fullName"
        style={styles.textInput}
        value={fullName}
        editable={!fetching}
        keyboardType="default"
        returnKeyType="next"
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={fullName => {
          return this.setState({ fullName });
        }}
        underlineColorAndroid="transparent"
        onSubmitEditing={() => {
          return this.refs.email.focus();
        }}
        placeholder={I18n.t("placeholder_fullName")}
      />
    );
  };

  renderEmailField = () => {
    const { userStore } = this.props;
    const { fetching } = userStore;

    const { email } = this.state;

    return (
      <TextInput
        ref="email"
        style={styles.textInput}
        value={email}
        editable={!fetching}
        keyboardType="default"
        returnKeyType="next"
        secureTextEntry={false}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={email => {
          return this.setState({ email });
        }}
        underlineColorAndroid="transparent"
        onSubmitEditing={() => {
          return this.refs.password.focus();
        }}
        placeholder={I18n.t("email")}
      />
    );
  };

  renderPasswordField = () => {
    const { userStore } = this.props;
    const { fetching } = userStore;

    const { password, typeForm } = this.state;

    return (
      <TextInput
        ref="password"
        style={styles.textInput}
        value={password}
        editable={!fetching}
        keyboardType="default"
        returnKeyType={typeForm == "login" ? "go" : "next"}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
        onChangeText={password => {
          return this.setState({ password });
        }}
        underlineColorAndroid="transparent"
        onSubmitEditing={() => {
          typeForm == "login"
            ? this.handleSubmit()
            : this.refs.password2.focus();
        }}
        placeholder={I18n.t("password")}
      />
    );
  };

  renderPassword2Field = () => {
    const { userStore } = this.props;
    const { fetching } = userStore;

    const { password2 } = this.state;

    return (
      <TextInput
        ref="password2"
        style={styles.textInput}
        value={password2}
        editable={!fetching}
        keyboardType="default"
        returnKeyType="go"
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
        onChangeText={password2 => {
          return this.setState({ password2 });
        }}
        underlineColorAndroid="transparent"
        onSubmitEditing={this.handleSubmit}
        placeholder={I18n.t("retype_password")}
      />
    );
  };

  renderAccountInfo = () => {
    const { userStore } = this.props;
    const { info } = userStore;
    //console.log('info', info);

    if (info) {
      return (
        <View>
          <View header>
            <Text style={styles.cardTitle}>
              {I18n.t("Account Info")}
            </Text>
          </View>
          {info.displayName &&
            <View>
              <Text style={styles.infoText}>
                {info.displayName}
              </Text>
            </View>}
          {info.email &&
            <View>
              <Text style={styles.infoText}>
                {info.email}
              </Text>
            </View>}
          <View header>
            {this.logoutButton()}
          </View>
        </View>
      );
    }
  };
  renderLogin = () => {
    const { userStore } = this.props;
    const { info } = userStore;

    if (!info) {
      return (
        <View>
          {this.createForm()}
          {this.createButtons()}
        </View>
      );
    }
  };

  createForm = () => {
    const { typeForm } = this.state;

    switch (typeForm) {
      case "login":
        return (
          <View style={styles.form}>
            <View style={styles.row}>
              {this.renderEmailField()}
            </View>

            <View style={styles.row}>
              {this.renderPasswordField()}
            </View>

            {this.errorMessage()}
            {this.loginButton()}
          </View>
        );
        break;
      case "register":
        return (
          <View style={styles.form}>
            <View style={styles.row}>
              {this.renderFullNameField()}
            </View>

            <View style={styles.row}>
              {this.renderEmailField()}
            </View>

            <View style={styles.row}>
              {this.renderPasswordField()}
            </View>

            <View style={styles.row}>
              {this.renderPassword2Field()}
            </View>
            {this.errorMessage()}
            {this.registerButton()}
          </View>
        );
        break;
      default:
        break;
    }
  };

  createButtons = () => {
    const { typeForm } = this.state;

    switch (typeForm) {
      case "login":
        return (
          <View>
            <TouchableOpacity
              style={[styles.standardButton, styles.emptyButton]}
              onPress={this.goToRegister}
            >
              <Text style={styles.emptyButtonText}>
                {I18n.t("register")}
              </Text>
            </TouchableOpacity>
          </View>
        );
        break;
      case "register":
        return (
          <TouchableOpacity
            style={[styles.standardButton, styles.emptyButton]}
            onPress={this.goToLogin}
          >
            <Text style={styles.emptyButtonText}>
              {I18n.t("already_have_account")}
            </Text>
          </TouchableOpacity>
        );
        break;
      default:
        break;
    }
  };

  render() {
    console.log("props", this.props);

    return (
      <ScrollView style={styles.container}>
        {this.renderAccountInfo()}
        {this.renderLogin()}
      </ScrollView>
    );
  }
}

export default ProfileScreen;
