import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import Background from '../assets/svg/Background';

export default function Register() {
  const [Nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const InsertarUsuario = () => {
    // Aquí va la lógica para registrar usuario usando Nombre, correo y contrasena
    var usuario = {
      Nombre: Nombre,
      correo: correo,
      contrasena: contrasena,
  };
  if (usuario.Nombre.length==0 || usuario.correo.length==0  || usuario.contrasena.length==0) 
    {
      alert("Por favor, completa todos los campos.");
      return;
    }
    if (usuario.contrasena.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
  else {
      var InsertAPIURL="http://192.168.0.10:80/api/conexion.php"
      var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      var Data = {
        Nombre: usuario.Nombre,
        correo: usuario.correo,
        contrasena: usuario.contrasena
      };

      fetch(InsertAPIURL, 
        {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(Data)
        }
        )
        .then((response) => response.json())
        .then((response) => 
          {
            alert(response[0].mensaje);
            router.push('/login-form'); // Redirige al formulario de inicio de sesión
            
          })
          .catch((error) => 
            {
              alert("Error: " + error);
            })

    }
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={60} // Ajusta este valor según tu header
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
            style={styles.input}
            placeholderTextColor="#999"
            onChangeText={setNombre}
          />
          
          <TextInput
            placeholder="Correo electrónico"
            style={styles.input}
            placeholderTextColor="#999"
            keyboardType="email-address"
            onChangeText={setCorreo}
          />
          
          <TextInput
            placeholder="Contraseña"
            style={styles.input}
            placeholderTextColor="#999"
            secureTextEntry
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
            onPress={() => router.replace('/login')} // Cambiado a replace
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