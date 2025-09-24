import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Book = () => {
  const [tripType, setTripType] = useState("one-way");
  const [passengers, setPassengers] = useState(2);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerType, setDatePickerType] = useState("departure");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationSelectType, setLocationSelectType] = useState("from");
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  const [showReturnDate, setShowReturnDate] = useState(false);

  // Sample locations data
  const locations = [
    { id: 1, city: "Manchester", country: "United Kingdom", code: "MAN" },
    { id: 2, city: "London", country: "United Kingdom", code: "LON" },
    { id: 3, city: "Paris", country: "France", code: "PAR" },
    { id: 4, city: "Berlin", country: "Germany", code: "BER" },
    { id: 5, city: "Amsterdam", country: "Netherlands", code: "AMS" },
    { id: 6, city: "Brussels", country: "Belgium", code: "BRU" },
    { id: 7, city: "Barcelona", country: "Spain", code: "BCN" },
    { id: 8, city: "Milan", country: "Italy", code: "MIL" },
    { id: 9, city: "Prague", country: "Czech Republic", code: "PRG" },
    { id: 10, city: "Vienna", country: "Austria", code: "VIE" },
  ];

  const ProfileImage = () => (
    <View style={styles.profileImageContainer}>
      <View style={styles.profileImage}>
        <Text style={styles.profileInitial}>A</Text>
      </View>
    </View>
  );

  const handleLocationSelect = (location) => {
    const locationText = `${location.city}, ${location.country}`;
    if (locationSelectType === "from") {
      setFromLocation(locationText);
    } else {
      setToLocation(locationText);
    }
    setShowLocationModal(false);
  };

  const handleSwapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate =
      selectedDate ||
      (datePickerType === "departure" ? departureDate : returnDate);
    setShowDatePicker(Platform.OS === "ios");

    if (datePickerType === "departure") {
      setDepartureDate(currentDate);
    } else {
      setReturnDate(currentDate);
    }
  };

  const openDatePicker = (type) => {
    setDatePickerType(type);
    setShowDatePicker(true);
  };

  const formatDate = (date) => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const handleSearch = () => {
    if (!fromLocation || !toLocation) {
      Alert.alert(
        "Missing Information",
        "Please select both departure and destination locations.",
      );
      return;
    }

    if (fromLocation === toLocation) {
      Alert.alert(
        "Invalid Route",
        "Departure and destination cannot be the same.",
      );
      return;
    }

    if (tripType === "round-trip" && !showReturnDate) {
      Alert.alert(
        "Missing Return Date",
        "Please select a return date for round trip.",
      );
      return;
    }

    // Here you would typically navigate to search results or make an API call
    Alert.alert(
      "Search Started",
      `Searching for ${tripType} tickets from ${fromLocation} to ${toLocation} for ${passengers} passenger${passengers > 1 ? "s" : ""}.`,
    );
  };

  const renderLocationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.locationItem}
      onPress={() => handleLocationSelect(item)}
    >
      <View style={styles.locationItemLeft}>
        <View style={styles.locationCode}>
          <Text style={styles.locationCodeText}>{item.code}</Text>
        </View>
        <View>
          <Text style={styles.locationCity}>{item.city}</Text>
          <Text style={styles.locationCountry}>{item.country}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logo}>
              {/* <Text style={styles.logoIcon}>🚌</Text> */}
              <Text style={styles.logoText}>Smart Yatra</Text>
            </View>
            <Text style={styles.subtitle}>Find cheap bus tickets</Text>
          </View>
          <ProfileImage />
        </View>

        {/* Search Form */}
        <View style={styles.searchForm}>
          {/* Trip Type Selector */}
          <View style={styles.tripTypeContainer}>
            <TouchableOpacity
              style={[
                styles.tripTypeButton,
                tripType === "one-way" && styles.tripTypeActive,
              ]}
              onPress={() => {
                setTripType("one-way");
                setShowReturnDate(false);
              }}
            >
              <Text
                style={[
                  styles.tripTypeText,
                  tripType === "one-way" && styles.tripTypeTextActive,
                ]}
              >
                One-way
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tripTypeButton,
                tripType === "round-trip" && styles.tripTypeActive,
              ]}
              onPress={() => {
                setTripType("round-trip");
                setShowReturnDate(true);
              }}
            >
              <Text
                style={[
                  styles.tripTypeText,
                  tripType === "round-trip" && styles.tripTypeTextActive,
                ]}
              >
                Round trip
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.passengersContainer}
              onPress={() => setShowPassengerModal(true)}
            >
              <Ionicons name="person-outline" size={16} color="#666" />
              <Text style={styles.passengersText}>{passengers}</Text>
            </TouchableOpacity>
          </View>

          {/* Location Inputs */}
          <View style={styles.locationContainer}>
            <TouchableOpacity
              style={styles.locationInput}
              onPress={() => {
                setLocationSelectType("from");
                setShowLocationModal(true);
              }}
            >
              <Ionicons name="location-outline" size={20} color="#666" />
              <Text
                style={[
                  styles.locationText,
                  !fromLocation && styles.placeholderText,
                ]}
              >
                {fromLocation || "From where?"}
              </Text>
              <TouchableOpacity
                style={styles.swapButton}
                onPress={handleSwapLocations}
              >
                <Ionicons name="swap-vertical" size={20} color="#00D4AA" />
              </TouchableOpacity>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.locationInput}
              onPress={() => {
                setLocationSelectType("to");
                setShowLocationModal(true);
              }}
            >
              <Ionicons name="location-outline" size={20} color="#666" />
              <Text
                style={[
                  styles.locationText,
                  !toLocation && styles.placeholderText,
                ]}
              >
                {toLocation || "To where?"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Date Input */}
          <View style={styles.dateContainer}>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => openDatePicker("departure")}
            >
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.dateText}>{formatDate(departureDate)}</Text>
            </TouchableOpacity>

            {tripType === "round-trip" ? (
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => openDatePicker("return")}
              >
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <Text style={styles.dateText}>{formatDate(returnDate)}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.addReturnButton}
                onPress={() => {
                  setTripType("round-trip");
                  setShowReturnDate(true);
                }}
              >
                <Ionicons name="add" size={16} color="#666" />
                <Text style={styles.addReturnText}>Add return</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Search Button */}
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Cheap Tickets Section */}
        {fromLocation && toLocation && (
          <View style={styles.cheapTicketsSection}>
            <Text style={styles.sectionTitle}>Cheap bus tickets</Text>
            <Text style={styles.sectionSubtitle}>
              from {fromLocation.split(",")[0]} to {toLocation.split(",")[0]}
            </Text>

            <View style={styles.priceCards}>
              <View style={styles.priceCard}>
                <Text style={styles.priceLabel}>Cheapest</Text>
                <Text style={styles.price}>
                  £{Math.floor(Math.random() * 50) + 80}
                </Text>
                <TouchableOpacity style={styles.findTicketButton}>
                  <Text style={styles.findTicketText}>Find ticket</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.priceCard}>
                <Text style={styles.priceLabel}>Average</Text>
                <Text style={styles.price}>
                  £{Math.floor(Math.random() * 50) + 120}
                </Text>
                <View style={styles.tipContainer}>
                  <Ionicons name="bulb-outline" size={16} color="#666" />
                  <Text style={styles.tipText}>
                    Find a cheap fare by booking as far in advance
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Bus Times Section */}
        {fromLocation && toLocation && (
          <View style={styles.busTimesSection}>
            <Text style={styles.sectionTitle}>Bus times</Text>
            <Text style={styles.sectionSubtitle}>
              from {fromLocation.split(",")[0]} to {toLocation.split(",")[0]}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Location Selection Modal */}
      <Modal
        visible={showLocationModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {locationSelectType === "from"
                ? "Select departure"
                : "Select destination"}
            </Text>
            <TouchableOpacity onPress={() => setShowLocationModal(false)}>
              <Ionicons name="close" size={24} color="#1B1B3A" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={locations}
            renderItem={renderLocationItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.locationList}
          />
        </SafeAreaView>
      </Modal>

      {/* Passenger Selection Modal */}
      <Modal
        visible={showPassengerModal}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.passengerModal}>
            <Text style={styles.passengerModalTitle}>Number of passengers</Text>
            <View style={styles.passengerControls}>
              <TouchableOpacity
                style={[
                  styles.passengerButton,
                  passengers <= 1 && styles.passengerButtonDisabled,
                ]}
                onPress={() => passengers > 1 && setPassengers(passengers - 1)}
                disabled={passengers <= 1}
              >
                <Ionicons
                  name="remove"
                  size={20}
                  color={passengers <= 1 ? "#ccc" : "#1B1B3A"}
                />
              </TouchableOpacity>
              <Text style={styles.passengerCount}>{passengers}</Text>
              <TouchableOpacity
                style={[
                  styles.passengerButton,
                  passengers >= 9 && styles.passengerButtonDisabled,
                ]}
                onPress={() => passengers < 9 && setPassengers(passengers + 1)}
                disabled={passengers >= 9}
              >
                <Ionicons
                  name="add"
                  size={20}
                  color={passengers >= 9 ? "#ccc" : "#1B1B3A"}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.passengerDoneButton}
              onPress={() => setShowPassengerModal(false)}
            >
              <Text style={styles.passengerDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={datePickerType === "departure" ? departureDate : returnDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 20,
    marginBottom: 30,
  },
  headerLeft: {
    flex: 1,
  },
  logo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  logoIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1B1B3A",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  profileImageContainer: {
    marginLeft: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
  },
  searchForm: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tripTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  tripTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 0,
    marginRight: 20,
  },
  tripTypeActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#1B1B3A",
  },
  tripTypeText: {
    fontSize: 16,
    color: "#666",
  },
  tripTypeTextActive: {
    color: "#1B1B3A",
    fontWeight: "500",
  },
  passengersContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F8F8F8",
    borderRadius: 20,
  },
  passengersText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#1B1B3A",
    fontWeight: "500",
  },
  locationContainer: {
    marginBottom: 20,
  },
  locationInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    position: "relative",
  },
  locationText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#1B1B3A",
  },
  placeholderText: {
    color: "#666",
  },
  swapButton: {
    position: "absolute",
    right: 15,
    top: "50%",
    marginTop: -10,
    padding: 5,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    gap: 10,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    padding: 15,
    borderRadius: 12,
    flex: 1,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#1B1B3A",
  },
  addReturnButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  addReturnText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#666",
  },
  searchButton: {
    backgroundColor: "#1B1B3A",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cheapTicketsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1B1B3A",
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  priceCards: {
    flexDirection: "row",
    gap: 15,
  },
  priceCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  priceLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1B1B3A",
    marginBottom: 15,
  },
  findTicketButton: {
    backgroundColor: "#E8F5F3",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  findTicketText: {
    color: "#00A085",
    fontSize: 14,
    fontWeight: "500",
  },
  tipContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
  },
  tipText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
  busTimesSection: {
    marginBottom: 30,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B1B3A",
  },
  locationList: {
    flex: 1,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  locationItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationCode: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  locationCodeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
  },
  locationCity: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1B1B3A",
  },
  locationCountry: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  passengerModal: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    minWidth: 280,
  },
  passengerModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B1B3A",
    marginBottom: 25,
  },
  passengerControls: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  passengerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  passengerButtonDisabled: {
    backgroundColor: "#F8F8F8",
  },
  passengerCount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1B1B3A",
    marginHorizontal: 30,
  },
  passengerDoneButton: {
    backgroundColor: "#1B1B3A",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  passengerDoneText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Book;

