import React, { Component } from "react";
import {
  ScrollView,
  Text,
  Image,
  View,
  TextInput,
  LayoutAnimation,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform
} from "react-native";

//import LinearGradient from "react-native-linear-gradient";
//import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
//import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { LoginButton, AccessToken } from "react-native-fbsdk";

import { observer, inject } from "mobx-react/native";

import { Images, Metrics, Colors } from "../Themes";

import Spinner from "../Components/Spinner";
// Styles
import styles from "./Styles/LoginScreenStyles";

import I18n from "react-native-i18n";

@inject("userStore", "nav")
@observer
export default class MyProfileScreen extends Component {
  constructor(props: LoginScreenProps) {
    super(props);
    this.state = {
      fullName: "",
      username: "",
      email: "paolo@email.es",
      password: "IlovePizza",
      password2: "",
      typeForm: "login"
    };
  }
  /*

  email: "paolo@email.es",
  password: "IlovePizza",

  */
  componentWillUpdate = () => {
    LayoutAnimation.spring();
  };

  componentWillReact = () => {
    const { userStore, nav } = this.props;
    console.log("componentWillReact LoginScreen");

    console.log("userStore.isLoggedIn", userStore.isLoggedIn);
    console.log("userStore.currentUser", userStore.currentUser);
    if (userStore.hydrated && userStore.isLoggedIn && userStore.currentUser) {
      console.log("componentWillReact LoginScreen");
      nav.reset("Home");
    }

    /*if (postStore.posts) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(postStore.posts.slice())
      });
    }*/
  };

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

  loginWithFacebook = () => {
    const { userStore } = this.props;

    userStore.loginWithFacebook();
  };
  handleSubmit = () => {
    const { userStore } = this.props;

    const {
      fullName,
      email,
      password,
      password2,
      username,
      typeForm
    } = this.state;

    switch (typeForm) {
      case "login":
        if (email && password) {
          userStore.login(email, password);
        }

        break;
      case "register":
        if (fullName && email && password && password2 && username) {
          const user = {
            email,
            name: fullName,
            password: password,
            password2,
            username
          };
          console.log("prima", user);
          userStore.registerUser(user);
        }

        break;
      default:
        break;
    }
  };

  logout = () => {
    const { userStore } = this.props;
    userStore.logout();
  };

  errorMessage = () => {
    const { userStore } = this.props;
    const { errorMessage } = userStore;

    if (errorMessage) {
      return <Text style={styles.errorMessage}>{errorMessage}</Text>;
    }
  };

  loginButton = () => {
    const { userStore } = this.props;
    const { typeForm, email, password } = this.state;

    let activeStyle = styles.submitButtonInactive;
    if (email && password) {
      activeStyle = null;
    }
    if (userStore.fetching) {
      return <Spinner style={styles.spinner} color={Colors.white} />;
    }

    return (
      <TouchableOpacity
        disabled={!email || !password}
        style={[styles.standardButton, styles.submitButton, activeStyle]}
        onPress={() => {
          this.handleSubmit(typeForm);
        }}
      >
        <Text style={styles.submitText}>{I18n.t("login")}</Text>
      </TouchableOpacity>
    );
  };

  registerButton = () => {
    const { userStore } = this.props;
    const { fetching } = userStore;

    const {
      typeForm,
      fullName,
      email,
      password,
      password2,
      username
    } = this.state;
    let activeStyle = styles.submitButtonInactive;
    if (fullName && email && password && password2 && username) {
      activeStyle = null;
    }

    if (fetching) {
      return <Spinner style={styles.spinner} color={Colors.white} />;
    }

    return (
      <TouchableOpacity
        style={[styles.standardButton, styles.submitButton, activeStyle]}
        disabled={!fullName || !email || !password || !password2 || !username}
        onPress={() => {
          this.handleSubmit(typeForm);
        }}
      >
        <Text style={styles.actionText}>{I18n.t("register")}</Text>
      </TouchableOpacity>
    );
  };

  renderFullNameField = () => {
    const { userStore } = this.props;
    const { fetching } = userStore;

    const { fullName } = this.state;

    return (
      <TextInput
        ref={r => {
          this._fullName = r;
        }}
        style={styles.textInput}
        value={fullName}
        placeholderTextColor={Colors.silver}
        editable={!userStore.fetching}
        keyboardType="default"
        returnKeyType="next"
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={fullName => {
          return this.setState({ fullName });
        }}
        underlineColorAndroid="transparent"
        onSubmitEditing={() => {
          return this._username.focus();
        }}
        placeholder={I18n.t("placeholder_fullname")}
      />
    );
  };

  renderUserNameField = () => {
    const { userStore } = this.props;
    const { fetching } = userStore;

    const { username } = this.state;

    return (
      <TextInput
        ref={r => {
          this._username = r;
        }}
        style={styles.textInput}
        value={username}
        placeholderTextColor={Colors.silver}
        editable={!userStore.fetching}
        keyboardType="default"
        returnKeyType="next"
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={username => {
          return this.setState({ username });
        }}
        underlineColorAndroid="transparent"
        onSubmitEditing={() => {
          return this._email.focus();
        }}
        placeholder={I18n.t("placeholder_username")}
      />
    );
  };

