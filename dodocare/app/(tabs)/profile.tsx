import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../AuthContext'; // 👈 ajusta la ruta si es necesario

export default function ProfileScreen() {
  const { isGuest } = useAuth();
  const router = useRouter();

  // 🔒 Si es invitado → mostramos restricción
  if (isGuest) {
    return (
      <View style={styles.restrictedContainer}>
        <Text style={styles.restrictedText}>
          Esta sección no está disponible para usuarios invitados.
        </Text>
      </View>
    );
  }

  // ✅ Si es usuario registrado → mostramos perfil
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      {/* Bienvenida con ícono */}
      <View style={styles.welcomeCard}>
        <Image
          source={require('@/assets/images/WelcomeIcon.png')}
          style={styles.welcomeIcon}
        />
        <Text style={styles.name}>Javier Alejandro{"\n"}Rivas Perla</Text>
      </View>

      {/* Sección: Datos Importantes */}
      <View style={styles.card}>
        <SectionHeader title="Datos Importantes" />
        <InfoRow label="Dui" value="12345678-9" />
        <InfoRow label="Fecha de Nacimiento" value="10/04/2001" />
        <InfoRow label="Sexo" value="Masculino" />
        <EditIcon onPress={() => router.push('/editar-datos-importantes')} />
      </View>

      {/* Sección: Datos Complementarios */}
      <View style={styles.card}>
        <SectionHeader title="Datos Complementarios" />
        <InfoRow label="Peso" value="176.37 Libras" />
        <InfoRow label="Altura" value="1.82 Metros" />
        <InfoRow label="Tipo de Sangre" value="O+" />
        <InfoRow label="Dirección" value="Colonia Milagro de la Paz" />
        <InfoRow label="Teléfono" value="7682-8282" />
        <EditIcon onPress={() => router.push('/editar-datos-complementarios')} />
      </View>

      {/* Sección: Información Importante */}
      <View style={styles.card}>
        <SectionHeader title="Información Importante" />
        <InfoRow label="Alergias" value="(no proporcionado)" />
        <InfoRow label="Medicamentos" value="(no proporcionado)" />
        <InfoRow label="Condición Médica" value="(no proporcionado)" />
        <EditIcon onPress={() => router.push('/editar-info-medica')} />
      </View>

      {/* Sección: Contacto de Emergencia */}
      <View style={styles.card}>
        <SectionHeader title="Contacto de Emergencia" />
        <InfoRow label="Nombre" value="(no proporcionado)" />
        <InfoRow label="Parentesco" value="(no proporcionado)" />
        <InfoRow label="Tipo de Sangre" value="(no proporcionado)" />
        <InfoRow label="Teléfono" value="7682-8282" />
        <EditIcon onPress={() => router.push('/editar-contacto-emergencia')} />
      </View>
    </ScrollView>
  );
}

// 🔹 Componentes reutilizables
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const SectionHeader = ({ title }: { title: string }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const EditIcon = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.editIcon} onPress={onPress}>
    <Ionicons name="create-outline" size={18} color="#1f2a44" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1f2a44',
    padding: 16,
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
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1f2a44',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
    color: '#1f2a44',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: {
    fontWeight: '500',
    color: '#333',
  },
  value: {
    color: '#555',
  },
  editIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  restrictedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1f2a44',
    padding: 20,
  },
  restrictedText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});
