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

export default function DisabilitiesScreen() {
  const navigation = useNavigation();

  const handleEmergencyCall = () => {
    Linking.openURL('tel:134');
  };

  const disabilitiesData = [
    {
      paciente: 'Javier Alejandro Rivas',
      diagnostico:
        'Esguince de ligamento derecho. Se recomienda reposo por 10 días a partir del martes.',
      medico: 'Dr. Juan Morales Rivera',
      cedula: '6543210',
    },
    {
      paciente: 'Alejandro Rivas',
      diagnostico:
        'Fractura en la pierna izquierda. Requiere reposo absoluto por 30 días desde el lunes.',
      seguimiento: 'Revisión médica semanal hasta recuperación total.',
      medico: 'Dra. Ana López Martínez',
      cedula: '1234567',
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#1f2a44' }}>
      {/* Botón de emergencia fijo */}
      <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyCall}>
        <Text style={styles.emergencyText}>Llamada de Emergencia 134</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        {disabilitiesData.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.title}>Incapacidad Médica</Text>

            <Text style={styles.label}>Paciente:</Text>
            <Text style={styles.text}>{item.paciente}</Text>

            <Text style={styles.label}>Diagnóstico:</Text>
            <Text style={styles.text}>{item.diagnostico}</Text>

            {item.seguimiento && (
              <>
                <Text style={styles.label}>Seguimiento:</Text>
                <Text style={styles.text}>{item.seguimiento}</Text>
              </>
            )}

            <Text style={styles.label}>Médico tratante:</Text>
            <Text style={styles.text}>{item.medico}</Text>
            <Text style={styles.text}>Cédula Profesional: {item.cedula}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 80, // para que el scroll inicie debajo del botón fijo
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
    fontSize: 16,
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
    marginBottom: 20,
  },
  backText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
