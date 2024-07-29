import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ImageBackground, ActivityIndicator } from "react-native";
import axios from "axios";
import { QUOTES_API } from "../core/config";

const TravelQuote = () => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuote = async () => {
    setLoading(true);
    try {
        const response = await axios.get("https://api.api-ninjas.com/v1/quotes?category=happiness", {
            headers: { "X-Api-Key": QUOTES_API },
          });
    
      if (response.data && response.data.length > 0) {
        setQuote(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();

    const interval = setInterval(() => {
      fetchQuote();
    }, 600000); // 10 minutes in milliseconds

    return () => clearInterval(interval);
  }, []);

  return (
    <ImageBackground
      source={require('../assets/quote_background.png')}
      style={styles.background}
      imageStyle={{ borderRadius: 10 }}
    >
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>"{quote?.quote}"</Text>
          <Text style={styles.authorText}>- {quote?.author}</Text>
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
    background: {
        width: 350,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: 20,
        marginHorizontal: '9%',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
  quoteContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  quoteText: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
    marginBottom: 10,
    fontStyle: 'italic',
  },
  authorText: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
  },
});

export default TravelQuote;
