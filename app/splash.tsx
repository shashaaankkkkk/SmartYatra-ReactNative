import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Animated, Easing, Image, StyleSheet, Text, View } from "react-native";

export default function Splash() {
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Start animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    // Check token after 2.5s
    const checkLogin = async () => {
      const access = await AsyncStorage.getItem("access");
      if (access) {
        router.replace("tabs"); // already logged in
      } else {
        router.replace("login"); // not logged in
      }
    };

    const timer = setTimeout(checkLogin, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image
          source={require("../assets/images/icon.png")} // put your logo in assets
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Bus Tracking & Ticketing</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
  },
});

