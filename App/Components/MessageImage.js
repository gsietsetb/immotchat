import PropTypes from "prop-types";
import React from "react";
import {
  Image,
  StyleSheet,
  View,
  ViewPropTypes,
  TouchableOpacity
} from "react-native";
//import Lightbox from 'react-native-lightbox';
import FastImage from "react-native-fast-image";

import { observer } from "mobx-react/native";

@observer
export default class MessageImage extends React.Component {
  openZoom = () => {
    const { nav, currentMessage } = this.props;

    if (currentMessage.image) {
      nav.navigate("Gallery", {
        data: { images: [{ url: currentMessage.image }] },
        index: 0
      });
    }
  };
  render() {
    const { currentMessage } = this.props;

    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <TouchableOpacity onPress={this.openZoom}>
          <FastImage
            style={[styles.image]}
            resizeMode={FastImage.resizeMode.cover}
            source={{
              uri: currentMessage.image,
              priority: FastImage.priority.normal
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  image: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3
  }
});

MessageImage.defaultProps = {
  currentMessage: {
    image: null
  },
  containerStyle: {},
  imageStyle: {}
};

MessageImage.propTypes = {
  currentMessage: PropTypes.object,
  containerStyle: ViewPropTypes.style,
  imageStyle: Image.propTypes.style,
  imageProps: PropTypes.object,
  lightboxProps: PropTypes.object
};
