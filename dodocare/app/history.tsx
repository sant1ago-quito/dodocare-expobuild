import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HistoryScreen() {
  const navigation = useNavigation();

  const handleEmergencyCall = () => {
    Linking.openURL('tel:134');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#1f2a44' }}>
      {/* Botón de emergencia en la esquina superior derecha */}
      <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyCall}>
        <Text style={styles.emergencyText}>Llamada de Emergencia 134</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Tarjeta de historial */}
        <View style={styles.card}>
          <Text style={styles.title}>Historial Médico</Text>

          <Text style={styles.label}>Paciente:</Text>
          <Text style={styles.text}>Javier Alejandro Rivas</Text>

          <Text style={styles.label}>Edad:</Text>
          <Text style={styles.text}>22 años</Text>

          <Text style={styles.label}>Padecimientos:</Text>
          <Text style={styles.text}>• Asma controlada</Text>
          <Text style={styles.text}>• Migraña crónica</Text>

          <Text style={styles.label}>Crisis asmáticas:</Text>
          <Text style={styles.text}>Última crisis: 20/10/2025</Text>
          <Text style={styles.text}>Frecuencia: Cada tres meses</Text>

          <Text style={styles.label}>Crisis migrañosas:</Text>
          <Text style={styles.text}>Última crisis: 01/10/2025</Text>
          <Text style={styles.text}>Frecuencia: Una vez al mes</Text>

          <Text style={styles.label}>Alergias:</Text>
          <Text style={styles.text}>Penicilina</Text>

          <Text style={styles.label}>Medicamentos:</Text>
          <Text style={styles.text}>• Salbutamol, Omeprazol (2020)</Text>
          <Text style={styles.text}>• Sumatriptán, Naproxeno (2024)</Text>

          <Text style={styles.label}>Próxima cita:</Text>
          <Text style={styles.text}>Lunes (fecha por confirmar)</Text>

          <Text style={styles.label}>Médico tratante:</Text>
          <Text style={styles.text}>Dra. Paula Sánchez T.</Text>
        </View>

        {/* Botón Volver */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 80, // Espacio para evitar que se tape el contenido con el botón
  },
  emergencyButton: {
    position: 'absolute',
    top: 30,
    right: 16,
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    zIndex: 10,
  },
  emergencyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1f2a44',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 8,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#555',
  },
  backButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  backText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
