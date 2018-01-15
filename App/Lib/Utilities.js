// @flow

import { Platform } from "react-native";
import { create } from "apisauce";
import cheerio from "react-native-cheerio";
import _ from "lodash";
import moment from "moment";

import RNFetchBlob from "react-native-fetch-blob";

// Utility functions
export const getBase64Image = async url => {
  const image = await RNFetchBlob.fetch("GET", url);
  return image.base64();
};

export const getUrl = text => {
  let re = /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/i;
  return re.exec(text);
};

export const hasUrl = text => {
  let re = /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/i;
  return re.test(text);
};

export const extractMeta = async url => {
  const api = create({
    baseURL: url,
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "Cache-Control": "no-cache",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36 Name"
    },
    timeout: 10000
  });
  const response = await api.get("");
  console.log("response", response);
  if (response.ok) {
    const html = response.data;
    const $ = cheerio.load(html);
    const metaTags = $("meta");
    let fields = [
      "url",
      "canonical",
      "title",
      "image",
      "author",
      "description",
      "keywords",
      "source",
      "og:url",
      "og:locale",
      "og:locale:alternate",
      "og:title",
      "og:type",
      "og:description",
      "og:determiner",
      "og:site_name",
      "og:image",
      "og:image:secure_url",
      "og:image:type",
      "og:image:width",
      "og:image:height"
    ];
    let meta = {
      update: moment().toISOString()
    };
    let extracted = {};
    _.each(metaTags, item => {
      if (item.attribs && item.attribs.content) {
        if (item.attribs.name) {
          extracted[item.attribs.name] = item.attribs.content;
        }
        if (item.attribs.property) {
          extracted[item.attribs.property] = item.attribs.content;
        }
      }
    });
    if (extracted) {
      console.log("extracted", extracted);
      return _.extend(meta, _.pick(extracted, fields));
    } else {
      return meta;
    }
  } else {
    let meta = {
      update: moment().toISOString(),
      error: true
    };
    return meta;
  }
};

export const isEmail = e => {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(e);
};

export const isPhone = p => {
  var re = /^\d+$/;
  var digits = p.replace(/\D/g, "");
  return digits.match(re) !== null;
};
/**
 * @cfg {HEX} AlphaColor
 *
 * - 100% — FF
 * - 95% — F2
 * - 90% — E6
 * - 85% — D9
 * - 80% — CC
 * - 75% — BF
 * - 70% — B3
 * - 65% — A6
 * - 60% — 99
 * - 55% — 8C
 * - 50% — 80
 * - 45% — 73
 * - 40% — 66
 * - 35% — 59
 * - 30% — 4D
 * - 25% — 40
 * - 20% — 33
 * - 15% — 26
 * - 10% — 1A
 * - 5% — 0D
 * - 0% — 00
 *
 */
