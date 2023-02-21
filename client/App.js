import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, FlatList, LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigation";

// higher order component "withAuthenticator"
import { withAuthenticator } from "aws-amplify-react-native";
import { Amplify } from "aws-amplify";
import config from "./src/aws-exports";

Amplify.configure({ ...config, Analytics: { disabled: true } });

function App() {
  LogBox.ignoreLogs(["Remote debugger"]);
  return (
    <NavigationContainer>
      <RootNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default withAuthenticator(App);
