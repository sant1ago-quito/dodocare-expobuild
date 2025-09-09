import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import Background from '../assets/svg/Background'; // Ajusta la ruta si es necesario
import { useAuth } from './AuthContext'; // Ajusta la ruta si es necesario


export default function LoginScreen() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!correo || !contrasena) {
      Alert.alert('Error', 'Por favor, ingresa tu correo y contraseña.');
      return;
    }
    try {
      await login(correo, contrasena);
  // ...notificación local eliminada...
      router.replace('/(tabs)/home'); // Ajusta la ruta a tu home
    } catch (error) {
      Alert.alert('Error', 'Correo o contraseña incorrectos o error de conexión.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Background style={StyleSheet.absoluteFill} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={60}
      >
        <View style={styles.container}>
          <Image 
            source={require('@/assets/images/logododocare.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Iniciar Sesión</Text>

          <TextInput
            placeholder="Correo electrónico"
            style={styles.input}
            placeholderTextColor="#999"
            keyboardType="email-address"
            value={correo}
            onChangeText={setCorreo}
          />

          <TextInput
            placeholder="Contraseña"
            style={styles.input}
            placeholderTextColor="#999"
            secureTextEntry
            value={contrasena}
            onChangeText={setContrasena}
          />
           <TouchableOpacity style={styles.secondaryButton}
            onPress={() => router.push('/forgot-password')}>
            <Text style={styles.secondaryButtonText}>¿Olvidaste tu contraseña? Cambiar Contraseña</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}
            onPress={() => router.push('/register')}>
            <Text style={styles.secondaryButtonText}>¿Aún no tienes cuenta? Crear Cuenta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Ingresar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.replace('/login')}
          >
            <Text style={styles.secondaryButtonText}>Volver al inicio</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 235,
    height: 235,
    marginBottom: 80,
    alignSelf: 'flex-start',
    borderRadius: 300,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  title: {
    fontSize: 30,
    color: '#ffff',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  secondaryButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#ffff',
    textDecorationLine: 'underline',
  },
});
