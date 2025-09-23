import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const BASE_URL = "https://backend.shaslolav.space/api/auth/";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [role, setRole] = useState("customer"); // default role
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!email || !firstName || !lastName || !phone || !password || !passwordConfirm) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post(`${BASE_URL}register/`, {
        email,
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        password,
        password_confirm: passwordConfirm,
        role,
      });

      alert("Registration successful! Please login.");
      router.replace("login");
    } catch (err: any) {
      console.log(err.response?.data || err.message);
      if (err.response?.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError("Server error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>First Name:</Text>
      <TextInput value={firstName} onChangeText={setFirstName} style={styles.input} />

      <Text style={styles.label}>Last Name:</Text>
      <TextInput value={lastName} onChangeText={setLastName} style={styles.input} />

      <Text style={styles.label}>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <Text style={styles.label}>Phone Number:</Text>
      <TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={styles.input} />

      <Text style={styles.label}>Password:</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

      <Text style={styles.label}>Confirm Password:</Text>
      <TextInput value={passwordConfirm} onChangeText={setPasswordConfirm} secureTextEntry style={styles.input} />

      <Text style={styles.label}>Role:</Text>
      <TextInput value={role} onChangeText={setRole} style={styles.input} />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button title={loading ? "Registering..." : "Register"} onPress={handleRegister} disabled={loading} />

      <View style={{ marginTop: 15 }}>
        <Button title="Go to Login" onPress={() => router.replace("login")} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { marginBottom: 5 },
  input: { borderWidth: 1, padding: 8, marginBottom: 15 },
  error: { color: "red", marginBottom: 15 },
});
