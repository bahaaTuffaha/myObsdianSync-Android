import {View} from 'react-native';
import {TextInput} from 'react-native-paper';

export const Settings = ({
  apiKey,
  setApiKey,
  projectId,
  setProjectId,
  userPassword,
  setUserPassword,
}: {
  apiKey: string;
  projectId: string;
  userPassword: string;
  setApiKey: (value: string | ((prevValue: string) => string)) => void;
  setProjectId: (value: string | ((prevValue: string) => string)) => void;
  setUserPassword: (value: string | ((prevValue: string) => string)) => void;
}) => {
  return (
    <View className="space-y-5">
      <TextInput
        mode="flat"
        textContentType="name"
        // style={styles.customWidth}
        label="Storage Api Key"
        value={apiKey}
        onChange={text => setApiKey(text.nativeEvent.text)}
      />
      <TextInput
        mode="flat"
        textContentType="name"
        // style={styles.customWidth}
        label="Project Id"
        value={projectId}
        onChange={text => setProjectId(text.nativeEvent.text)}
      />
      <TextInput
        mode="flat"
        textContentType="password"
        // style={styles.customWidth}
        label="Your password"
        value={userPassword}
        onChange={text => setUserPassword(text.nativeEvent.text)}
      />
    </View>
  );
};
