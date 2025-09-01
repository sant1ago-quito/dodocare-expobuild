import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from './AuthContext'; // Ajusta la ruta si es necesario

export default function LoginScreen() {
  const { loginAsGuest } = useAuth();

  return (
    <View style={styles.container}>
      {/* Fondo superior */}
      <View style={styles.topBackground}>
      </View>

      {/* Cuadro blanco con el logo y los botones */}
      <View style={styles.whiteBox}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('@/assets/images/logododo.jpeg')} 
            style={styles.logo}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.welcomeText}>¡Bienvenido/a!</Text>

        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push('/login-form')}
        >
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => router.push('/register')}
        >
          <Text style={styles.buttonText}>Crear Cuenta</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.guestButton}
          onPress={() => {
            loginAsGuest();
            router.replace('/(tabs)/home');
          }}
        >
          <Text style={styles.guestButtonText}>Ingresar como invitado</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
}

// Definición completa del objeto styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D3748',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  topBackground: {
    width: "100%",
    height: 200,
    backgroundColor: "#2D3748",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#1f2a44",
    fontSize: 22,
    fontWeight: "bold",
  },
  whiteBox: {
    backgroundColor: "white",
    width: "90%",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginTop: -50, // Superpone el cuadro sobre el fondo superior
    elevation: 5, // Sombra en Android
    shadowColor: "#000", // Sombra en iOS
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
    marginBottom: 40,
    fontWeight: 'bold',
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  secondaryButton: {
    backgroundColor: '#3B82F6',
    borderWidth: 2,
    borderColor: '#3B82F6',
    padding: 16,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  guestButton: {
    marginTop: 10,
    padding: 12,
  },
  guestButtonText: {
    color: '#000000',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
