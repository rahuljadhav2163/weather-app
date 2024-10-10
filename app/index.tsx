import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet, SafeAreaView, TouchableOpacity, ImageBackground, Modal, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import axios from 'axios';

export default function Index() {
  const [modalVisibility, setModalVisibility] = useState(false);
  const [city, setCity] = useState('Pune');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false); 
  
  const loadWeather = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=db37138b8bb5b173c89f46518dfd2de6&units=metric`);
      setResponse(data);
      setModalVisibility(true);
    } catch (error: any) {
      let errorMessage = 'Something went wrong. Please try again later.';

      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'City not found. Please enter a valid city name.';
        } else {
          errorMessage = `Error: ${error.response.data.message}`;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else {
        errorMessage = error.message;
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1600&q=80' }}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
          style={styles.container}
        >
          <BlurView intensity={20} style={styles.card}>
            <Text style={styles.title}>Weather Finder</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter city name"
                placeholderTextColor="gray"
                style={styles.input}
                onChangeText={(text) => setCity(text)}
              />

              {/* Show the Activity Indicator when loading */}
              {loading ? (
                <ActivityIndicator size="large" color="#FF5E62" />
              ) : (
                <TouchableOpacity onPress={loadWeather} style={styles.searchButton}>
                  <LinearGradient
                    colors={['#FF9966', '#FF5E62']}
                    style={styles.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.searchButtonText}>Get Report</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </BlurView>
        </LinearGradient>

        <Modal visible={modalVisibility} animationType="slide">
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1600&q=80' }}
            style={styles.modalBackground}
          >
            <BlurView intensity={30} style={styles.modalContent}>
              <Text style={styles.modalTitle}>Weather Report</Text>

              {response ? (
                <View style={styles.weatherInfo}>
                  <Text style={styles.cityText}>{response.name}, {response.sys.country}</Text>
                  <Text style={styles.temperatureText}>{response.main.temp}°C</Text>
                  <Text style={styles.weatherDescription}>{response.weather[0].description}</Text>
                  <Text style={styles.humidityText}>Humidity: {response.main.humidity}%</Text>
                  <Text style={styles.windText}>Wind Speed: {response.wind.speed} m/s</Text>
                </View>
              ) : null}

              <TouchableOpacity
                onPress={() => setModalVisibility(false)}
                style={styles.closeButton}
              >
                <LinearGradient
                  colors={['#FF9966', '#FF5E62']}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </LinearGradient>
              </TouchableOpacity>
            </BlurView>
          </ImageBackground>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderRadius: 25,
    padding: 30,
    width: '100%',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: "rgba(230, 240, 255, 0.7)",
  },
  title: {
    fontSize: 36,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 30,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    padding: 20,
    fontSize: 22,
    marginBottom: 20,
    color: '#333',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  searchButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  gradient: {
    padding: 20,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    resizeMode: 'cover',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  modalTitle: {
    fontSize: 36,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 30,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  weatherInfo: {
    alignItems: 'center',
  },
  cityText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  temperatureText: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  weatherDescription: {
    fontSize: 22,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  humidityText: {
    fontSize: 18,
    marginBottom: 10,
  },
  windText: {
    fontSize: 18,
  },
  closeButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 20,
    width: 200,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
