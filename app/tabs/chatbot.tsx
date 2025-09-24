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
} from "react-native";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface QuickReply {
  id: string;
  text: string;
  action: string;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const BusTicketingChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "👋 Hello! I'm BusBot, your travel assistant. How can I help you with your bus journey today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const quickReplies: QuickReply[] = [
    { id: "1", text: "🔍 Search buses", action: "search_buses" },
    { id: "2", text: "🎫 Book tickets", action: "book_tickets" },
    { id: "3", text: "📋 My bookings", action: "my_bookings" },
    { id: "4", text: "💰 Check prices", action: "check_prices" },
    { id: "5", text: "🕒 Bus schedules", action: "bus_schedules" },
    { id: "6", text: "❓ Help & Support", action: "help_support" },
  ];

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
    // Animate new message
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (
      lowerMessage.includes("search") ||
      lowerMessage.includes("find") ||
      lowerMessage.includes("bus")
    ) {
      return "🚌 I can help you search for buses! Please provide:\n• Departure city\n• Destination city\n• Travel date\n\nExample: 'Find buses from Mumbai to Pune on Dec 25'";
    }

    if (lowerMessage.includes("book") || lowerMessage.includes("ticket")) {
      return "🎫 Ready to book your tickets! I'll need:\n• Your preferred bus\n• Number of passengers\n• Seat preferences\n\nShall we start with searching available buses first?";
    }

    if (
      lowerMessage.includes("price") ||
      lowerMessage.includes("cost") ||
      lowerMessage.includes("fare")
    ) {
      return "💰 Bus fares vary by route and bus type:\n• AC Sleeper: ₹800-1500\n• AC Semi-Sleeper: ₹600-1200\n• Non-AC: ₹400-800\n\nTell me your route for exact pricing!";
    }

    if (
      lowerMessage.includes("schedule") ||
      lowerMessage.includes("time") ||
      lowerMessage.includes("timing")
    ) {
      return "🕒 Bus schedules available 24/7:\n• Morning: 6:00 AM - 11:00 AM\n• Afternoon: 12:00 PM - 5:00 PM\n• Evening: 6:00 PM - 10:00 PM\n• Night: 11:00 PM - 5:00 AM\n\nWhich route interests you?";
    }

    if (
      lowerMessage.includes("booking") ||
      lowerMessage.includes("reservation")
    ) {
      return "📋 To check your bookings, I'll need:\n• Booking reference number\n• Mobile number used for booking\n\nYou can also login to your account to view all bookings.";
    }

    if (
      lowerMessage.includes("help") ||
      lowerMessage.includes("support") ||
      lowerMessage.includes("problem")
    ) {
      return "❓ I'm here to help! Common topics:\n• Booking issues\n• Payment problems\n• Cancellation & refunds\n• Schedule changes\n\nWhat specific help do you need?";
    }

    return "I understand you're asking about bus travel. Could you please be more specific? You can:\n• Search for buses\n• Book tickets\n• Check schedules\n• View bookings\n\nWhat would you like to do?";
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateBotResponse(text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (reply: QuickReply) => {
    handleSendMessage(reply.text);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const TypingIndicator = () => {
    const dot1 = useRef(new Animated.Value(0.3)).current;
    const dot2 = useRef(new Animated.Value(0.3)).current;
    const dot3 = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
      const animate = () => {
        Animated.sequence([
          Animated.timing(dot1, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot1, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();

        setTimeout(() => {
          Animated.sequence([
            Animated.timing(dot2, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot2, {
              toValue: 0.3,
              duration: 400,
              useNativeDriver: true,
            }),
          ]).start();
        }, 200);

        setTimeout(() => {
          Animated.sequence([
            Animated.timing(dot3, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot3, {
              toValue: 0.3,
              duration: 400,
              useNativeDriver: true,
            }),
          ]).start();
        }, 400);
      };

      const interval = setInterval(animate, 1200);
      return () => clearInterval(interval);
    }, []);

    return (
      <View style={styles.typingContainer}>
        <View style={styles.typingBubble}>
          <View style={styles.typingDots}>
            <Animated.View style={[styles.typingDot, { opacity: dot1 }]} />
            <Animated.View style={[styles.typingDot, { opacity: dot2 }]} />
            <Animated.View style={[styles.typingDot, { opacity: dot3 }]} />
          </View>
        </View>
      </View>
    );
  };

  const styles = {
    container: {
      flex: 1,
      backgroundColor: "#667eea",
      width: screenWidth,
    },
    gradientBackground: {
      flex: 1,
      backgroundColor: "#667eea",
    },
    header: {
      backgroundColor: "#1e3c72",
      paddingHorizontal: 20,
      paddingVertical: 15,
      paddingTop: Platform.OS === "ios" ? 50 : 30,
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    headerContent: {
      flexDirection: "row" as const,
      alignItems: "center",
    },
    avatar: {
      width: 45,
      height: 45,
      backgroundColor: "rgba(255,255,255,0.2)",
      borderRadius: 22.5,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    avatarText: {
      fontSize: 20,
    },
    headerTextContainer: {
      flex: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: "700" as const,
      color: "white",
      marginBottom: 2,
    },
    status: {
      fontSize: 13,
      color: "#a8d0f0",
    },
    messagesContainer: {
      flex: 1,
      backgroundColor: "rgba(255,255,255,0.95)",
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    messageRow: {
      marginBottom: 16,
      width: "100%",
    },
    messageRowBot: {
      alignItems: "flex-start" as const,
    },
    messageRowUser: {
      alignItems: "flex-end" as const,
    },
    messageBubble: {
      maxWidth: "80%",
      padding: 12,
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    messageBubbleBot: {
      backgroundColor: "white",
      borderBottomLeftRadius: 8,
      borderWidth: 1,
      borderColor: "#e1e5e9",
    },
    messageBubbleUser: {
      backgroundColor: "#667eea",
      borderBottomRightRadius: 8,
    },
    messageText: {
      fontSize: 14,
      lineHeight: 20,
    },
    messageTextBot: {
      color: "#333",
    },
    messageTextUser: {
      color: "white",
    },
    timestamp: {
      fontSize: 11,
      marginTop: 6,
      opacity: 0.7,
    },
    timestampBot: {
      color: "#666",
    },
    timestampUser: {
      color: "rgba(255,255,255,0.8)",
    },
    typingContainer: {
      alignItems: "flex-start" as const,
      marginBottom: 16,
    },
    typingBubble: {
      backgroundColor: "white",
      borderRadius: 20,
      borderBottomLeftRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: "#e1e5e9",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    typingDots: {
      flexDirection: "row" as const,
    },
    typingDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#999",
      marginHorizontal: 2,
    },
    quickRepliesContainer: {
      backgroundColor: "rgba(255,255,255,0.9)",
      paddingHorizontal: 20,
      paddingVertical: 15,
    },
    quickReplies: {
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
    },
    quickReplyButton: {
      backgroundColor: "white",
      borderWidth: 2,
      borderColor: "#e1e5e9",
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 8,
      marginRight: 8,
      marginBottom: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    quickReplyText: {
      fontSize: 13,
      color: "#555",
    },
    inputArea: {
      backgroundColor: "white",
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    },
    inputContainer: {
      flexDirection: "row" as const,
      alignItems: "center",
      backgroundColor: "#f8f9fa",
      borderRadius: 25,
      borderWidth: 2,
      borderColor: "#e1e5e9",
      paddingHorizontal: 4,
    },
    input: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 14,
      color: "#333",
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
    },
    sendButtonActive: {
      backgroundColor: "#667eea",
      shadowColor: "#667eea",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    sendButtonInactive: {
      backgroundColor: "#e1e5e9",
    },
    sendButtonText: {
      fontSize: 18,
      fontWeight: "bold" as const,
    },
    sendButtonTextActive: {
      color: "white",
    },
    sendButtonTextInactive: {
      color: "#999",
    },
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🚌</Text>
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>BusBot Assistant</Text>
            <Text style={styles.status}>● Online • Ready to help</Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {messages.map((message) => (
          <Animated.View
            key={message.id}
            style={[
              styles.messageRow,
              message.isBot ? styles.messageRowBot : styles.messageRowUser,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                message.isBot
                  ? styles.messageBubbleBot
                  : styles.messageBubbleUser,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.isBot
                    ? styles.messageTextBot
                    : styles.messageTextUser,
                ]}
              >
                {message.text}
              </Text>
              <Text
                style={[
                  styles.timestamp,
                  message.isBot ? styles.timestampBot : styles.timestampUser,
                ]}
              >
                {formatTime(message.timestamp)}
              </Text>
            </View>
          </Animated.View>
        ))}

        {/* Typing Indicator */}
        {isTyping && <TypingIndicator />}
      </ScrollView>

      {/* Quick Replies */}
      <View style={styles.quickRepliesContainer}>
        <View style={styles.quickReplies}>
          {quickReplies.map((reply) => (
            <TouchableOpacity
              key={reply.id}
              onPress={() => handleQuickReply(reply)}
              style={styles.quickReplyButton}
              activeOpacity={0.7}
            >
              <Text style={styles.quickReplyText}>{reply.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Input Area */}
      <View style={styles.inputArea}>
        <View style={styles.inputContainer}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSendMessage(inputText)}
            placeholder="Type your message..."
            placeholderTextColor="#999"
            style={styles.input}
            multiline={false}
            returnKeyType="send"
          />
          <TouchableOpacity
            onPress={() => handleSendMessage(inputText)}
            disabled={!inputText.trim()}
            style={[
              styles.sendButton,
              inputText.trim()
                ? styles.sendButtonActive
                : styles.sendButtonInactive,
            ]}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.sendButtonText,
                inputText.trim()
                  ? styles.sendButtonTextActive
                  : styles.sendButtonTextInactive,
              ]}
            >
              ➤
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default BusTicketingChatbot;
