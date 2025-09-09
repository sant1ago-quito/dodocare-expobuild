import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Background from '../../assets/svg/Background2';
import { useAuth } from '../AuthContext'; // Asegúrate de que la ruta sea correcta

// ✅ Tipo explícito solo con las rutas que quieres
type ValidRoutes =
  | '/appointment'
  | '/history'
  | '/directory'
  | '/hospital-info';

export default function Home() {
  const handleLogout = () => {
    router.replace('/login');
  };

  // ✅ Solo las rutas permitidas + iconos
  const services: { label: string; route: ValidRoutes; restricted?: boolean; icon: any }[] = [
    { label: 'Agendar cita', route: '/appointment', restricted: true, icon: require('@/assets/images/cita.png') },
    { label: 'Historial médico', route: '/history', restricted: true, icon: require('@/assets/images/informe-medico.png') },
    { label: 'Directorio médico', route: '/directory', icon: require('@/assets/images/medico.png') },
    { label: 'Información del hospital', route: '/hospital-info', restricted: true, icon: require('@/assets/images/informacion.png') },
  ];

  const { isGuest } = useAuth();

  return (
    <View style={{ flex: 1 }}>
      <Background style={StyleSheet.absoluteFill} />

      <View style={styles.container}>
        {/* Logo */}
        <Image
          source={require('@/assets/images/logododocare.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Bienvenida con ícono */}
        <View style={styles.welcomeCard}>
          <Image
            source={require('@/assets/images/WelcomeIcon.png')}
            style={styles.welcomeIcon}
          />
          <Text style={styles.welcomeText}>
            ¡Bienvenido{'\n'}{isGuest ? 'Invitado' : 'Usuario'}!
          </Text>
        </View>

        <Text style={styles.subTitle}>Servicios</Text>

        {/* ✅ ScrollView para evitar superposición con el footer */}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 4 }}
          showsVerticalScrollIndicator={false}
        >
          {/* ✅ Navegación segura con rutas tipadas */}
          <View style={styles.grid}>
            {services.map((item, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={isGuest && item.restricted ? 1 : 0.7}
                style={[
                  styles.serviceBox,
                  isGuest && item.restricted && { opacity: 0.5 },
                ]}
                onPress={() => {
                  if (isGuest && item.restricted) {
                    alert('Debes iniciar sesión para acceder a este servicio.');
                    return;
                  }
                  router.push(item.route);
                }}
              >
                {/* 👇 Imagen arriba del texto */}
                <Image
                  source={item.icon}
                  style={styles.serviceIcon}
                  resizeMode="contain"
                />
                <Text style={styles.boxText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>SALIR</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Espacio vacío para no tapar el footer */}
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 20,
    marginBottom: 20,
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  welcomeIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
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
  serviceIcon: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  boxText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2a44',
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 60, // un poco más abajo
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
