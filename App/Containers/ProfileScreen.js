// @flow

import React from "react";
import {
  ScrollView,
  Text,
  View,
  TextInput,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform
} from "react-native";

// I18n
import I18n from "react-native-i18n";

import FastImage from "react-native-fast-image";

import ImagePicker from "react-native-image-picker";
import ImageResizer from "react-native-image-resizer";

import Icon from "react-native-vector-icons/Ionicons";

import { Metrics, Colors } from "../Themes";
// external libs
import TabBar from "../Components/TabBar";
import NavBar from "../Components/NavBar";
import Animatable from "react-native-animatable";

import Spinner from "../Components/Spinner";
// Styles
import styles from "./Styles/ProfileScreenStyles";

import { observer, inject } from "mobx-react/native";

@inject("userStore", "nav", "uploader")
@observer
class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "", //"Paolo Mosca",
      email: "paolo@idev.io",
      password: "123456",
      password2: "", //"123456",
      typeForm: "login"
    };
  }
  componentDidMount() {
    // this.props.init();
    const { userStore } = this.props;
    console.log("userinfo", userStore.info);
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

  logout = () => {
    const { userStore, nav } = this.props;
    userStore.logout();
    nav.reset("Login");
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
        <Text style={styles.activeButtonText}>{I18n.t("Disconnect")}</Text>
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
      return <Text style={styles.errorMessage}>{errorMessage}</Text>;
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
        <Text style={styles.loginText}>{I18n.t("signIn")}</Text>
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
        <Text style={styles.loginText}>{I18n.t("signUp")}</Text>
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

  imagePicker = field => {
    const { uploader, userStore } = this.props;

    ImagePicker.launchImageLibrary(
      {
        title: I18n.t("chat.imagePicker.title")
      },
      response => {
        let { uri } = response;

        console.log("uri", uri);
        if (response.didCancel) return false;

        Image.getSize(uri, async (captureWidth, captureHeight) => {
          let resizedHeight = 1080 * (captureWidth / captureWidth);

          const resized = await ImageResizer.createResizedImage(
            uri,
            1080,
            resizedHeight,
            "JPEG",
            80,
            0,
            null
          );
          console.log("resized = ", resized);
          const uploadUrl = await uploader.singleUpload(
            resized.uri,
            "application/octet-stream",
            field
          );
          console.log("uploadUrl = ", uploadUrl);
          let profile = {};
          profile[field] = uploadUrl;
          userStore.updateUserProfile(profile);
        });
      }
    );
  };

  renderAgency = () => {
    const { userStore, uploader } = this.props;
    const { info } = userStore;
    if (info.type !== "agent") {
      return;
    }
    if (uploader.sending && uploader.field === "logoAgency") {
      return (
        <View style={styles.loadingAction}>
          <Spinner style={styles.spinner} color={Colors.secondaryDark} />
        </View>
      );
    }
    let avatarImg = `https://initials.herokuapp.com/a`;
    if (info.logoAgency) {
      avatarImg = info.logoAgency;
    }

    if (Platform.OS === "ios") {
      return (
        <TouchableOpacity
          style={styles.pickerAction}
          onPress={() => this.imagePicker("logoAgency")}
        >
          <Text style={styles.pictureHeaderText}>
            {I18n.t("profile.agency_picture")}
          </Text>

          <FastImage
            style={styles.avatar}
            resizeMode={FastImage.resizeMode.cover}
            source={{
              uri: avatarImg,
              priority: FastImage.priority.normal
            }}
          />
          <Icon name="ios-camera" style={styles.pickerIco} />
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        style={styles.pickerAction}
        onPress={() => this.imagePicker("logoAgency")}
      >
        <Text style={styles.pictureHeaderText}>
          {I18n.t("profile.agency_picture")}
        </Text>

        <Image source={{ uri: avatarImg }} style={styles.avatar} />
        <Icon name="ios-camera" style={styles.pickerIco} />
      </TouchableOpacity>
    );
  };
  renderAvatar = () => {
    const { userStore, uploader } = this.props;
    const { info } = userStore;
    if (!info) {
      return;
    }

    if (uploader.sending && uploader.field === "photo") {
      return (
        <View style={styles.loadingAction}>
          <Spinner style={styles.spinner} color={Colors.secondaryDark} />
        </View>
      );
    }
    let avatarImg = `https://initials.herokuapp.com/${info.fullName}`;
    if (info.photo) {
      avatarImg = info.photo;
    }

    if (Platform.OS === "ios") {
      return (
        <TouchableOpacity
          style={styles.pickerAction}
          onPress={() => this.imagePicker("photo")}
        >
          <Text style={styles.pictureHeaderText}>
            {I18n.t("profile.profile_picture")}
          </Text>
          <FastImage
            style={styles.avatar}
            resizeMode={FastImage.resizeMode.cover}
            source={{
              uri: avatarImg,
              priority: FastImage.priority.normal
            }}
          />
          <Icon name="ios-camera" style={styles.pickerIco} />
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        style={styles.pickerAction}
        onPress={() => this.imagePicker("photo")}
      >
        <Text style={styles.pictureHeaderText}>
          {I18n.t("profile.profile_picture")}
        </Text>
        <Image source={{ uri: avatarImg }} style={styles.avatar} />
        <Icon name="ios-camera" style={styles.pickerIco} />
      </TouchableOpacity>
    );
  };
  renderAccountInfo = () => {
    const { userStore } = this.props;
    const { info } = userStore;
    console.log("info", info);

    if (info) {
      return (
        <View style={styles.header}>
          <View style={styles.photoContainer}>
            {this.renderAvatar()}
            {this.renderAgency()}
          </View>
          <View>
            {info.fullName !== "" && (
              <View>
                <Text style={styles.infoText}>{info.fullName}</Text>
              </View>
            )}
            {info.email !== "" && (
              <View>
                <Text style={styles.infoText}>{info.email}</Text>
              </View>
            )}
          </View>
        </View>
      );
    }
  };
  renderLogin = () => {
    const { userStore } = this.props;
    const { info } = userStore;

    if (!info) {
      return <View>{this.createButtons()}</View>;
    }
  };

  goToPeferences = () => {
    const { nav } = this.props;

    nav.navigate("Preferences");
  };
  goToPrivacy = () => {
    console.log("goToPrivacy");
    const { nav } = this.props;

    nav.navigate("Privacy", {
      title: I18n.t("profile.login.privacy.title")
    });
  };

  otherLinks = () => {
    return (
      <View style={styles.boxLinks}>
        <TouchableOpacity style={styles.rowLink} onPress={this.goToPeferences}>
          <Text style={styles.rowText}>
            {I18n.t("profile.links.preferences")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rowLink} onPress={this.goToPrivacy}>
          <Text style={styles.rowText}>{I18n.t("profile.links.privacy")}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderPrivacy = () => {
    return (
      <ParsedText
        style={styles.privacyText}
        parse={[
          {
            pattern: /#PrivacyPolicy/,
            style: styles.privacyButton,
            renderText: I18n.t("profile.login.privacy.title"),
            onPress: this.goToPrivacy
          }
        ]}
      >
        {I18n.t("profile.login.privacy.rules")}
      </ParsedText>
    );
  };

  render() {
    console.log("props", this.props);

    return (
      <View style={styles.mainContainer}>
        <NavBar title={I18n.t("Profile")} />
        <ScrollView style={styles.container}>
          {this.renderAccountInfo()}
          {this.otherLinks()}
          {this.logoutButton()}
        </ScrollView>
        <TabBar selected="profile" />
      </View>
    );
  }
}

export default ProfileScreen;
