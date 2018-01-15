import { observable, action, computed } from "mobx";
import { ListView, Platform } from "react-native";

import RNFetchBlob from "react-native-fetch-blob";

import { Images } from "../Themes/";
import _ from "lodash";
import API from "../Services/Api";

import firebase from "../Lib/firebase";

const storage = firebase.storage();

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

export default class UploaderStore {
  @observable sending = false;
  @observable field = null;

  uploadImage = (uri, mime = "application/octet-stream") => {
    return new Promise((resolve, reject) => {
      const uploadUri =
        Platform.OS === "ios" ? uri.replace("file://", "") : uri;
      const sessionId = new Date().getTime();
      let uploadBlob = null;
      const imageRef = storage.ref("images").child(`${sessionId}`);

      fs
        .readFile(uploadUri, "base64")
        .then(data => {
          return Blob.build(data, { type: `${mime};BASE64` });
        })
        .then(blob => {
          uploadBlob = blob;
          return imageRef.put(blob, { contentType: mime });
        })
        .then(() => {
          uploadBlob.close();
          return imageRef.getDownloadURL();
        })
        .then(url => {
          resolve(url);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  singleUpload = async (
    uri,
    mime = "application/octet-stream",
    field = null
  ) => {
    this.field = field;
    this.sending = true;
    console.log("uri", uri);
    const response = await this.uploadImage(uri, mime);

    console.log("response", response);
    this.sending = false;
    this.field = null;

    return response;
  };
}
