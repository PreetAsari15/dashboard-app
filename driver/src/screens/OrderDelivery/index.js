import {
  View,
  Text,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { useRef, useMemo, useEffect, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import {
  MaterialCommunityIcons,
  Entypo,
  FontAwesome5,
  Fontisto,
} from "@expo/vector-icons";
import orders from "../../../assets/data/orders.json";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";

import styles from "./styles";
const order = orders[0];

const OrderDelivery = () => {
  const [driverLocation, setDriverLocation] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalKm, setTotalKm] = useState(0);

  const bottomSheetRef = useRef(null);
  const { width, height } = useWindowDimensions();
  const snapPoints = useMemo(() => ["12%", "95%"], []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (!status === "granted") {
        console.log("Nonono");
        return;
      }

      let location = await Location.getCurrentPositionAsync();
      setDriverLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();

    const foregroundSubscription = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 100,
      },
      (updatedLocation) => {
        // We are only updating the setDriverLocation because everytime the driverLocation is updated it will re-render the remaning time and kms
        setDriverLocation({
          latitude: updatedLocation.coords.latitude,
          longitude: updatedLocation.coords.longitude,
        });
      }
    );
    return foregroundSubscription;
  }, []);

  if (!driverLocation) {
    return <ActivityIndicator size={"large"} />;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={{ height, width }}
        showsUserLocation
        followsUserLocation
        initialRegion={{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          longitudeDelta: 0.7,
          latitudeDelta: 0.7,
        }}
      >
        <MapViewDirections
          origin={driverLocation}
          destination={{ latitude: order.User.lat, longitude: order.User.lng }}
          strokeWidth={10}
          waypoints={[
            {
              latitude: order.WasteProvider.lat,
              longitude: order.WasteProvider.lng,
            },
          ]}
          strokeColor="#3FC060"
          // DONOT PUSH API KEY TO REPO
          apikey="Paste API Key Here"
          onReady={(result) => {
            setTotalMinutes(result.duration);
            setTotalKm(result.distance);
          }}
        />

        {/* One marker for wasteprovider and one for user */}
        <Marker
          coordinate={{
            latitude: order.WasteProvider.lat,
            longitude: order.WasteProvider.lng,
          }}
          title={order.WasteProvider.name}
          description={order.WasteProvider.address}
        >
          <View
            style={{ backgroundColor: "green", padding: 5, borderRadius: 15 }}
          >
            <Entypo name="shop" size={24} color="white" />
          </View>
        </Marker>

        <Marker
          coordinate={{ latitude: order.User.lat, longitude: order.User.lng }}
          title={order.User.name}
          description={order.User.address}
        >
          <View
            style={{ backgroundColor: "green", padding: 5, borderRadius: 15 }}
          >
            <MaterialCommunityIcons name="dump-truck" size={30} color="white" />
          </View>
        </Marker>
      </MapView>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <View style={styles.handleIndicatorContainer}>
          <Text style={styles.routeDetailsText}>
            {totalMinutes.toFixed(0)} min
          </Text>
          <FontAwesome5
            name="shopping-bag"
            size={30}
            color="#3FC060"
            style={{ marginHorizontal: 10 }}
          />
          <Text style={{ fontSize: 25, letterSpacing: 1 }}>
            {totalKm.toFixed(2)} Kms
          </Text>
        </View>
        <View style={styles.deliveryDetailsContainer}>
          <Text style={styles.wasteProviderName}>
            {order.WasteProvider.name}
          </Text>
          <View style={styles.addressContainer}>
            <Fontisto name="shopping-store" size={20} color="grey" />
            <Text
              style={{
                fontSize: 20,
                color: "grey",
                fontWeight: "600",
                letterSpacing: 0.5,
                marginLeft: 15,
                textAlign: "center",
              }}
            >
              {order.WasteProvider.address}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginBottom: 20,
              alignItems: "center",
            }}
          >
            <FontAwesome5 name="map-marker-alt" size={30} color="grey" />
            <Text
              style={{
                fontSize: 20,
                color: "grey",
                fontWeight: "500",
                letterSpacing: 0.5,
                marginLeft: 15,
                textAlign: "center",
              }}
            >
              {order.User.address}
            </Text>
          </View>

          <View style={styles.orderDetailsContainer}>
            <Text style={styles.orderItemText}>Retallack to Robinson</Text>
            <Text style={styles.orderItemText}>Plastic Services x3</Text>
            <Text style={styles.orderItemText}>Hazardous Services x3</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Accept Order</Text>
        </View>
      </BottomSheet>
    </View>
  );
};

export default OrderDelivery;
