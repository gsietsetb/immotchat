import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  TextInput,
  View,
  FlatList,
  ScrollView,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  Platform,
  ActivityIndicator,
  PixelRatio
} from "react-native";

import axios, { CancelToken } from "axios";

import qs from "qs";
import { debounce } from "lodash";

const WINDOW = Dimensions.get("window");

const defaultStyles = {
  container: {},
  textInputContainer: {
    backgroundColor: "#C9C9CE",
    height: 44,
    borderTopColor: "#7e7e7e",
    borderBottomColor: "#b5b5b5",
    borderTopWidth: 1 / PixelRatio.get(),
    borderBottomWidth: 1 / PixelRatio.get(),
    flexDirection: "row"
  },
  textInput: {
    backgroundColor: "#FFFFFF",
    height: 28,
    borderRadius: 5,
    paddingTop: 4.5,
    paddingBottom: 4.5,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 7.5,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 15,
    flex: 1
  },
  poweredContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#FFFFFF"
  },
  powered: {},
  listView: {},
  row: {
    padding: 13,
    height: 44,
    flexDirection: "row"
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#c8c7cc"
  },
  description: {},
  loader: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    height: 20
  },
  androidLoader: {
    marginRight: -15
  }
};
const api = axios.create({
  baseURL: "https://maps.googleapis.com/maps/api/place/",
  timeout: 10000,
  headers: {
    Accept: "text/html,application/xhtml+xml",
    "Cache-Control": "no-cache"
  }
});

export default class GooglePlacesAutocomplete extends Component {
  _isMounted = false;
  _results = [];
  cancelToken = CancelToken.source();
  currentRequest = null;

  constructor(props) {
    super(props);
    this.state = this.getInitialState.call(this);
  }

  getInitialState = () => ({
    text: this.props.getDefaultValue(),
    dataSource: this.buildRowsFromResults([]),
    listViewDisplayed:
      this.props.listViewDisplayed === "auto"
        ? false
        : this.props.listViewDisplayed
  });

  setAddressText = address => this.setState({ text: address });

  getAddressText = () => this.state.text;

  buildRowsFromResults = results => {
    let res = [];

    if (
      results.length === 0 ||
      this.props.predefinedPlacesAlwaysVisible === true
    ) {
      res = [...this.props.predefinedPlaces];

      if (this.props.currentLocation === true) {
        res.unshift({
          description: this.props.currentLocationLabel,
          isCurrentLocation: true
        });
      }
    }

    res = res.map(place => ({
      ...place,
      isPredefinedPlace: true
    }));

    return [...res, ...results];
  };

  componentWillMount() {
    this._request = this.props.debounce
      ? debounce(this._request, this.props.debounce)
      : this._request;
  }

  componentDidMount() {
    // This will load the default value's search results after the view has
    // been rendered
    this._isMounted = true;
    this._onChangeText(this.state.text);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.listViewDisplayed !== "auto") {
      this.setState({
        listViewDisplayed: nextProps.listViewDisplayed
      });
    }

