import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";

const WebViewScreen = ({ route, navigation }) => {
  const { url, title } = route.params;
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* WebView Container */}
      <View style={styles.webViewContainer}>
        {loading && (
          <ActivityIndicator
            size="large"
            color="#00ff00"
            style={styles.loadingIndicator}
          />
        )}
        <WebView
          source={{ uri: url }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          style={styles.webView}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    backgroundColor: "#6200EE",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    elevation: 4,
  },
  backButton: {
    padding: 5,
    marginRight: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  webView: {
    flex: 1,
  },
  loadingIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
});

export default WebViewScreen;
