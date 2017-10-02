import React from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
  TouchableOpacity
} from "react-native";

import Spinner from "../Components/Spinner";

// import { Card, CardItem, Content, Body } from 'native-base';
import I18n from "react-native-i18n";
import Animatable from "react-native-animatable";

import { createIconSetFromFontello } from "react-native-vector-icons";

import RoundedButton from "../Components/RoundedButton";

// import LoginForm from '../Components/LoginForm';
import { observer, inject } from "mobx-react/native";

import { Metrics, Colors, Images } from "../Themes";

// Styles
import styles from "./Styles/LoginScreenStyles";

@inject("userStore", "nav")
@observer
class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fullName: "",
      username: "",
      email: __DEV__ ? "paolo@idev.io" : "",
      password: __DEV__ ? "123456" : "",
      password2: "",
      typeForm: "login"
    };
  }

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

  componentWillReact = () => {
    const { userStore, nav } = this.props;
    console.log("componentWillReact LoginScreen");

    console.log("userStore.currentUser", userStore.currentUser);

    if (userStore.hydrated && userStore.currentUser) {
      console.log("componentWillReact LoginScreen");
      nav.reset("Home");
    }
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
      console.log("errorMessage", errorMessage);
      return <Text style={styles.errorMessage}>{errorMessage}</Text>;
    }
  };

  loginButton = () => {
    const { userStore } = this.props;

    const { typeForm } = this.state;

    if (userStore.fetching) {
      return <Spinner style={styles.spinner} color={Colors.secondaryDark} />;
    }

    return (
      <RoundedButton
        onPress={() => {
          this.handleSubmit(typeForm);
        }}
        text={I18n.t("signIn")}
      />
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
      <RoundedButton
        onPress={() => {
          this.handleSubmit(typeForm);
        }}
        text={I18n.t("signUp")}
      />
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
    const { email } = this.state;

    return (
      <TextInput
        ref="email"
        style={styles.textInput}
        value={email}
        editable={!userStore.fetching}
        keyboardType="default"
        returnKeyType="next"
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={email => this.setState({ email })}
        underlineColorAndroid="transparent"
        onSubmitEditing={() => this.refs.password.focus()}
        placeholder={I18n.t("email")}
      />
    );
  };

  renderPasswordField = () => {
    const { userStore } = this.props;
    const { password } = this.state;

    return (
      <TextInput
        ref="password"
        style={styles.textInput}
        value={password}
        editable={!userStore.fetching}
        keyboardType="default"
        returnKeyType={"go"}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
        onChangeText={password => this.setState({ password })}
        underlineColorAndroid="transparent"
        onSubmitEditing={() => {
          this.handleSubmit();
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
  createForm = () => {
    const { typeForm } = this.state;

    switch (typeForm) {
      case "login":
        return (
          <View style={styles.form}>
            <View style={styles.row}>{this.renderEmailField()}</View>

            <View style={styles.row}>{this.renderPasswordField()}</View>

            {this.errorMessage()}
            {this.loginButton()}
            <TouchableOpacity
              style={[styles.standardButton, styles.emptyButton]}
              onPress={this.goToRegister}
            >
              <Text style={styles.emptyButtonText}>{I18n.t("register")}</Text>
            </TouchableOpacity>
          </View>
        );
        break;
      case "register":
        return (
          <View style={styles.form}>
            <View style={styles.row}>{this.renderFullNameField()}</View>

            <View style={styles.row}>{this.renderEmailField()}</View>

            <View style={styles.row}>{this.renderPasswordField()}</View>

            <View style={styles.row}>{this.renderPassword2Field()}</View>
            {this.errorMessage()}
            {this.registerButton()}
            <TouchableOpacity
              style={[styles.standardButton, styles.emptyButton]}
              onPress={this.goToLogin}
            >
              <Text style={styles.emptyButtonText}>
                {I18n.t("already_have_account")}
              </Text>
            </TouchableOpacity>
          </View>
        );
        break;
      default:
        break;
    }
  };

  render() {
    const { userStore } = this.props;
    console.log("render isLoggedIn", userStore.isLoggedIn);
    if (userStore.hydrated) {
      return (
        <View style={styles.mainContainer}>
          <ScrollView
            style={styles.container}
            keyboardShouldPersistTaps="always"
          >
            <KeyboardAvoidingView behavior="position">
              <View style={styles.logoContainer}>
                <Image source={Images.logo} style={styles.logo} />
              </View>
              {this.createForm()}
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      );
    } else {
      return <View />;
    }
  }
}

export default LoginScreen;
