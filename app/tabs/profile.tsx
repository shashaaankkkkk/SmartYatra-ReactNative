import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, Text, View } from "react-native";

const BASE_URL = "https://backend.shaslolav.space/api/auth/";

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  const fetchProfile = async () => {
    let access = await AsyncStorage.getItem("access");
    try {
      const res = await axios.get(`${BASE_URL}profile/`, { headers: { Authorization: `Bearer ${access}` } });
      setProfile(res.data);
    } catch (err: any) {
      if (err.response?.status === 401) await refreshToken(); // token expired
    }
  };

  const refreshToken = async () => {
    const refresh = await AsyncStorage.getItem("refresh");
    try {
      const res = await axios.post(`${BASE_URL}refresh/`, { refresh });
      await AsyncStorage.setItem("access", res.data.access);
      fetchProfile();
    } catch (err) {
      Alert.alert("Session expired", "Please login again");
      router.replace("/login");
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace("/login");
  };

  useEffect(() => { fetchProfile(); }, []);

  if (!profile) return <Text>Loading...</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Text>Username: {profile.username}</Text>
      <Text>Email: {profile.email}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
