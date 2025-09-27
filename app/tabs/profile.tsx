import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

const BASE_URL = "https://backend.shaslolav.space/api/auth/";

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = async () => {
    let access = await AsyncStorage.getItem("access");
    try {
      const res = await axios.get(`${BASE_URL}profile/`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      setProfile(res.data);
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        await refreshToken();
      } else {
        console.error("Profile fetch failed:", error.message || error);
        Alert.alert("Error", "Unable to load profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    const refresh = await AsyncStorage.getItem("refresh");
    try {
      const res = await axios.post(`${BASE_URL}refresh/`, { refresh });
      await AsyncStorage.setItem("access", res.data.access);
      fetchProfile();
    } catch (error: any) {
      console.error("Token refresh failed:", error.message || error);
      Alert.alert("Session expired", "Please login again");
      router.replace("/login");
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace("/login");
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ fontSize: 16, marginTop: 8 }}>Loading Profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text>No profile data found</Text>
      </View>
    );
  }

  const InfoBox = ({ icon, label, value }: any) => (
    <View style={styles.infoBox}>
      <Icon name={icon} size={20} color="#007bff" style={{ marginRight: 8 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri:
              profile.avatar ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.email}>{profile.email}</Text>
      </View>

      {/* Personal Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>👤 Personal Information</Text>
        <View style={styles.row}>
          <InfoBox icon="person-outline" label="Full Name" value={profile.full_name || "Not Provided"} />
          <InfoBox icon="call-outline" label="Phone" value={profile.phone || "Not Provided"} />
        </View>
        <View style={styles.row}>
          <InfoBox icon="calendar-outline" label="Age" value={profile.age || "N/A"} />
          <InfoBox icon="male-female-outline" label="Gender" value={profile.gender || "N/A"} />
        </View>
      </View>

      {/* Travel Stats */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🚍 Travel Status</Text>
        <View style={styles.row}>
          <InfoBox icon="stats-chart-outline" label="Total Rides" value={profile.total_rides || 25} />
          <InfoBox icon="ticket-outline" label="Tickets" value={profile.tickets || 20} />
        </View>
        <View style={styles.row}>
          <InfoBox icon="card-outline" label="Bus Pass" value={profile.bus_pass || "None"} />
        </View>
      </View>

      {/* More Details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>💼 More Details</Text>
        <View style={styles.row}>
          <InfoBox icon="wallet-outline" label="Wallet" value={`₹${profile.wallet_balance || 250}`} />
          <InfoBox icon="map-outline" label="Saved Routes" value={profile.saved_routes || 10} />
        </View>
        <View style={styles.row}>
          <InfoBox icon="time-outline" label="Last Ride" value={profile.last_ride || "No recent ride"} />
        </View>
      </View>

      

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "#27457bff",
    padding: 30,
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 12, backgroundColor: "#fff" },
  email: { color: "#fff", fontSize: 18, fontWeight: "600" },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 18,
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#007bff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#007bff", marginBottom: 12 },
  row: { 
  flexDirection: "row",
  flexWrap: "wrap",         // ensures wrapping to next line
  justifyContent: "space-between",
},

infoBox: {
  width: "48%",             // 2 per row with small gap
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#f1f6ff",
  padding: 10,
  borderRadius: 12,
  marginBottom: 10,         // consistent spacing between rows
  height: 75,               // fixed height for uniform look
},

infoLabel: { 
  fontSize: 13, 
  fontWeight: "600", 
  color: "#333" 
},
infoValue: { 
  fontSize: 14, 
  color: "#444", 
  fontWeight: "500" 
},



 
  logoutContainer: { alignItems: "center", marginVertical: 20 },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#27457bff",
    paddingVertical: 12,
    paddingHorizontal: 45,
    borderRadius: 30,
  },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 17 },
});
