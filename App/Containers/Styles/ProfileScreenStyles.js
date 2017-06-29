// @flow

import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  ...ApplicationStyles.common,
  container: {
    flex: 1,
    marginTop: Metrics.navBarHeight,
    backgroundColor: Colors.background
  },
  row:{
    flexDirection: 'row'
  },
  menuIcon: {
    padding: 8,
    color: Colors.primaryNormal
  },
  titleRow: {
    padding: 8,
    color: Colors.primaryNormal
  },
  spinner: {
    alignSelf: 'center'
  },
  activeButton: {
    backgroundColor: Colors.secondaryDark
  },
  activeButtonText: {
    textAlign:'center',
    color: Colors.whiteFull
  },
})
