import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
  Modal,
} from "react-native";

interface Ticket {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  busNumber: string;
  busType: string;
  seatNumbers: string[];
  totalAmount: number;
  status: "active" | "used" | "cancelled";
  bookingDate: string;
  passengerName: string;
  phoneNumber: string;
}

interface BusPass {
  id: string;
  passType: string;
  balance: number;
  expiryDate: string;
  lastUsed: string;
  totalTrips: number;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

const TicketsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [showPassModal, setShowPassModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Dummy data for Punjab bus routes
  const activeTickets: Ticket[] = [
    {
      id: "1",
      from: "Chandigarh",
      to: "Amritsar",
      date: "2024-09-26",
      time: "08:30 AM",
      busNumber: "PB 02 AC 1234",
      busType: "AC Sleeper",
      seatNumbers: ["A1", "A2"],
      totalAmount: 1200,
      status: "active",
      bookingDate: "2024-09-24",
      passengerName: "Rajesh Kumar",
      phoneNumber: "+91 98765 43210",
    },
    {
      id: "2",
      from: "Ludhiana",
      to: "Jalandhar",
      date: "2024-09-27",
      time: "02:15 PM",
      busNumber: "PB 03 BZ 5678",
      busType: "AC Semi-Sleeper",
      seatNumbers: ["B5"],
      totalAmount: 450,
      status: "active",
      bookingDate: "2024-09-25",
      passengerName: "Rajesh Kumar",
      phoneNumber: "+91 98765 43210",
    },
  ];

  const ticketHistory: Ticket[] = [
    {
      id: "3",
      from: "Patiala",
      to: "Chandigarh",
      date: "2024-09-20",
      time: "06:00 AM",
      busNumber: "PB 01 CD 9876",
      busType: "Non-AC",
      seatNumbers: ["C10"],
      totalAmount: 180,
      status: "used",
      bookingDate: "2024-09-18",
      passengerName: "Rajesh Kumar",
      phoneNumber: "+91 98765 43210",
    },
    {
      id: "4",
      from: "Bathinda",
      to: "Moga",
      date: "2024-09-15",
      time: "11:45 AM",
      busNumber: "PB 04 EF 3456",
      busType: "AC Bus",
      seatNumbers: ["D3", "D4"],
      totalAmount: 680,
      status: "used",
      bookingDate: "2024-09-13",
      passengerName: "Rajesh Kumar",
      phoneNumber: "+91 98765 43210",
    },
    {
      id: "5",
      from: "Mohali",
      to: "Kapurthala",
      date: "2024-09-10",
      time: "04:30 PM",
      busNumber: "PB 05 GH 7890",
      busType: "Deluxe",
      seatNumbers: ["E7"],
      totalAmount: 320,
      status: "cancelled",
      bookingDate: "2024-09-08",
      passengerName: "Rajesh Kumar",
      phoneNumber: "+91 98765 43210",
    },
    {
      id: "6",
      from: "Hoshiarpur",
      to: "Gurdaspur",
      date: "2024-09-05",
      time: "09:15 AM",
      busNumber: "PB 06 IJ 2468",
      busType: "AC Sleeper",
      seatNumbers: ["F2"],
      totalAmount: 890,
      status: "used",
      bookingDate: "2024-09-03",
      passengerName: "Rajesh Kumar",
      phoneNumber: "+91 98765 43210",
    },
  ];

  const busPass: BusPass = {
    id: "PASS001",
    passType: "Monthly Pass",
    balance: 2450,
    expiryDate: "2024-10-25",
    lastUsed: "2024-09-22",
    totalTrips: 18,
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeTab]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#059669";
      case "used":
        return "#6B7280";
      case "cancelled":
        return "#DC2626";
      default:
        return "#6B7280";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "used":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getResponsiveWidth = () => {
    if (isWeb) {
      return Math.min(screenWidth, 600); // Max width of 600px on web
    }
    return screenWidth;
  };

  const getContentPadding = () => {
    if (isWeb && screenWidth > 600) {
      return (screenWidth - 600) / 2; // Center content on larger screens
    }
    return 0;
  };

  const TicketCard: React.FC<{ ticket: Ticket; index: number }> = ({
    ticket,
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
          styles.ticketCard,
          {
            opacity: cardAnim,
            transform: [
              {
                translateY: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.ticketHeader}>
          <View style={styles.routeContainer}>
            <Text style={styles.cityText}>{ticket.from}</Text>
            <View style={styles.routeLineContainer}>
              <View style={styles.routeLine} />
              <Text style={styles.busIcon}>🚌</Text>
              <View style={styles.routeLine} />
            </View>
            <Text style={styles.cityText}>{ticket.to}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(ticket.status) },
            ]}
          >
            <Text style={styles.statusText}>
              {getStatusText(ticket.status)}
            </Text>
          </View>
        </View>

        <View style={styles.ticketDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date & Time</Text>
            <Text style={styles.detailValue}>
              {formatDate(ticket.date)} • {ticket.time}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Bus Number</Text>
            <Text style={styles.detailValue}>{ticket.busNumber}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Bus Type</Text>
            <Text style={styles.detailValue}>{ticket.busType}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Seats</Text>
            <Text style={styles.detailValue}>
              {ticket.seatNumbers.join(", ")}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Amount</Text>
            <Text style={styles.amountText}>₹{ticket.totalAmount}</Text>
          </View>
        </View>

        <View style={styles.ticketFooter}>
          <Text style={styles.bookingIdText}>Booking ID: #{ticket.id}</Text>
          <Text style={styles.bookingDateText}>
            Booked on {formatDate(ticket.bookingDate)}
          </Text>
        </View>
      </Animated.View>
    );
  };

  const BusPassCard: React.FC = () => {
    const passAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.spring(passAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.passCard,
          {
            opacity: passAnim,
            transform: [
              {
                scale: passAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.passHeader}>
          <Text style={styles.passTitle}>🎫 {busPass.passType}</Text>
          <Text style={styles.passBalance}>₹{busPass.balance}</Text>
        </View>
        <View style={styles.passDetails}>
          <View style={styles.passDetailRow}>
            <Text style={styles.passDetailLabel}>Expires</Text>
            <Text style={styles.passDetailValue}>
              {formatDate(busPass.expiryDate)}
            </Text>
          </View>
          <View style={styles.passDetailRow}>
            <Text style={styles.passDetailLabel}>Trips Used</Text>
            <Text style={styles.passDetailValue}>{busPass.totalTrips}</Text>
          </View>
          <View style={styles.passDetailRow}>
            <Text style={styles.passDetailLabel}>Last Used</Text>
            <Text style={styles.passDetailValue}>
              {formatDate(busPass.lastUsed)}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.rechargeButton} activeOpacity={0.8}>
          <Text style={styles.rechargeButtonText}>💳 Recharge Pass</Text>
        </TouchableOpacity>
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
      paddingHorizontal: 20,
      paddingVertical: 15,
      paddingTop: Platform.OS === "ios" ? 50 : 30,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "700" as const,
      color: "white",
      textAlign: "center" as const,
    },
    buyPassButton: {
      position: "absolute" as const,
      right: 20,
      top: Platform.OS === "ios" ? 50 : 30,
      backgroundColor: "#475569",
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    buyPassText: {
      color: "white",
      fontSize: 12,
      fontWeight: "600" as const,
    },
    tabContainer: {
      flexDirection: "row" as const,
      backgroundColor: "white",
      marginHorizontal: 20,
      marginTop: 20,
      borderRadius: 12,
      padding: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      borderWidth: 1,
      borderColor: "#E2E8F0",
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: "center",
      borderRadius: 8,
    },
    activeTab: {
      backgroundColor: "#1E293B",
      shadowColor: "#1E293B",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    tabText: {
      fontSize: 14,
      fontWeight: "600" as const,
      color: "#64748B",
    },
    activeTabText: {
      color: "white",
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    passCard: {
      backgroundColor: "#1E293B",
      marginBottom: 20,
      borderRadius: 16,
      padding: 24,
      shadowColor: "#1E293B",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 12,
      borderWidth: 1,
      borderColor: "#334155",
    },
    passHeader: {
      flexDirection: "row" as const,
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    passTitle: {
      fontSize: 18,
      fontWeight: "700" as const,
      color: "white",
    },
    passBalance: {
      fontSize: 28,
      fontWeight: "800" as const,
      color: "#10B981",
    },
    passDetails: {
      marginBottom: 20,
    },
    passDetailRow: {
      flexDirection: "row" as const,
      justifyContent: "space-between",
      marginBottom: 12,
    },
    passDetailLabel: {
      fontSize: 14,
      color: "#94A3B8",
    },
    passDetailValue: {
      fontSize: 14,
      fontWeight: "600" as const,
      color: "white",
    },
    rechargeButton: {
      backgroundColor: "#059669",
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
      shadowColor: "#059669",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    rechargeButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "700" as const,
    },
    ticketCard: {
      backgroundColor: "white",
      borderRadius: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 6,
      overflow: "hidden" as const,
      borderWidth: 1,
      borderColor: "#E2E8F0",
    },
    ticketHeader: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#F1F5F9",
    },
    routeContainer: {
      flexDirection: "row" as const,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    cityText: {
      fontSize: 18,
      fontWeight: "700" as const,
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
    statusBadge: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      alignSelf: "center" as const,
    },
    statusText: {
      color: "white",
      fontSize: 12,
      fontWeight: "700" as const,
    },
    ticketDetails: {
      padding: 20,
    },
    detailRow: {
      flexDirection: "row" as const,
      justifyContent: "space-between",
      marginBottom: 14,
    },
    detailLabel: {
      fontSize: 14,
      color: "#64748B",
      fontWeight: "500" as const,
    },
    detailValue: {
      fontSize: 14,
      fontWeight: "600" as const,
      color: "#1F2937",
    },
    amountText: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: "#059669",
    },
    ticketFooter: {
      backgroundColor: "#F8FAFC",
      padding: 20,
      flexDirection: "row" as const,
      justifyContent: "space-between",
    },
    bookingIdText: {
      fontSize: 12,
      color: "#475569",
      fontWeight: "600" as const,
    },
    bookingDateText: {
      fontSize: 12,
      color: "#64748B",
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 60,
    },
    emptyStateText: {
      fontSize: 16,
      color: "#64748B",
      textAlign: "center" as const,
      marginTop: 12,
      fontWeight: "500" as const,
    },
    emptyStateEmoji: {
      fontSize: 48,
    },
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tickets</Text>
        <TouchableOpacity
          style={styles.buyPassButton}
          onPress={() => setShowPassModal(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.buyPassText}>🎫 Buy Pass</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "active" && styles.activeTab]}
          onPress={() => setActiveTab("active")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "active" && styles.activeTabText,
            ]}
          >
            Active Tickets
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "history" && styles.activeTab]}
          onPress={() => setActiveTab("history")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "history" && styles.activeTabText,
            ]}
          >
            History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Bus Pass Card - only show in active tab */}
        {activeTab === "active" && <BusPassCard />}

        {/* Tickets List */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          }}
        >
          {activeTab === "active" && activeTickets.length > 0 && (
            <>
              {activeTickets.map((ticket, index) => (
                <TicketCard key={ticket.id} ticket={ticket} index={index} />
              ))}
            </>
          )}

          {activeTab === "history" && ticketHistory.length > 0 && (
            <>
              {ticketHistory.map((ticket, index) => (
                <TicketCard key={ticket.id} ticket={ticket} index={index} />
              ))}
            </>
          )}

          {((activeTab === "active" && activeTickets.length === 0) ||
            (activeTab === "history" && ticketHistory.length === 0)) && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateEmoji}>📋</Text>
              <Text style={styles.emptyStateText}>
                {activeTab === "active"
                  ? "No active tickets found"
                  : "No ticket history found"}
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default TicketsPage;

