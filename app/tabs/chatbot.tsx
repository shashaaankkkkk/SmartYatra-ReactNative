import React, { useState, useRef, useEffect } from "react";

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

const Chatbot: React.FC = () => {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies: QuickReply[] = [
    { id: "1", text: "🔍 Search buses", action: "search_buses" },
    { id: "2", text: "🎫 Book tickets", action: "book_tickets" },
    { id: "3", text: "📋 My bookings", action: "my_bookings" },
    { id: "4", text: "💰 Check prices", action: "check_prices" },
    { id: "5", text: "🕒 Bus schedules", action: "bus_schedules" },
    { id: "6", text: "❓ Help & Support", action: "help_support" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
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

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column" as const,
      height: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      maxWidth: "400px",
      margin: "0 auto",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    },
    header: {
      background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
      color: "white",
      padding: "20px",
      borderRadius: "0 0 25px 25px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    },
    headerContent: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    avatar: {
      width: "45px",
      height: "45px",
      background: "rgba(255,255,255,0.2)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
      backdropFilter: "blur(10px)",
    },
    headerText: {
      flex: 1,
    },
    title: {
      fontSize: "18px",
      fontWeight: "700",
      margin: "0 0 4px 0",
    },
    status: {
      fontSize: "13px",
      color: "#a8d0f0",
      margin: 0,
    },
    messagesContainer: {
      flex: 1,
      overflowY: "auto" as const,
      padding: "20px",
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(10px)",
    },
    messageWrapper: {
      display: "flex",
      marginBottom: "16px",
      animation: "slideInUp 0.3s ease-out",
    },
    messageWrapperBot: {
      justifyContent: "flex-start",
    },
    messageWrapperUser: {
      justifyContent: "flex-end",
    },
    messageBubble: {
      maxWidth: "80%",
      padding: "12px 16px",
      borderRadius: "20px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      position: "relative" as const,
    },
    messageBubbleBot: {
      background: "white",
      color: "#333",
      borderBottomLeftRadius: "8px",
      border: "1px solid #e1e5e9",
    },
    messageBubbleUser: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      borderBottomRightRadius: "8px",
    },
    messageText: {
      fontSize: "14px",
      lineHeight: "1.5",
      whiteSpace: "pre-line" as const,
      margin: 0,
    },
    timestamp: {
      fontSize: "11px",
      marginTop: "6px",
      opacity: 0.7,
    },
    typingIndicator: {
      display: "flex",
      justifyContent: "flex-start",
      marginBottom: "16px",
      animation: "slideInUp 0.3s ease-out",
    },
    typingBubble: {
      background: "white",
      borderRadius: "20px",
      borderBottomLeftRadius: "8px",
      padding: "12px 16px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      border: "1px solid #e1e5e9",
    },
    typingDots: {
      display: "flex",
      gap: "4px",
    },
    dot: {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      backgroundColor: "#999",
      animation: "bounce 1.4s infinite ease-in-out",
    },
    quickRepliesContainer: {
      padding: "15px 20px",
      background: "rgba(255,255,255,0.9)",
    },
    quickReplies: {
      display: "flex",
      flexWrap: "wrap" as const,
      gap: "8px",
    },
    quickReplyButton: {
      background: "white",
      border: "2px solid #e1e5e9",
      borderRadius: "20px",
      padding: "8px 14px",
      fontSize: "13px",
      color: "#555",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    },
    inputArea: {
      padding: "20px",
      background: "white",
      borderRadius: "25px 25px 0 0",
    },
    inputContainer: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      background: "#f8f9fa",
      borderRadius: "25px",
      padding: "4px",
      border: "2px solid #e1e5e9",
      transition: "all 0.3s ease",
    },
    input: {
      flex: 1,
      border: "none",
      outline: "none",
      background: "transparent",
      padding: "12px 16px",
      fontSize: "14px",
      borderRadius: "25px",
    },
    sendButton: {
      width: "44px",
      height: "44px",
      borderRadius: "50%",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.3s ease",
      fontSize: "18px",
    },
    sendButtonActive: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
      transform: "scale(1)",
    },
    sendButtonInactive: {
      background: "#e1e5e9",
      color: "#999",
      cursor: "not-allowed",
    },
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0);
            }
            40% {
              transform: scale(1);
            }
          }
          
          .dot:nth-child(1) { animation-delay: -0.32s; }
          .dot:nth-child(2) { animation-delay: -0.16s; }
          .dot:nth-child(3) { animation-delay: 0s; }
          
          .quick-reply-btn:hover {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
            border-color: transparent !important;
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3) !important;
          }
          
          .input-focused {
            border-color: #667eea !important;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
          }
          
          .send-btn:hover {
            transform: scale(1.05) !important;
          }
          
          .send-btn:active {
            transform: scale(0.95) !important;
          }
        `}
      </style>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.avatar}>🚌</div>
          <div style={styles.headerText}>
            <h1 style={styles.title}>BusBot Assistant</h1>
            <p style={styles.status}>● Online • Ready to help</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={styles.messagesContainer}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              ...styles.messageWrapper,
              ...(message.isBot
                ? styles.messageWrapperBot
                : styles.messageWrapperUser),
            }}
          >
            <div
              style={{
                ...styles.messageBubble,
                ...(message.isBot
                  ? styles.messageBubbleBot
                  : styles.messageBubbleUser),
              }}
            >
              <p style={styles.messageText}>{message.text}</p>
              <div style={styles.timestamp}>
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div style={styles.typingIndicator}>
            <div style={styles.typingBubble}>
              <div style={styles.typingDots}>
                <div style={styles.dot} className="dot"></div>
                <div style={styles.dot} className="dot"></div>
                <div style={styles.dot} className="dot"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div style={styles.quickRepliesContainer}>
        <div style={styles.quickReplies}>
          {quickReplies.map((reply) => (
            <button
              key={reply.id}
              onClick={() => handleQuickReply(reply)}
              style={styles.quickReplyButton}
              className="quick-reply-btn"
            >
              {reply.text}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div style={styles.inputArea}>
        <div
          style={styles.inputContainer}
          className={inputText ? "input-focused" : ""}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && handleSendMessage(inputText)
            }
            placeholder="Type your message..."
            style={styles.input}
          />
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim()}
            style={{
              ...styles.sendButton,
              ...(inputText.trim()
                ? styles.sendButtonActive
                : styles.sendButtonInactive),
            }}
            className="send-btn"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
