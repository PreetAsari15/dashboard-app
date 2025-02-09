import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Auth, DataStore } from "aws-amplify";
import { Courier, TransportationModes } from "../../models";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import {
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const Profile = () => {
  const { dbCourier, sub, setDbCourier } = useAuthContext();

  const [name, setName] = useState(dbCourier?.name || "");
  const [transportationMode, setTransportationMode] = useState(
    TransportationModes.TRUCK
  );

  const navigation = useNavigation();

  const onSave = async () => {
    if (dbCourier) {
      await updateCourier();
    } else {
      await createCourier();
    }
    navigation.goBack();
  };

  const updateCourier = async () => {
    const courier = await DataStore.save(
      Courier.copyOf(dbCourier, (updated) => {
        updated.name = name;
        updated.transportationMode = transportationMode;
      })
    );
    setDbCourier(courier);
  };

  const createCourier = () => {
    try {
      const courier = DataStore.save(
        new Courier({
          name,
          sub,
          transportationMode,
        })
      );
      setDbCourier(courier);
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <SafeAreaView>
      <Text style={styles.title}>Profile</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        style={styles.input}
      />
      <View style={{ flexDirection: "row" }}>
        <Pressable
          onPress={() => setTransportationMode(TransportationModes.TRUCK)}
          style={{
            backgroundColor:
              transportationMode === TransportationModes.TRUCK
                ? "#3FC060"
                : "white",
            margin: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: "gray",
            borderRadius: 10,
          }}
        >
          <MaterialCommunityIcons
            name="truck-flatbed"
            size={40}
            color="black"
          />
        </Pressable>
        <Pressable
          onPress={() => setTransportationMode(TransportationModes.LORRY)}
          style={{
            backgroundColor:
              transportationMode === TransportationModes.LORRY
                ? "#3FC060"
                : "white",
            margin: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: "gray",
            borderRadius: 10,
          }}
        >
          <MaterialCommunityIcons name="dump-truck" size={40} color="black" />
        </Pressable>
      </View>
      <Button onPress={onSave} title="Save" />
      <Text
        onPress={() => Auth.signOut()}
        style={{ textAlign: "center", color: "red", margin: 10 }}
      >
        Sign out
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  input: {
    margin: 10,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
  },
});

export default Profile;
