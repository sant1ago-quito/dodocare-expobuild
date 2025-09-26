import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import Background from '../assets/svg/Background';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [telefono, setTelefono] = useState(''); // Nuevo estado para teléfono

  const InsertarUsuario = async () => {
    if (!nombre || !correo || !contrasena || !telefono) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }
    // Limpiar espacios y caracteres invisibles
    const correoLimpio = correo.replace(/\s/g, '').trim();
    // Validación de correo: debe tener letras y números, y formato de email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(correoLimpio)) {
      Alert.alert('Error', 'Ingresa un correo electrónico válido.');
      return;
    }
    // No permitir solo números antes de la arroba
    const correoParte = correoLimpio.split('@')[0];
    if (/^\d+$/.test(correoParte)) {
      Alert.alert('Error', 'El correo no puede ser solo números antes de la arroba.');
      return;
    }
    if (contrasena.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, correoLimpio, contrasena);
      const user = userCredential.user;
      await setDoc(doc(db, 'pacientes', user.uid), {
        email: user.email,
        nombre: nombre,
        telefono: telefono,
        role: 'user',
      });
      Alert.alert('Éxito', 'Usuario registrado correctamente.');
      router.push('/login-form');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo registrar el usuario.');
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={60}
    >
      <View style={{ flex: 1 }}>
        <Background style={StyleSheet.absoluteFill} />

        <View style={styles.container}>
          <Image 
            source={require('@/assets/images/logododo.jpeg')} 
            style={styles.logo}
            resizeMode="cover"
          />

          <Text style={styles.title}>Crear Cuenta</Text>

          {/* Campos del formulario */}
          <TextInput
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
            placeholderTextColor="#999"
          />
          <TextInput
            placeholder="Correo electrónico"
            style={styles.input}
            placeholderTextColor="#999"
            keyboardType="email-address"
            value={correo}
            onChangeText={setCorreo}
          />
          <TextInput
            placeholder="Teléfono"
            style={styles.input}
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={telefono}
            onChangeText={setTelefono}
          />
          <TextInput
            placeholder="Contraseña"
            style={styles.input}
            placeholderTextColor="#999"
            secureTextEntry
            value={contrasena}
            onChangeText={setContrasena}
          />
          <TouchableOpacity style={styles.backButton}
            onPress={() => router.push('/login-form')}>
            <Text style={styles.backButtonText}>¿Ya tienes cuenta? Inicia Sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={InsertarUsuario}> 
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.replace('/login')}
          >
            <Text style={styles.backButtonText}>Volver al inicio</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});