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

import { observer } from "mobx-react/native";

@observer
export default class MessageImage extends React.Component {
  openZoom = () => {
    const { nav, currentMessage } = this.props;
    console.log("currentMessage", currentMessage);

    if (currentMessage.image) {
      nav.navigate("Gallery", {
        data: { images: [{ url: currentMessage.image }] },
        index: 0
      });
    }
  };
  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <TouchableOpacity
          activeProps={{
            style: styles.imageActive
          }}
          {...this.props.lightboxProps}
          onPress={this.openZoom}
        >
          <Image
            {...this.props.imageProps}
            style={[styles.image, this.props.imageStyle]}
            source={{ uri: this.props.currentMessage.image }}
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
    margin: 3,
    resizeMode: "cover"
  },
  imageActive: {
    flex: 1,
    resizeMode: "contain"
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
