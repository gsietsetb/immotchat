import { Metrics, Colors, Fonts } from "../../Themes";

const LABEL_COLOR = Colors.lightGray;
const INPUT_COLOR = "#000000";
const ERROR_COLOR = "#a94442";
const HELP_COLOR = "#999999";
const BORDER_COLOR = Colors.lightGray;
const DISABLED_COLOR = "#777777";
const DISABLED_BACKGROUND_COLOR = "#eeeeee";
const FONT_SIZE = 16;

export default {
  fieldset: {},
  // the style applied to the container of all inputs
  formGroup: {
    normal: {
      marginBottom: Metrics.baseSpace
    },
    error: {
      marginBottom: Metrics.baseSpace
    }
  },
  controlLabel: {
    normal: {
      padding: Metrics.baseSpace,
      fontWeight: "bold",
      color: Colors.primaryDark,
      backgroundColor: Colors.transparent
    },
    // the style applied when a validation error occours
    error: {
      padding: Metrics.baseSpace,
      fontWeight: "bold",
      color: Colors.primaryDark,
      backgroundColor: Colors.transparent
    }
  },
  helpBlock: {
    normal: {
      color: HELP_COLOR,
      fontSize: FONT_SIZE
    },
    // the style applied when a validation error occours
    error: {
      color: HELP_COLOR,
      fontSize: FONT_SIZE
    }
  },
  errorBlock: {
    fontSize: FONT_SIZE,
    color: ERROR_COLOR
  },
  textbox: {
    normal: {
      height: 48,
      color: INPUT_COLOR,
      fontSize: Fonts.size.medium,
      padding: Metrics.baseSpace,
      backgroundColor: Colors.whiteFull,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: "#cccccc"
    },
    // the style applied when a validation error occours
    error: {
      color: INPUT_COLOR,
      fontSize: Fonts.size.medium,
      padding: Metrics.baseSpace,
      backgroundColor: Colors.whiteFull
    },
    // the style applied when the textbox is not editable
    notEditable: {
      fontSize: FONT_SIZE,
      height: 30,
      padding: 7,
      borderRadius: 4,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      marginBottom: 5,
      color: DISABLED_COLOR,
      backgroundColor: DISABLED_BACKGROUND_COLOR
    }
  },
  textboxView: {
    normal: {},
    error: {}
  },
  checkbox: {
    normal: {
      marginBottom: 4
    },
    // the style applied when a validation error occours
    error: {
      marginBottom: 4
    }
  },
  select: {
    normal: {
      marginBottom: 4,
      width: Metrics.screenWidth - 130
    },
    // the style applied when a validation error occours
    error: {
      marginBottom: 4
    }
  },
  pickerTouchable: {
    normal: {
      height: 20,
      marginBottom: 12,
      flexDirection: "row",
      flex: 1
    },
    error: {
      height: 20,
      marginBottom: 12,
      flexDirection: "row",
      flex: 1
    }
  },
  pickerValue: {
    normal: {
      fontSize: FONT_SIZE,
      lineHeight: 22,
      textAlignVertical: "top"
    },
    error: {
      fontSize: FONT_SIZE
    }
  },
  datepicker: {
    normal: {},
    error: {}
  },
  dateTouchable: {
    normal: {
      height: 20,
      marginBottom: 12,
      width: Metrics.screenWidth - 130,
      top: -5
    },
    error: {}
  },
  dateValue: {
    normal: {
      color: INPUT_COLOR,
      fontSize: FONT_SIZE
    },
    error: {
      color: ERROR_COLOR,
      fontSize: FONT_SIZE
    }
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    alignSelf: "center"
  },
  button: {
    height: 36,
    backgroundColor: "#48BBEC",
    borderColor: "#48BBEC",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: "stretch",
    justifyContent: "center"
  }
};
