import PropTypes from "prop-types";
import React from "react";
import { Linking, StyleSheet, Text, View, ViewPropTypes } from "react-native";

import ParsedText from "react-native-parsed-text";
import Communications from "react-native-communications";

import FastImage from "react-native-fast-image";

const WWW_URL_PATTERN = /^www\./i;

export default class MessageText extends React.Component {
  constructor(props) {
    super(props);
    this.onUrlPress = this.onUrlPress.bind(this);
    this.onPhonePress = this.onPhonePress.bind(this);
    this.onEmailPress = this.onEmailPress.bind(this);
  }

  onUrlPress(url) {
    // When someone sends a message that includes a website address beginning with "www." (omitting the scheme),
    // react-native-parsed-text recognizes it as a valid url, but Linking fails to open due to the missing scheme.
    if (WWW_URL_PATTERN.test(url)) {
      this.onUrlPress(`http://${url}`);
    } else {
      Linking.canOpenURL(url).then(supported => {
        if (!supported) {
          console.error("No handler for URL:", url);
        } else {
          Linking.openURL(url);
        }
      });
    }
  }

  onPhonePress(phone) {
    const options = ["Call", "Text", "Cancel"];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions({
      options,
      cancelButtonIndex
    }, buttonIndex => {
      switch (buttonIndex) {
        case 0:
          Communications.phonecall(phone, true);
          break;
        case 1:
          Communications.text(phone);
          break;
      }
    });
  }

  onEmailPress(email) {
    Communications.email([email], null, null, null, null);
  }

  /*renderUrl = (matchingString, matches) => {
    // matches => ["[@michel:5455345]", "@michel", "5455345"]
    console.log("matches", matchingString);
    return matchingString;
  };*/

  renderMeta = () => {
    const { currentMessage, position } = this.props;

    console.log("position", position);
    if (currentMessage.meta) {
      const { meta } = currentMessage;
      let metaString = "";
      if (meta.description) {
        metaString = meta.description;
      }
      console.log("meta", meta);
      let urlImage = meta["image"] || meta["og:image"];
      console.log("urlImage", urlImage);
      if (urlImage) {
        return (
          <View style={styles.metaContainer}>
            <FastImage
              style={styles.image}
              resizeMode={FastImage.resizeMode.cover}
              source={{
                uri: urlImage,
                priority: FastImage.priority.normal
              }}
            />
            <View style={styles.metaInfo}>
              <Text style={styles[position].metaText} numberOfLines={2}>
                {metaString}
              </Text>
            </View>
          </View>
        );
      }
      if (metaString) {
        return (
          <View style={styles.metaContainer}>
            <View style={styles.metaInfo}>
              <Text style={styles[position].metaText} numberOfLines={2}>
                {metaString}
              </Text>
            </View>
          </View>
        );
      }
    }
  };
  render() {
    const { currentMessage } = this.props;
    const linkStyle = StyleSheet.flatten([
      styles[this.props.position].link,
      this.props.linkStyle[this.props.position]
    ]);
    return (
      <View
        style={[
          styles[this.props.position].container,
          this.props.containerStyle[this.props.position]
        ]}
      >
        {this.renderMeta()}
        <ParsedText
          style={[
            styles[this.props.position].text,
            this.props.textStyle[this.props.position],
            this.props.customTextStyle
          ]}
          parse={[
            ...this.props.parsePatterns(linkStyle),
            {
              type: "url",
              style: linkStyle,
              onPress: this.onUrlPress
            },
            { type: "phone", style: linkStyle, onPress: this.onPhonePress },
            { type: "email", style: linkStyle, onPress: this.onEmailPress }
          ]}
          childrenProps={{ ...this.props.textProps }}
        >
          {currentMessage.text}
        </ParsedText>
      </View>
    );
  }
}

const textStyle = {
  fontSize: 16,
  lineHeight: 20,
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10,
  marginRight: 10
};

const styles = {
  metaContainer: {
    padding: 10,
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 10
  },
  metaInfo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  left: StyleSheet.create({
    container: {},
    text: {
      color: "black",
      ...textStyle
    },
    link: {
      color: "black",
      textDecorationLine: "underline"
    },
    metaText: {
      fontSize: 13,
      fontWeight: "bold",
      color: "black"
    }
  }),
  right: StyleSheet.create({
    container: {},
    text: {
      color: "white",
      ...textStyle
    },
    link: {
      color: "white",
      textDecorationLine: "underline"
    },
    metaText: {
      fontSize: 13,
      fontWeight: "bold",
      color: "white"
    }
  })
};

MessageText.contextTypes = {
  actionSheet: PropTypes.func
};

MessageText.defaultProps = {
  position: "left",
  currentMessage: {
    text: ""
  },
  containerStyle: {},
  textStyle: {},
  linkStyle: {},
  parsePatterns: () => []
};

MessageText.propTypes = {
  position: PropTypes.oneOf(["left", "right"]),
  currentMessage: PropTypes.object,
  containerStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style
  }),
  textStyle: PropTypes.shape({
    left: Text.propTypes.style,
    right: Text.propTypes.style
  }),
  linkStyle: PropTypes.shape({
    left: Text.propTypes.style,
    right: Text.propTypes.style
  }),
  parsePatterns: PropTypes.func,
  textProps: PropTypes.object,
  customTextStyle: Text.propTypes.style
};
