// HomeScreen.js

import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';

import * as DB from './database.json';

import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { getStatusBarHeight } from 'react-native-status-bar-height';

import { MonoText } from '../components/StyledText';
import Entry from '../components/Entry';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { SearchBar, Icon } from 'react-native-elements';
import MapView from 'react-native-maps';
import EntryFlatlist from '../components/EntryFlatlist';

import { EvilIcons } from 'react-native-vector-icons';

export default class HomeScreen extends React.Component {
    state = {
      location: null,
      errorMessage: null,
      text: 'Waiting..',
      search: '',
      longitude: 0,
      latitude: 0,
      entries: []
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
        var result = [];
        for (var i in DB)
        {
            result.push(DB[i]);
        }
        result = result.slice(0, -1);;
        this.setState({entries: result});
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
    }

    render()
    {
      const { search } = this.state;
      const menuIcon = <Icon
                          name='navicon'
                          type='evilicon'
                          onPress={() => this.props.navigation.toggleDrawer()} />;

      return (
          <View style={styles.container}>
            <SearchBar
                placeholder="Find Nearest Relief..."
                onChangeText={this.updateSearch}
                searchIcon={menuIcon}
                value={search}
                lightTheme
                round
            />

            <MapView
              style={{flex: 1}}
              region={{latitude: this.state.latitude,
                       longitude: this.state.longitude,
                       latitudeDelta: 0.0922,
                       longitudeDelta: 0.0421}}
              showsUserLocation={true}
            />

            <View style={styles.tabBarInfoContainer}>
                <EntryFlatlist entries={this.state.entries} />
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
    backgroundColor: '#fff',
    paddingTop: getStatusBarHeight()
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
        elevation: 0,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: Platform.OS === 'ios' ? '35%' : '0%',
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  }
});