    if (
      typeof nextProps.text !== "undefined" &&
      this.state.text !== nextProps.text
    ) {
      this.setState(
        {
          listViewDisplayed: true
        },
        this._handleChangeText(nextProps.text)
      );
    }
  }

  componentWillUnmount() {
    //this._abortRequests();
    this._isMounted = false;
  }

  /*_abortRequests = () => {
    this._requests.map(i => i.cancel());
    this._requests = [];
  };*/

  /**
   * This method is exposed to parent components to focus on textInput manually.
   * @public
   */
  triggerFocus = () => {
    if (this.refs.textInput) this.refs.textInput.focus();
  };

  /**
   * This method is exposed to parent components to blur textInput manually.
   * @public
   */
  triggerBlur = () => {
    if (this.refs.textInput) this.refs.textInput.blur();
  };

  getCurrentLocation = () => {
    let options = {
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 1000
    };

    if (this.props.enableHighAccuracyLocation && Platform.OS === "android") {
      options = {
        enableHighAccuracy: true,
        timeout: 20000
      };
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        if (this.props.nearbyPlacesAPI === "None") {
          let currentLocation = {
            description: this.props.currentLocationLabel,
            geometry: {
              location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              }
            }
          };

          this._disableRowLoaders();
          this.props.onPress(currentLocation, currentLocation);
        } else {
          this._requestNearby(
            position.coords.latitude,
            position.coords.longitude
          );
        }
      },
      error => {
        this._disableRowLoaders();
        alert(error.message);
      },
      options
    );
  };

  _onPress = async rowData => {
    console.log("rowData", rowData);
    const { query, fetchDetails, onPress } = this.props;

    if (fetchDetails === true) {
      const response = await api.get("details/json", {
        params: {
          key: query.key,
          placeid: rowData.place_id,
          language: query.language
        }
      });
      console.log("response", response);
      if (response && response.data && response.data.result) {
        onPress(rowData, {
          address: response.data.result.formatted_address,
          coords: response.data.result.geometry.location
        });
      }
      //this._onBlur();
      return;
    }
  };

  _enableRowLoader = rowData => {
    let rows = this.buildRowsFromResults(this._results);
    for (let i = 0; i < rows.length; i++) {
      if (
        rows[i].place_id === rowData.place_id ||
        (rows[i].isCurrentLocation === true &&
          rowData.isCurrentLocation === true)
      ) {
        rows[i].isLoading = true;
        this.setState({
          dataSource: rows
        });
        break;
      }
    }
  };

  _disableRowLoaders = () => {
    if (this._isMounted === true) {
      for (let i = 0; i < this._results.length; i++) {
        if (this._results[i].isLoading === true) {
          this._results[i].isLoading = false;
        }
      }

      this.setState({
        dataSource: this.buildRowsFromResults(this._results)
      });
    }
  };

  _getPredefinedPlace = rowData => {
    if (rowData.isPredefinedPlace !== true) {
      return rowData;
    }

    for (let i = 0; i < this.props.predefinedPlaces.length; i++) {
      if (this.props.predefinedPlaces[i].description === rowData.description) {
        return this.props.predefinedPlaces[i];
      }
    }

    return rowData;
  };

  _filterResultsByTypes = (responseJSON, types) => {
    if (types.length === 0) return responseJSON.results;

    var results = [];
    for (let i = 0; i < responseJSON.results.length; i++) {
      let found = false;

      for (let j = 0; j < types.length; j++) {
        if (responseJSON.results[i].types.indexOf(types[j]) !== -1) {
          found = true;
          break;
        }
      }

      if (found === true) {
        results.push(responseJSON.results[i]);
      }
    }
    return results;
  };

  _requestNearby = (latitude, longitude) => {
    //this._abortRequests();

    if (
      latitude !== undefined &&
      longitude !== undefined &&
      latitude !== null &&
      longitude !== null
    ) {
      const request = new XMLHttpRequest();
      this._requests.push(request);
      request.timeout = this.props.timeout;
      request.ontimeout = this.props.onTimeout;
      request.onreadystatechange = () => {
        if (request.readyState !== 4) {
          return;
        }

        if (request.status === 200) {
          const responseJSON = JSON.parse(request.responseText);

          this._disableRowLoaders();

          if (typeof responseJSON.results !== "undefined") {
            if (this._isMounted === true) {
              var results = [];
              if (this.props.nearbyPlacesAPI === "GoogleReverseGeocoding") {
                results = this._filterResultsByTypes(
                  responseJSON,
                  this.props.filterReverseGeocodingByTypes
                );
              } else {
                results = responseJSON.results;
              }

              this.setState({
                dataSource: this.buildRowsFromResults(results)
              });
            }
          }
          if (typeof responseJSON.error_message !== "undefined") {
            console.warn(
              "google places autocomplete: " + responseJSON.error_message
            );
          }
        } else {
          // console.warn("google places autocomplete: request could not be completed or has been aborted");
        }
      };

      let url = "";
      if (this.props.nearbyPlacesAPI === "GoogleReverseGeocoding") {
        // your key must be allowed to use Google Maps Geocoding API
        url =
          "https://maps.googleapis.com/maps/api/geocode/json?" +
          qs.stringify({
            latlng: latitude + "," + longitude,
            key: this.props.query.key,
            ...this.props.GoogleReverseGeocodingQuery
          });
      } else {
        url =
          "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" +
          qs.stringify({
            location: latitude + "," + longitude,
            key: this.props.query.key,
            ...this.props.GooglePlacesSearchQuery
          });
      }

      request.open("GET", url);
      if (this.props.query.origin !== null) {
        request.setRequestHeader("Referer", this.props.query.origin);
      }

      request.send();
    } else {
      this._results = [];
      this.setState({
        dataSource: this.buildRowsFromResults([])
      });
    }
  };

  _request = async text => {
    if (this.currentRequest) {
      //this.cancelToken.cancel();
      this.currentRequest = null;
    }
    //this._abortRequests();
    if (text.length >= this.props.minLength) {
      console.log("searching in request for text", text);
      //const request = new XMLHttpRequest();
      const { query } = this.props;
      this.currentRequest = await api.get("autocomplete/json", {
        params: {
          ...query,
          input: encodeURIComponent(text)
        }
        //cancelToken: this.cancelToken.token
      });
      console.log("response", this.currentRequest);
      const { data } = this.currentRequest;
      if (data.predictions) {
        if (this._isMounted === true) {
          this._results = data.predictions;
          this.setState({
            dataSource: this.buildRowsFromResults(data.predictions)
          });
        }
      }

      //return;
      //this._requests.push(request);

      /*request.timeout = this.props.timeout;
      request.ontimeout = this.props.onTimeout;
      request.onreadystatechange = () => {
        console.log("request.readyState", request.readyState);

        if (request.readyState !== 4) {
          return;
        }
        console.log("request.status", request.status);
        console.log("request.responseText", request.responseText);
        if (request.status === 200) {
          const responseJSON = JSON.parse(request.responseText);
          console.log("responseJSON", responseJSON);
          if (typeof responseJSON.predictions !== "undefined") {
            if (this._isMounted === true) {
              this._results = responseJSON.predictions;
              this.setState({
                dataSource: this.buildRowsFromResults(responseJSON.predictions)
              });
            }
          }
          if (typeof responseJSON.error_message !== "undefined") {
            console.warn(
              "google places autocomplete: " + responseJSON.error_message
            );
          }
        } else {
          // console.warn("google places autocomplete: request could not be completed or has been aborted");
        }
      };
      request.open(
        "GET",
        "https://maps.googleapis.com/maps/api/place/autocomplete/json?&input=" +
          encodeURIComponent(text) +
          "&" +
          qs.stringify(this.props.query)
      );
      if (this.props.query.origin !== null) {
        request.setRequestHeader("Referer", this.props.query.origin);
      }

      request.send();
      */
    } else {
      console.log("siamo qui");
      this._results = [];
      this.setState({
        dataSource: this.buildRowsFromResults([])
      });
    }
  };

  _onChangeText = text => {
    console.log("search for text", text);

    this._request(text);

    this.setState({
      text: text,
      listViewDisplayed: true
    });
  };

  _handleChangeText = text => {
    this._onChangeText(text);

    const onChangeText =
      this.props &&
      this.props.textInputProps &&
      this.props.textInputProps.onChangeText;

    if (onChangeText) {
      onChangeText(text);
    }
  };

  _getRowLoader() {
    return <ActivityIndicator animating={true} size="small" />;
  }

  _renderRowData = rowData => {
    if (this.props.renderRow) {
      return this.props.renderRow(rowData);
    }

    return (
      <Text
        style={[
          { flex: 1 },
          defaultStyles.description,
          this.props.styles.description,
          rowData.isPredefinedPlace
            ? this.props.styles.predefinedPlacesDescription
            : {}
        ]}
        numberOfLines={1}
      >
        {this._renderDescription(rowData)}
      </Text>
    );
  };

  _renderDescription = rowData => {
    if (this.props.renderDescription) {
      return this.props.renderDescription(rowData);
    }
    console.log("rowData.description", rowData.description);
    return rowData.description || rowData.formatted_address || rowData.name;
  };

  _renderLoader = rowData => {
    if (rowData.isLoading === true) {
      return (
        <View style={[defaultStyles.loader, this.props.styles.loader]}>
          {this._getRowLoader()}
        </View>
      );
    }

    return null;
  };

  renderRow = (rowData = {}) => {
    console.log("passo qui");
    if (this.props.renderRow) {
      return this.props.renderRow(rowData);
    }

    return (
      <TouchableHighlight
        style={{ width: WINDOW.width }}
        onPress={() => this._onPress(rowData)}
        underlayColor={this.props.listUnderlayColor || "#c8c7cc"}
      >
        <View
          style={[
            defaultStyles.row,
            this.props.styles.row,
            rowData.isPredefinedPlace ? this.props.styles.specialItemRow : {}
          ]}
        >
          <Text
            style={[
              { flex: 1 },
              defaultStyles.description,
              this.props.styles.description,
              rowData.isPredefinedPlace
                ? this.props.styles.predefinedPlacesDescription
                : {}
            ]}
            numberOfLines={1}
          >
            {this._renderDescription(rowData)}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };
  _renderRow = (rowData = {}, sectionID, rowID) => {
    console.log("rowData", rowData);
    return (
      <ScrollView
        style={{ flex: 1 }}
        scrollEnabled={this.props.isRowScrollable}
        keyboardShouldPersistTaps={this.props.keyboardShouldPersistTaps}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <TouchableHighlight
          style={{ width: WINDOW.width }}
          onPress={() => this._onPress(rowData)}
          underlayColor={this.props.listUnderlayColor || "#c8c7cc"}
        >
          <View
            style={[
              defaultStyles.row,
              this.props.styles.row,
              rowData.isPredefinedPlace ? this.props.styles.specialItemRow : {}
            ]}
          >
            {this._renderRowData(rowData)}
            {this._renderLoader(rowData)}
          </View>
        </TouchableHighlight>
      </ScrollView>
    );
  };

  _renderSeparator = (sectionID, rowID) => {
    if (rowID == this.state.dataSource.length - 1) {
      return null;
    }

    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={[defaultStyles.separator, this.props.styles.separator]}
      />
    );
  };

  _onBlur = () => {
    this.triggerBlur();

    this.setState({
      listViewDisplayed: false
    });
  };

  _onFocus = () => this.setState({ listViewDisplayed: true });

  _renderPoweredLogo = () => {
    if (!this._shouldShowPoweredLogo()) {
      return null;
    }

    return (
      <View
        style={[
          defaultStyles.row,
          defaultStyles.poweredContainer,
          this.props.styles.poweredContainer
        ]}
      >
        <Image
          style={[defaultStyles.powered, this.props.styles.powered]}
          resizeMode={Image.resizeMode.contain}
          source={require("../Images/powered_by_google_on_white.png")}
        />
      </View>
    );
  };

  _shouldShowPoweredLogo = () => {
    if (
      !this.props.enablePoweredByContainer ||
      this.state.dataSource.length == 0
    ) {
      return false;
    }

    for (let i = 0; i < this.state.dataSource.length; i++) {
      let row = this.state.dataSource[i];

      if (
        !row.hasOwnProperty("isCurrentLocation") &&
        !row.hasOwnProperty("isPredefinedPlace")
      ) {
        return true;
      }
    }

    return false;
  };

  _renderLeftButton = () => {
    if (this.props.renderLeftButton) {
      return this.props.renderLeftButton();
    }
  };

  _renderRightButton = () => {
    if (this.props.renderRightButton) {
      return this.props.renderRightButton();
    }
  };

  keyGenerator = item => item.id;

  _getFlatList = () => {
    console.log("this.state.dataSource", this.state.dataSource);
    if (
      (this.state.text !== "" ||
        this.props.predefinedPlaces.length ||
        this.props.currentLocation === true) &&
      this.state.listViewDisplayed === true
    ) {
      return (
        <FlatList
          style={[defaultStyles.listView, this.props.styles.listView]}
          data={this.state.dataSource}
          keyExtractor={(item, index) => item.id}
          extraData={[this.state.dataSource, this.props]}
          renderItem={({ item }) => this.renderRow(item)}
          ListFooterComponent={this._renderPoweredLogo}
          {...this.props}
        />
      );
    }

    return null;
  };
  render() {
    let { onFocus, ...userProps } = this.props.textInputProps;
    return (
      <View
        style={[defaultStyles.container, this.props.styles.container]}
        pointerEvents="box-none"
      >
        {!this.props.textInputHide && (
          <View
            style={[
              defaultStyles.textInputContainer,
              this.props.styles.textInputContainer
            ]}
          >
            {this._renderLeftButton()}
            <TextInput
              ref="textInput"
              returnKeyType={this.props.returnKeyType}
              autoFocus={this.props.autoFocus}
              style={[defaultStyles.textInput, this.props.styles.textInput]}
              value={this.state.text}
              placeholder={this.props.placeholder}
              placeholderTextColor={this.props.placeholderTextColor}
              onFocus={
                onFocus
                  ? () => {
                      this._onFocus();
                      onFocus();
                    }
                  : this._onFocus
              }
              clearButtonMode="while-editing"
              underlineColorAndroid={this.props.underlineColorAndroid}
              {...userProps}
              onChangeText={this._handleChangeText}
            />
            {this._renderRightButton()}
          </View>
        )}
        {this._getFlatList()}
        {this.props.children}
      </View>
    );
  }
}

