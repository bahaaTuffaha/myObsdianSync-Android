import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
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
import {pushToCloud} from './utils/pushToCloud';
import {getFromCloud} from './utils/pullToDevice';
import {sha256} from 'js-sha256';
import {ActivityIndicator, MD2Colors} from 'react-native-paper';

const generateRandomPassword = (length = 12) => {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  let password = '';
  const characterCount = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characterCount);
    password += characters.charAt(randomIndex);
  }

  return password;
};

// const generateKey = async (password: string, iv: string) => {
//   // const keyBuffer = Aes.pbkdf2(password, iv, 100000, 256);
//   // return base64.encode(await keyBuffer);
//   const k = iv;
//   // const hashedData = sha256(k);
//   // console.log(hashedData);
//   return k;
// };

export const generateMyKey = async (
  userPassword: string,
  setUserPassword: Dispatch<SetStateAction<string>>,
) => {
  if (!userPassword) {
    const newIv = generateRandomPassword();
    setUserPassword(newIv);
  }
  return userPassword;
};

export const createTempDirectory = async () => {
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
  // const [iv, setIv] = useMMKVStorage('iv', localStorage, '');

  const [isColorChanged, setIsColorChanged] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading1, setLoading1] = useState(100);
  const [loading2, setLoading2] = useState(100);

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
            // iv={iv}
            // setIv={setIv}
          />
        </View>
      </CustomModal>
      <View style={{backgroundColor: 'gray'}}>
        <TouchableOpacity
          style={styles.screenButton}
          disabled={apiKey && userPassword && projectId ? false : true}
          onPressIn={() => {
            setIsColorChanged(true);
            getFromCloud(
              userPassword,
              setUserPassword,
              fileLocation,
              loading1,
              setLoading1,
            );
          }}
          onPressOut={() => setIsColorChanged(false)}>
          {loading1 < 100 ? (
            <>
              <ActivityIndicator animating={true} color={MD2Colors.purple400} />
              <Text className="text-purple">{loading1.toFixed(1) + '%'}</Text>
            </>
          ) : (
            <>
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
            </>
          )}
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
            pushToCloud(
              userPassword,
              setUserPassword,
              fileLocation,
              loading2,
              setLoading2,
            );
          }}
          disabled={apiKey && userPassword && projectId ? false : true}>
          {loading2 < 100 ? (
            <>
              <ActivityIndicator animating={true} color={MD2Colors.purple400} />
              <Text className="text-purple">{loading2.toFixed(1) + '%'}</Text>
            </>
          ) : (
            <>
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
            </>
          )}
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
