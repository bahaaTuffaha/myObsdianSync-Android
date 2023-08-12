/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {MMKVLoader, useMMKVStorage} from 'react-native-mmkv-storage';
import Icon from 'react-native-vector-icons/Feather';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const storage = new MMKVLoader()
  .withEncryption() // Generates a random key and stores it securely in Keychain
  .initialize();
function App(): JSX.Element {
  const [apiKey, setApiKey] = useMMKVStorage('api_key', storage, '');
  const [projectId, setProjectId] = useMMKVStorage('project_id', storage, '');
  const [isColorChanged, setIsColorChanged] = useState(false);
  // const [projectId, setProjectId] = useMMKVStorage('project_id', storage, '');
  // storage.set(file_location,"");
  //api_key
  //project_id
  //user_password
  //salt
  useEffect(() => {
    // return () => {
    //   second
    // }
  }, []);

  return (
    <SafeAreaView>
      <StatusBar barStyle={'dark-content'} backgroundColor={'black'} />
      <View style={{backgroundColor: 'gray'}}>
        <TouchableOpacity
          style={styles.screenButton}
          onPressIn={() => setIsColorChanged(true)}
          onPressOut={() => setIsColorChanged(false)}>
          <Icon
            name="download-cloud"
            size={30}
            color={isColorChanged ? '#000' : '#A480EE'}
            style={{margin: 5}}
          />
          <Text
            style={
              isColorChanged ? styles.textStylingWhite : styles.textStyling
            }>
            Pull to device
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settings}
          onPressIn={() => setIsColorChanged(true)}
          onPressOut={() => setIsColorChanged(false)}>
          <Icon
            name="settings"
            size={30}
            color={isColorChanged ? '#000' : '#A480EE'}
            style={{margin: 5}}
          />
          <Text
            style={
              isColorChanged ? styles.textStylingWhite : styles.textStyling
            }>
            Settings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.screenButton}
          onPressIn={() => setIsColorChanged(true)}
          onPressOut={() => setIsColorChanged(false)}>
          <Icon
            name="upload-cloud"
            size={30}
            color={isColorChanged ? '#000' : '#A480EE'}
            style={{margin: 5}}
          />
          <Text
            style={
              isColorChanged ? styles.textStylingWhite : styles.textStyling
            }>
            Push to cloud
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  textStyling: {
    fontWeight: '700',
    color: '#A480EE',
  },
  textStylingWhite: {
    fontWeight: '700',
    color: 'black',
  },
  screenButton: {
    height: '40%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    flexDirection: 'row',
  },
  settings: {
    height: '20%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    flexDirection: 'row',
  },
});

export default App;