GooglePlacesAutocomplete.propTypes = {
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  underlineColorAndroid: PropTypes.string,
  returnKeyType: PropTypes.string,
  onPress: PropTypes.func,
  onNotFound: PropTypes.func,
  onFail: PropTypes.func,
  minLength: PropTypes.number,
  fetchDetails: PropTypes.bool,
  autoFocus: PropTypes.bool,
  autoFillOnNotFound: PropTypes.bool,
  getDefaultValue: PropTypes.func,
  timeout: PropTypes.number,
  onTimeout: PropTypes.func,
  query: PropTypes.object,
  GoogleReverseGeocodingQuery: PropTypes.object,
  GooglePlacesSearchQuery: PropTypes.object,
  styles: PropTypes.object,
  textInputProps: PropTypes.object,
  enablePoweredByContainer: PropTypes.bool,
  predefinedPlaces: PropTypes.array,
  currentLocation: PropTypes.bool,
  currentLocationLabel: PropTypes.string,
  nearbyPlacesAPI: PropTypes.string,
  enableHighAccuracyLocation: PropTypes.bool,
  filterReverseGeocodingByTypes: PropTypes.array,
  predefinedPlacesAlwaysVisible: PropTypes.bool,
  enableEmptySections: PropTypes.bool,
  renderDescription: PropTypes.func,
  renderRow: PropTypes.func,
  renderLeftButton: PropTypes.func,
  renderRightButton: PropTypes.func,
  listUnderlayColor: PropTypes.string,
  debounce: PropTypes.number,
  isRowScrollable: PropTypes.bool,
  text: PropTypes.string,
  textInputHide: PropTypes.bool
};
GooglePlacesAutocomplete.defaultProps = {
  placeholder: "Search",
  placeholderTextColor: "#A8A8A8",
  isRowScrollable: true,
  underlineColorAndroid: "transparent",
  returnKeyType: "default",
  onPress: () => {},
  onNotFound: () => {},
  onFail: () => {},
  minLength: 0,
  fetchDetails: false,
  autoFocus: false,
  autoFillOnNotFound: false,
  keyboardShouldPersistTaps: "always",
  getDefaultValue: () => "",
  timeout: 20000,
  onTimeout: () => console.warn("google places autocomplete: request timeout"),
  query: {
    key: "missing api key",
    language: "en",
    types: "geocode"
  },
  GoogleReverseGeocodingQuery: {},
  GooglePlacesSearchQuery: {
    rankby: "distance",
    types: "food"
  },
  styles: {},
  textInputProps: {},
  enablePoweredByContainer: true,
  predefinedPlaces: [],
  currentLocation: false,
  currentLocationLabel: "Current location",
  nearbyPlacesAPI: "GooglePlacesSearch",
  enableHighAccuracyLocation: true,
  filterReverseGeocodingByTypes: [],
  predefinedPlacesAlwaysVisible: false,
  enableEmptySections: true,
  listViewDisplayed: "auto",
  debounce: 0,
  textInputHide: false
};