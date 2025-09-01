import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import Background from '../assets/svg/Background';

export default function ForgotPassword() {
  const [correo, setCorreo] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');

  const handleResetPassword = async () => {
    if (!correo || !nuevaContrasena || !confirmarContrasena) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }
    if (nuevaContrasena !== confirmarContrasena) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }
    if (nuevaContrasena.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    try {
      const response = await fetch('http://192.168.0.10:80/api/reset_password.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo, nuevaContrasena })
      });
      const data = await response.json();
      if (data.success) {
        Alert.alert('Éxito', 'Contraseña actualizada correctamente.');
        router.replace('/login-form');
      } else {
        Alert.alert('Error', data.mensaje || 'No se pudo actualizar la contraseña.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar al servidor.');
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
            source={require('@/assets/images/logododo.jpeg')} 
            style={styles.logo}
            resizeMode="cover"
          />
          <Text style={styles.title}>Restablecer Contraseña</Text>
          <Text style={styles.subtitle}>
            Ingresa tu correo y la nueva contraseña
          </Text>
          <TextInput
            placeholder="Correo electrónico"
            placeholderTextColor="#999"
            style={styles.input}
            keyboardType="email-address"
            value={correo}
            onChangeText={setCorreo}
          />
          <TextInput
            placeholder="Nueva contraseña"
            placeholderTextColor="#999"
            style={styles.input}
            secureTextEntry
            value={nuevaContrasena}
            onChangeText={setNuevaContrasena}
          />
          <TextInput
            placeholder="Confirmar nueva contraseña"
            placeholderTextColor="#999"
            style={styles.input}
            secureTextEntry
            value={confirmarContrasena}
            onChangeText={setConfirmarContrasena}
          />
          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Cambiar Contraseña</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.backLink}
            onPress={() => router.back()}
          >
            <Text style={styles.backLinkText}>Volver al login</Text>
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
    width: 240,
    height: 280,
    marginBottom: 80,
    alignSelf: 'flex-start',
    borderRadius: 300,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 7,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 7,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backLink: {
    marginTop: 10,
    alignItems: 'center',
  },
  backLinkText: {
    color: '#4CAF50',
    fontSize: 16,
  },
});