  renderEmailField = () => {
    const { userStore } = this.props;
    const { fetching } = userStore;

    const { email } = this.state;

    return (
      <TextInput
        ref={r => {
          this._email = r;
        }}
        style={styles.textInput}
        value={email}
        placeholderTextColor={Colors.silver}
        editable={!userStore.fetching}
        keyboardType="default"
        returnKeyType="next"
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={email => {
          return this.setState({ email });
        }}
        underlineColorAndroid="transparent"
        onSubmitEditing={() => {
          return this._password.focus();
        }}
        placeholder={I18n.t("placeholder_email")}
      />
    );
  };

  renderPasswordField = () => {
    const { userStore } = this.props;
    const { fetching } = userStore;

    const { password, typeForm } = this.state;

    return (
      <TextInput
        ref={r => {
          this._password = r;
        }}
        style={styles.textInput}
        value={password}
        placeholderTextColor={Colors.silver}
        editable={!userStore.fetching}
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
          typeForm == "login" ? this.handleSubmit() : this._password2.focus();
        }}
        placeholder={I18n.t("placeholder_password")}
      />
    );
  };

  renderPassword2Field = () => {
    const { userStore } = this.props;
    const { fetching } = userStore;

    const { password2 } = this.state;

    return (
      <TextInput
        ref={r => {
          this._password2 = r;
        }}
        style={styles.textInput}
        value={password2}
        placeholderTextColor={Colors.silver}
        editable={!userStore.fetching}
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
          <View style={styles.formContent}>
            <View style={styles.intro}>
              <Image source={Images.logo} style={styles.topLogo} />

              <Text style={styles.actionText}>{I18n.t("are you new?")}</Text>
            </View>
            {this.renderFBButton()}
            {this.renderRegisterButton()}
            <View style={styles.row}>{this.renderEmailField()}</View>
            <View style={styles.line} />
            <View style={styles.row}>{this.renderPasswordField()}</View>
            <View style={styles.line} />
            {this.errorMessage()}
            {this.loginButton()}
          </View>
        );
        break;
      case "register":
        return (
          <View style={styles.formContent}>
            <View style={styles.intro}>
              <Text style={styles.actionText}>
                {I18n.t("welcome_to_olyseum")}
              </Text>
            </View>
            <View style={styles.row}>{this.renderFullNameField()}</View>
            <View style={styles.line} />
            <View style={styles.row}>{this.renderUserNameField()}</View>
            <View style={styles.line} />
            <View style={styles.row}>{this.renderEmailField()}</View>
            <View style={styles.line} />
            <View style={styles.row}>{this.renderPasswordField()}</View>
            <View style={styles.line} />
            <View style={styles.row}>{this.renderPassword2Field()}</View>
            <View style={styles.line} />
            {this.errorMessage()}
            {this.registerButton()}
            {this.renderAlreadyUser()}
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
          <TouchableOpacity
            style={[styles.standardButton, styles.actionButton]}
            onPress={this.goToRegister}
          >
            <Text style={styles.actionText}>{I18n.t("register")}</Text>
          </TouchableOpacity>
        );
        break;
      case "register":
        return (
          <TouchableOpacity
            style={[styles.standardButton, styles.actionButton]}
            onPress={this.goToLogin}
          >
            <Text style={styles.actionText}>
              {I18n.t("already_have_account")}
            </Text>
          </TouchableOpacity>
        );
        break;

      default:
        break;
    }
  };

  renderFBButton = () => {
    const { userStore } = this.props;
    return (
      <TouchableOpacity
        style={[styles.standardButton, styles.facebookBtn]}
        onPress={this.loginWithFacebook}
      >
        <Text style={styles.facebookBtnText}>
          {I18n.t("loginWithFacebook")}
        </Text>
      </TouchableOpacity>
    );
  };

  renderAlreadyUser = () => {
    return (
      <TouchableOpacity
        style={[styles.standardButton, styles.actionButton]}
        onPress={this.goToLogin}
      >
        <Text style={styles.actionText}>{I18n.t("already_have_account")}</Text>
      </TouchableOpacity>
    );
  };

  renderRegisterButton = () => {
    const { userStore } = this.props;
    return (
      <TouchableOpacity
        style={[styles.standardButton, styles.registerBtn]}
        onPress={this.goToRegister}
      >
        <Text style={styles.registerBtnText}>{I18n.t("register")}</Text>
      </TouchableOpacity>
    );
  };

  renderForm = () => {
    const { userStore } = this.props;
    if (!userStore.currentUser) {
      return (
        <View style={styles.form}>
          {this.createForm()}
          {/*this.createButtons()*/}
        </View>
      );
    }
  };

  render() {
    console.log("userStore.currentUser", userStore.currentUser);
    return (
      <KeyboardAvoidingView
        style={styles.container}
        contentContainerStyle={styles.mainContainer}
        behavior="padding"
      >
        <ScrollView>
          {Platform.OS === "android" && (
            <StatusBar
              backgroundColor={Colors.navigationBackground}
              barStyle="light-content"
            />
          )}
          <View style={styles.mainContainer}>
            {this.renderForm()}
            <View style={styles.fixBottom} />
          </View>
          <View style={styles.fixBottom} />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
