import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import Background from '../assets/svg/Background2'; // Ruta corregida
import { useAuth } from './AuthContext'; // Ajusta la ruta si es necesario

// ✅ Tipo explícito solo con las rutas que quieres para admin
type AdminRoutes =
  | '/manage-doctors'
  | '/manage-patients'
  | '/specialties'
  | '/reports';

export default function AdminHome() {
  const { role, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/login-admin');
  };

  const services: { label: string; route: AdminRoutes; restricted?: boolean }[] = [
    { label: 'Gestionar Médicos', route: '/manage-doctors' },
    { label: 'Gestionar Pacientes', route: '/manage-patients' },
    { label: 'Especialidades Médicas', route: '/specialties' },
    { label: 'Reportes', route: '/reports' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <Background style={StyleSheet.absoluteFill} />

      <View style={styles.container}>
        {/* Logo */}
        <Image
          source={require('../assets/images/logododocare.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Bienvenida */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>
            ¡Bienvenido{'\n'}{role === 'admin' ? 'Administrador' : 'Usuario'}!
          </Text>
        </View>

        <Text style={styles.subTitle}>Panel de Administración</Text>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 4 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {services.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.serviceBox}
                onPress={() => router.push(item.route as any)}

              >
                <Text style={styles.boxText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>SALIR</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={{ height: 100 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: 123,
    height: 123,
    marginBottom: 20,
    alignSelf: 'flex-start',
    borderRadius: 300,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  welcomeCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 20,
    marginBottom: 20,
    alignSelf: 'center',
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    lineHeight: 22,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  serviceBox: {
    backgroundColor: '#fff',
    width: 140,
    height: 120,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    padding: 10,
  },
  boxText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2a44',
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 60,
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
