import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
  Modal,
} from "react-native";

interface BusStop {
  id: string;
  name: string;
  distance: string;
  routes: string[];
  nextBus: string;
  fare: number;
}

interface BusRoute {
  id: string;
  routeName: string;
  from: string;
  to: string;
  nextDeparture: string;
  duration: string;
  fare: number;
  busType: string;
  available: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"stops" | "routes">(
    "stops",
  );
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Dummy data for Punjab bus stops
  const nearbyStops: BusStop[] = [
    {
      id: "1",
      name: "Chandigarh Bus Stand",
      distance: "0.2 km",
      routes: ["Route 1", "Route 5", "Route 12"],
      nextBus: "5 min",
      fare: 15,
    },
    {
      id: "2",
      name: "Sector 17 Plaza",
      distance: "0.8 km",
      routes: ["Route 3", "Route 7"],
      nextBus: "12 min",
      fare: 20,
    },
    {
      id: "3",
      name: "PGI Hospital",
      distance: "1.2 km",
      routes: ["Route 2", "Route 8", "Route 15"],
      nextBus: "8 min",
      fare: 25,
    },
    {
      id: "4",
      name: "Panjab University",
      distance: "2.1 km",
      routes: ["Route 4", "Route 11"],
      nextBus: "15 min",
      fare: 30,
    },
    {
      id: "5",
      name: "IT Park Mohali",
      distance: "3.5 km",
      routes: ["Route 6", "Route 9"],
      nextBus: "20 min",
      fare: 35,
    },
  ];

