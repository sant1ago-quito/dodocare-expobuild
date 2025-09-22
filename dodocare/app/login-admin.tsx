import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from './AuthContext';

export const options = {
  headerShown: false,
};

export default function LoginAdminScreen() {
  const { loginAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const success = await loginAdmin(email, password);
      if (success) {
        router.replace('/AdminHome');
      } else {
        Alert.alert('Error', 'Correo o contraseña incorrectos.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ocurrió un error al iniciar sesión.');
    }
  };

  const handleBack = () => {
    router.replace('/login');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#2D3748' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{
            ...styles.scrollContainer,
            minHeight: Platform.OS === 'ios' ? '100%' : 600, // fuerza scroll en Android
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: '#2D3748' }}
        >
          <View style={styles.topBackground}></View>
          <View style={styles.whiteBox}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/images/logododocare.png')}
                style={styles.logo}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.welcomeText}>Login Administrador</Text>
            <TextInput
              placeholder="Email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              autoCorrect={false}
              textContentType="emailAddress"
            />
            <TextInput
              placeholder="Contraseña"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="done"
              autoCorrect={false}
              textContentType="password"
            />

            <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
              <Text style={styles.buttonText}>Ingresar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#2D3748',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: '100%',
  },
  topBackground: {
    width: '100%',
    height: 200,
    backgroundColor: '#2D3748',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteBox: {
    backgroundColor: 'white',
    width: '90%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: -50,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  logoContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    marginBottom: 30,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  welcomeText: {
    fontSize: 24,
    color: '#1f2a44',
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    marginTop: 15,
    padding: 12,
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4CAF50',
    alignItems: 'center',
  },
  backText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
