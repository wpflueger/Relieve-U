import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  View,
} from 'react-native';

import { MonoText } from '../components/StyledText';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { SearchBar } from 'react-native-elements';
import MapView from 'react-native-maps';

export default class HomeScreen extends React.Component {
    state = {
      location: null,
      errorMessage: null,
      text: 'Waiting..',
      search: '',
      longitude: 0,
      latitude: 0
    };

    updateSearch = search => {
      this.setState({ search });
    };

    componentWillMount() {
      if (Platform.OS === 'android' && !Constants.isDevice) {
        this.setState({
          errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
        });
      } else {
        this._getLocationAsync();
      }
    }

    _getLocationAsync = async () => {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        this.setState({
          errorMessage: 'Permission to access location was denied',
        });
      }

      let location = await Location.getCurrentPositionAsync({});
      this.setState({ location });

      if (this.state.errorMessage)
      {
        this.setState({text: this.state.errorMessage});
      }
      else if (this.state.location)
      {
        this.setState({text: this.state.location});
        this.setState({
          longitude: this.state.text.coords.longitude,
          latitude: this.state.text.coords.latitude
        });
      }
    };

    render()
    {
      const { search } = this.state;

      return (
          <View style={styles.container}>
            <StatusBar hidden />
            <SearchBar
                placeholder="Find Nearest Relief..."
                onChangeText={this.updateSearch}
                value={search}
                style={{position: 'absolute'}}
                lightTheme
            />

            <MapView style={{flex: 1}}
                     region={{latitude: this.state.latitude, longitude: this.state.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421}}
                     showsUserLocation={true}/>

            <View style={styles.tabBarInfoContainer}>
              <Text style={styles.tabBarInfoText}>
                This is a tab bar. You can edit it in:
              </Text>

              <View
                style={[styles.codeHighlightContainer, styles.navigationFilename]}>
                <MonoText style={styles.codeHighlightText}>
                  navigation/MainTabNavigator.js
                </MonoText>
              </View>
            </View>
          </View>
        );
    }
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  }
});
