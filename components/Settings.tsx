import {View, TouchableOpacity} from 'react-native';
import {TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import * as ScopedStorage from 'react-native-scoped-storage';

export const Settings = ({
  fileLocation,
  setFileLocation,
  apiKey,
  setApiKey,
  projectId,
  setProjectId,
  userPassword,
  setUserPassword,
  iv,
  setIv,
}: {
  apiKey: string;
  projectId: string;
  userPassword: string;
  fileLocation: string;
  setApiKey: (value: string | ((prevValue: string) => string)) => void;
  setProjectId: (value: string | ((prevValue: string) => string)) => void;
  setUserPassword: (value: string | ((prevValue: string) => string)) => void;
  setFileLocation: (value: string | ((prevValue: string) => string)) => void;
  iv: string;
  setIv: (value: string | ((prevValue: string) => string)) => void;
}) => {
  const pickDirectory = async () => {
    const selectedDir = await ScopedStorage.openDocumentTree(true);
    setFileLocation(selectedDir.uri);
  };

  return (
    <View className="space-y-5">
      <View className="flex flex-row justify-between">
        <TextInput
          mode="flat"
          className="w-60"
          textContentType="name"
          label="File Location"
          value={fileLocation}
          onChange={text => setFileLocation(text.nativeEvent.text)}
        />
        <TouchableOpacity
          className="w-10 h-10 flex justify-center items-center self-center bg-[#E7E0EC]"
          onPress={pickDirectory}>
          <Icon name="folder" size={20} style={{margin: 5}} />
        </TouchableOpacity>
      </View>
      <TextInput
        mode="flat"
        textContentType="name"
        label="Storage Api Key"
        value={apiKey}
        onChange={text => setApiKey(text.nativeEvent.text)}
      />
      <TextInput
        mode="flat"
        textContentType="name"
        label="Project Id"
        value={projectId}
        onChange={text => setProjectId(text.nativeEvent.text)}
      />
      <TextInput
        mode="flat"
        textContentType="password"
        // style={styles.customWidth}
        secureTextEntry={true}
        label="Your password"
        value={userPassword}
        onChange={text => setUserPassword(text.nativeEvent.text)}
      />
      <TextInput
        mode="flat"
        textContentType="name"
        label="IV (Optional)"
        value={iv}
        onChange={text => setIv(text.nativeEvent.text)}
      />
      <View className="h-2"></View>
    </View>
  );
};
