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
import CustomModal from './components/CustomModal';
import {Settings} from './components/Settings';

const storage = new MMKVLoader()
  .withEncryption() // Generates a random key and stores it securely in Keychain
  .initialize();
function App(): JSX.Element {
  const [apiKey, setApiKey] = useMMKVStorage('api_key', storage, '');
  const [projectId, setProjectId] = useMMKVStorage('project_id', storage, '');
  const [userPassword, setUserPassword] = useMMKVStorage(
    'user_password',
    storage,
    '',
  );
  const [salt, setSalt] = useMMKVStorage('salt', storage, '');

  const [isColorChanged, setIsColorChanged] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (!apiKey) {
    }
    // return () => {
    //   second
    // }
  }, []);

  return (
    <SafeAreaView>
      <StatusBar barStyle={'dark-content'} backgroundColor={'black'} />
      <CustomModal
        setVisible={setIsModalVisible}
        visible={isModalVisible}
        label="Settings">
        <View className="px-6 mt-5">
          <Settings
            apiKey={apiKey}
            projectId={projectId}
            userPassword={userPassword}
            setApiKey={setApiKey}
            setProjectId={setProjectId}
            setUserPassword={setUserPassword}
          />
        </View>
      </CustomModal>
      <View style={{backgroundColor: 'gray'}}>
        <TouchableOpacity
          style={styles.screenButton}
          disabled={apiKey && userPassword && projectId ? false : true}
          onPressIn={() => setIsColorChanged(true)}
          onPressOut={() => setIsColorChanged(false)}>
          <Icon
            name="download-cloud"
            size={30}
            color={
              apiKey && userPassword && projectId
                ? isColorChanged
                  ? '#000'
                  : '#A480EE'
                : 'gray'
            }
            style={{margin: 5}}
          />
          <Text
            style={
              apiKey && userPassword && projectId
                ? isColorChanged
                  ? styles.textStylingWhite
                  : styles.textStyling
                : styles.textStylingDisabled
            }>
            Pull to device
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settings}
          onPressIn={() => {
            setIsColorChanged(true);
            setIsModalVisible(!isModalVisible);
          }}
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
          onPressOut={() => setIsColorChanged(false)}
          disabled={apiKey && userPassword && projectId ? false : true}>
          <Icon
            name="upload-cloud"
            size={30}
            color={
              apiKey && userPassword && projectId
                ? isColorChanged
                  ? '#000'
                  : '#A480EE'
                : 'gray'
            }
            style={{margin: 5}}
          />
          <Text
            style={
              apiKey && userPassword && projectId
                ? isColorChanged
                  ? styles.textStylingWhite
                  : styles.textStyling
                : styles.textStylingDisabled
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
  textStylingDisabled: {
    fontWeight: '700',
    color: 'gray',
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
