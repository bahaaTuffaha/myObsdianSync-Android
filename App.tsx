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
import Aes from 'react-native-aes-crypto';
import RNFS from 'react-native-fs';
import {zipWithPassword, unzipWithPassword} from 'react-native-zip-archive';
var RNGRP = require('react-native-get-real-path');
import {firebase} from './config';

const generateKey = (
  password: string,
  iv: string,
  cost = 100000,
  length = 32,
) => Aes.pbkdf2(password, iv, cost, length);

const generateMyKey = async (
  userPassword: string,
  iv: string,
  setIv: (value: string | ((prevValue: string) => string)) => void,
) => {
  if (!iv) {
    const newIv = await Aes.randomKey(32);
    setIv(newIv);
  }
  return generateKey(userPassword, iv);
};

// zipWithPassword(sourcePath, zipPath, password, encryptionType)
//   .then((path) => {
//     console.log(`Zip with encryption completed at ${path}`);
//   })
//   .catch((error) => {
//     console.error('Error zipping with encryption:', error);
//   });

//   unzipWithPassword(sourcePath, targetPath, password)
// .then((path) => {
//   console.log(`unzip completed at ${path}`)
// })
// .catch((error) => {
//   console.error(error)
// })

const createTempDirectory = async () => {
  try {
    const tempPath = RNFS.CachesDirectoryPath + '/ObsdianSyncTemp'; // Adjust the directory name as needed

    // Check if the directory already exists, if not, create it
    const directoryExists = await RNFS.exists(tempPath);
    if (!directoryExists) {
      await RNFS.mkdir(tempPath);
      console.log('Temporary directory created:', tempPath);
      return String(tempPath);
    } else {
      console.log('Temporary directory already exists:', tempPath);
      return String(tempPath);
    }
  } catch (error) {
    console.error('Error creating temporary directory:', error);
  }
};

async function pushToCloud(
  userPassword: string,
  iv: string,
  setIv: (value: string | ((prevValue: string) => string)) => void,
  fileLocation: string,
) {
  try {
    let gKey = await generateMyKey(userPassword, iv, setIv);
    const tempLocation = await createTempDirectory();
    const encryptionType = 'AES-256';

    const filePath = await RNGRP.getRealPathFromURI(fileLocation);

    const zipPath = await zipWithPassword(
      filePath,
      tempLocation + '/package.enc',
      gKey,
      encryptionType as any,
    );

    console.log(`Zip with encryption completed at ${zipPath}`);

    // Use Firebase Storage reference to upload the file
    const storageRef = firebase.storage().ref().child('package.enc'); // Replace with desired storage location
    const fileData = await RNFS.readFile(zipPath, 'base64');
    const uploadTask = storageRef.put(fileData, {
      contentType: 'application/zip',
    });
    // Handle the upload progress if needed
    uploadTask.on('state_changed', snapshot => {
      // You can track the upload progress here if needed
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(`Upload is ${progress}% done`);
    });
    await uploadTask;

    console.log('File uploaded successfully.');
    // Clean up temporary files if needed
    await RNFS.unlink(zipPath);
  } catch (error) {
    console.error('Error:', error);
  }
}
const localStorage = new MMKVLoader()
  .withEncryption() // Generates a random key and stores it securely in Keychain
  .initialize();
function App(): JSX.Element {
  const [fileLocation, setFileLocation] = useMMKVStorage(
    'file_location',
    localStorage,
    '',
  );
  const [apiKey, setApiKey] = useMMKVStorage('api_key', localStorage, '');
  const [projectId, setProjectId] = useMMKVStorage(
    'project_id',
    localStorage,
    '',
  );
  const [userPassword, setUserPassword] = useMMKVStorage(
    'user_password',
    localStorage,
    '',
  );
  const [iv, setIv] = useMMKVStorage('iv', localStorage, '');

  const [isColorChanged, setIsColorChanged] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // useEffect(() => {
  //   // return () => {
  //   //   second
  //   // }
  // }, []);

  return (
    <SafeAreaView>
      <StatusBar barStyle={'dark-content'} backgroundColor={'black'} />
      <CustomModal
        setVisible={setIsModalVisible}
        visible={isModalVisible}
        label="Settings">
        <View className="px-6 mt-5">
          <Settings
            fileLocation={fileLocation}
            setFileLocation={setFileLocation}
            apiKey={apiKey}
            projectId={projectId}
            userPassword={userPassword}
            setApiKey={setApiKey}
            setProjectId={setProjectId}
            setUserPassword={setUserPassword}
            iv={iv}
            setIv={setIv}
          />
        </View>
      </CustomModal>
      <View style={{backgroundColor: 'gray'}}>
        <TouchableOpacity
          style={styles.screenButton}
          disabled={apiKey && userPassword && projectId ? false : true}
          onPressIn={() => {
            setIsColorChanged(true);
          }}
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
          onPressOut={() => {
            setIsColorChanged(false);
            pushToCloud(userPassword, iv, setIv, fileLocation);
          }}
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