  const busRoutes: BusRoute[] = [
    {
      id: "1",
      routeName: "Chandigarh - Amritsar Express",
      from: "Chandigarh",
      to: "Amritsar",
      nextDeparture: "08:30 AM",
      duration: "4h 30m",
      fare: 450,
      busType: "AC Sleeper",
      available: true,
    },
    {
      id: "2",
      routeName: "Ludhiana - Jalandhar Local",
      from: "Ludhiana",
      to: "Jalandhar",
      nextDeparture: "09:15 AM",
      duration: "1h 45m",
      fare: 120,
      busType: "Non-AC",
      available: true,
    },
    {
      id: "3",
      routeName: "Patiala - Mohali Metro",
      from: "Patiala",
      to: "Mohali",
      nextDeparture: "10:00 AM",
      duration: "2h 15m",
      fare: 180,
      busType: "AC Bus",
      available: false,
    },
    {
      id: "4",
      routeName: "Bathinda - Moga Direct",
      from: "Bathinda",
      to: "Moga",
      nextDeparture: "11:30 AM",
      duration: "2h 30m",
      fare: 200,
      busType: "Deluxe",
      available: true,
    },
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getResponsiveWidth = () => {
    if (isWeb) {
      return Math.min(screenWidth, 600);
    }
    return screenWidth;
  };

  const getContentPadding = () => {
    if (isWeb && screenWidth > 600) {
      return (screenWidth - 600) / 2;
    }
    return 0;
  };

  const MapView: React.FC = () => {
    return (
      <View style={styles.mapContainer}>
        {/* Simulated Map Background */}
        <View style={styles.mapBackground}>
          {/* Map Elements */}
          <View style={[styles.mapElement, { top: "20%", left: "15%" }]}>
            <View style={styles.parkIcon}>
              <Text style={styles.parkIconText}>🌳</Text>
            </View>
            <Text style={styles.mapLabel}>Rock Garden</Text>
          </View>

          <View style={[styles.mapElement, { top: "40%", left: "70%" }]}>
            <View style={styles.mallIcon}>
              <Text style={styles.mallIconText}>🏬</Text>
            </View>
            <Text style={styles.mapLabel}>Elante Mall</Text>
          </View>

          {/* Roads */}
          <View style={[styles.road, styles.roadHorizontal1]} />
          <View style={[styles.road, styles.roadHorizontal2]} />
          <View style={[styles.road, styles.roadVertical1]} />
          <View style={[styles.road, styles.roadVertical2]} />

          {/* Bus Stops */}
          <TouchableOpacity
            style={[styles.busStop, { top: "35%", left: "25%" }]}
          >
            <View style={styles.busStopIcon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.busStop, { top: "60%", left: "50%" }]}
          >
            <View style={styles.busStopIcon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.busStop, { top: "25%", left: "80%" }]}
          >
            <View style={styles.busStopIcon} />
          </TouchableOpacity>

          {/* Current Location */}
          <View style={styles.currentLocation}>
            <View style={styles.currentLocationDot} />
            <View style={styles.currentLocationRing} />
          </View>
        </View>

        {/* Map Controls */}
        <TouchableOpacity style={styles.locationButton}>
          <Text style={styles.locationButtonText}>📍</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.zoomButton}>
          <Text style={styles.zoomButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const BusStopCard: React.FC<{ stop: BusStop; index: number }> = ({
    stop,
    index,
  }) => {
    const cardAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.stopCard,
          {
            opacity: cardAnim,
            transform: [
              {
                translateY: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.stopHeader}>
          <View style={styles.stopInfo}>
            <Text style={styles.stopName}>{stop.name}</Text>
            <Text style={styles.stopDistance}>📍 {stop.distance} away</Text>
          </View>
          <View style={styles.nextBusContainer}>
            <Text style={styles.nextBusLabel}>Next Bus</Text>
            <Text style={styles.nextBusTime}>{stop.nextBus}</Text>
          </View>
        </View>

        <View style={styles.routesContainer}>
          <Text style={styles.routesLabel}>Available Routes:</Text>
          <View style={styles.routesList}>
            {stop.routes.map((route, idx) => (
              <View key={idx} style={styles.routeTag}>
                <Text style={styles.routeTagText}>{route}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.fareContainer}>
          <Text style={styles.fareLabel}>Starting from</Text>
          <Text style={styles.fareAmount}>₹{stop.fare}</Text>
        </View>
      </Animated.View>
    );
  };

  const RouteCard: React.FC<{ route: BusRoute; index: number }> = ({
    route,
    index,
  }) => {
    const cardAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.routeCard,
          {
            opacity: cardAnim,
            transform: [
              {
                translateY: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.routeHeader}>
          <Text style={styles.routeName}>{route.routeName}</Text>
          <View
            style={[
              styles.availabilityBadge,
              { backgroundColor: route.available ? "#059669" : "#DC2626" },
            ]}
          >
            <Text style={styles.availabilityText}>
              {route.available ? "Available" : "Full"}
            </Text>
          </View>
        </View>

        <View style={styles.routeDetails}>
          <View style={styles.routePath}>
            <Text style={styles.cityText}>{route.from}</Text>
            <View style={styles.routeLineContainer}>
              <View style={styles.routeLine} />
              <Text style={styles.busIcon}>🚌</Text>
              <View style={styles.routeLine} />
            </View>
            <Text style={styles.cityText}>{route.to}</Text>
          </View>

          <View style={styles.routeInfo}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Departure</Text>
              <Text style={styles.infoValue}>{route.nextDeparture}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{route.duration}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Bus Type</Text>
              <Text style={styles.infoValue}>{route.busType}</Text>
            </View>
          </View>
        </View>

        <View style={styles.routeFooter}>
          <Text style={styles.routeFare}>₹{route.fare}</Text>
          <TouchableOpacity
            style={[
              styles.bookButton,
              { backgroundColor: route.available ? "#1E293B" : "#9CA3AF" },
            ]}
            disabled={!route.available}
            activeOpacity={0.8}
          >
            <Text style={styles.bookButtonText}>
              {route.available ? "Book Now" : "Fully Booked"}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const styles = {
    container: {
      flex: 1,
      backgroundColor: "#F8FAFC",
      width: getResponsiveWidth(),
      alignSelf: "center" as const,
      marginHorizontal: getContentPadding(),
    },
    header: {
      backgroundColor: "#1E293B",
      paddingTop: Platform.OS === "ios" ? 50 : 30,
      paddingBottom: 20,
      paddingHorizontal: 20,
    },
    searchContainer: {
      flexDirection: "row" as const,
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.15)",
      borderRadius: 25,
      paddingHorizontal: 16,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.2)",
    },
    searchIcon: {
      fontSize: 18,
      color: "rgba(255,255,255,0.8)",
      marginRight: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: "white",
      paddingVertical: 12,
    },
    notificationButton: {
      position: "absolute" as const,
      right: 20,
      top: Platform.OS === "ios" ? 50 : 30,
      backgroundColor: "rgba(255,255,255,0.15)",
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.2)",
    },
    notificationIcon: {
      fontSize: 20,
      color: "white",
    },
    mapContainer: {
      height: screenHeight * 0.45,
      backgroundColor: "#E5E7EB",
      position: "relative" as const,
    },
    mapBackground: {
      flex: 1,
      backgroundColor: "#F3F4F6",
      position: "relative" as const,
    },
    road: {
      position: "absolute" as const,
      backgroundColor: "#D1D5DB",
    },
    roadHorizontal1: {
      height: 4,
      width: "100%",
      top: "30%",
    },
    roadHorizontal2: {
      height: 4,
      width: "100%",
      top: "65%",
    },
    roadVertical1: {
      width: 4,
      height: "100%",
      left: "30%",
    },
    roadVertical2: {
      width: 4,
      height: "100%",
      left: "75%",
    },
    mapElement: {
      position: "absolute" as const,
      alignItems: "center",
    },
    parkIcon: {
      backgroundColor: "#059669",
      borderRadius: 15,
      width: 30,
      height: 30,
      alignItems: "center",
      justifyContent: "center",
    },
    parkIconText: {
      fontSize: 16,
    },
    mallIcon: {
      backgroundColor: "#DC2626",
      borderRadius: 15,
      width: 30,
      height: 30,
      alignItems: "center",
      justifyContent: "center",
    },
    mallIconText: {
      fontSize: 16,
    },
    mapLabel: {
      fontSize: 10,
      fontWeight: "600" as const,
      color: "#374151",
      marginTop: 4,
      backgroundColor: "white",
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
    },
    busStop: {
      position: "absolute" as const,
    },
    busStopIcon: {
      width: 12,
      height: 12,
      backgroundColor: "#1E293B",
      borderRadius: 6,
      borderWidth: 3,
      borderColor: "white",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    currentLocation: {
      position: "absolute" as const,
      top: "50%",
      left: "45%",
      alignItems: "center",
      justifyContent: "center",
    },
    currentLocationDot: {
      width: 12,
      height: 12,
      backgroundColor: "#3B82F6",
      borderRadius: 6,
      borderWidth: 3,
      borderColor: "white",
      zIndex: 2,
    },
    currentLocationRing: {
      position: "absolute" as const,
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      borderWidth: 2,
      borderColor: "#3B82F6",
    },
    locationButton: {
      position: "absolute" as const,
      bottom: 80,
      right: 20,
      backgroundColor: "white",
      width: 50,
      height: 50,
      borderRadius: 25,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
    locationButtonText: {
      fontSize: 20,
    },
    zoomButton: {
      position: "absolute" as const,
      bottom: 20,
      right: 20,
      backgroundColor: "white",
      width: 50,
      height: 50,
      borderRadius: 25,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
    zoomButtonText: {
      fontSize: 18,
    },
    bottomSheet: {
      backgroundColor: "white",
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      flex: 1,
      paddingTop: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 8,
    },
    bottomSheetHandle: {
      width: 40,
      height: 4,
      backgroundColor: "#D1D5DB",
      borderRadius: 2,
      alignSelf: "center" as const,
      marginBottom: 20,
    },
    categoryTabs: {
      flexDirection: "row" as const,
      backgroundColor: "#F1F5F9",
      marginHorizontal: 20,
      borderRadius: 12,
      padding: 4,
      marginBottom: 20,
    },
    categoryTab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: "center",
      borderRadius: 8,
    },
    activeCategoryTab: {
      backgroundColor: "#1E293B",
      shadowColor: "#1E293B",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    categoryTabText: {
      fontSize: 14,
      fontWeight: "600" as const,
      color: "#64748B",
    },
    activeCategoryTabText: {
      color: "white",
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700" as const,
      color: "#1F2937",
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    contentContainer: {
      paddingHorizontal: 20,
    },
    stopCard: {
      backgroundColor: "white",
      borderRadius: 16,
      marginBottom: 16,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 6,
      borderWidth: 1,
      borderColor: "#E2E8F0",
    },
    stopHeader: {
      flexDirection: "row" as const,
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    stopInfo: {
      flex: 1,
    },
    stopName: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: "#1F2937",
      marginBottom: 4,
    },
    stopDistance: {
      fontSize: 14,
      color: "#64748B",
    },
    nextBusContainer: {
      alignItems: "flex-end",
    },
    nextBusLabel: {
      fontSize: 12,
      color: "#64748B",
      marginBottom: 2,
    },
    nextBusTime: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: "#059669",
    },
    routesContainer: {
      marginBottom: 12,
    },
    routesLabel: {
      fontSize: 14,
      color: "#64748B",
      marginBottom: 8,
    },
    routesList: {
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
    },
    routeTag: {
      backgroundColor: "#F1F5F9",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      marginRight: 8,
      marginBottom: 4,
      borderWidth: 1,
      borderColor: "#E2E8F0",
    },
    routeTagText: {
      fontSize: 12,
      color: "#475569",
      fontWeight: "600" as const,
    },
    fareContainer: {
      flexDirection: "row" as const,
      alignItems: "center",
      justifyContent: "space-between",
    },
    fareLabel: {
      fontSize: 14,
      color: "#64748B",
    },
    fareAmount: {
      fontSize: 18,
      fontWeight: "700" as const,
      color: "#1E293B",
    },
    routeCard: {
      backgroundColor: "white",
      borderRadius: 16,
      marginBottom: 16,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 6,
      borderWidth: 1,
      borderColor: "#E2E8F0",
    },
    routeHeader: {
      flexDirection: "row" as const,
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 16,
    },
    routeName: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: "#1F2937",
      flex: 1,
      marginRight: 12,
    },
    availabilityBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    availabilityText: {
      fontSize: 12,
      fontWeight: "700" as const,
      color: "white",
    },
    routeDetails: {
      marginBottom: 16,
    },
    routePath: {
      flexDirection: "row" as const,
      alignItems: "center",
      marginBottom: 16,
    },
    cityText: {
      fontSize: 16,
      fontWeight: "600" as const,
      color: "#1F2937",
      flex: 1,
      textAlign: "center" as const,
    },
    routeLineContainer: {
      flexDirection: "row" as const,
      alignItems: "center",
      marginHorizontal: 16,
    },
    routeLine: {
      height: 2,
      backgroundColor: "#1E293B",
      width: 30,
    },
    busIcon: {
      fontSize: 16,
      marginHorizontal: 8,
    },
    routeInfo: {
      flexDirection: "row" as const,
      justifyContent: "space-between",
    },
    infoItem: {
      alignItems: "center",
    },
    infoLabel: {
      fontSize: 12,
      color: "#64748B",
      marginBottom: 4,
    },
    infoValue: {
      fontSize: 14,
      fontWeight: "600" as const,
      color: "#1F2937",
    },
    routeFooter: {
      flexDirection: "row" as const,
      justifyContent: "space-between",
      alignItems: "center",
    },
    routeFare: {
      fontSize: 24,
      fontWeight: "700" as const,
      color: "#059669",
    },
    bookButton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
    },
    bookButtonText: {
      color: "white",
      fontSize: 14,
      fontWeight: "700" as const,
    },
  };

  return (
    <View style={styles.container}>
      {/* Header with Search */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter Bus Route"
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Text style={styles.notificationIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Map Section */}
      <MapView />

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.bottomSheetHandle} />

        {/* Category Tabs */}
        <View style={styles.categoryTabs}>
          <TouchableOpacity
            style={[
              styles.categoryTab,
              selectedCategory === "stops" && styles.activeCategoryTab,
            ]}
            onPress={() => setSelectedCategory("stops")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.categoryTabText,
                selectedCategory === "stops" && styles.activeCategoryTabText,
              ]}
            >
              Nearby Stops
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.categoryTab,
              selectedCategory === "routes" && styles.activeCategoryTab,
            ]}
            onPress={() => setSelectedCategory("routes")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.categoryTabText,
                selectedCategory === "routes" && styles.activeCategoryTabText,
              ]}
            >
              Available Routes
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>
          {selectedCategory === "stops" ? "Nearby Stops" : "Available Routes"}
        </Text>

        {/* Content */}
        <ScrollView
          style={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {selectedCategory === "stops" &&
            nearbyStops.map((stop, index) => (
              <BusStopCard key={stop.id} stop={stop} index={index} />
            ))}

          {selectedCategory === "routes" &&
            busRoutes.map((route, index) => (
              <RouteCard key={route.id} route={route} index={index} />
            ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

export default Home;
