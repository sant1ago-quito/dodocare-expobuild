import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HospitalInfoScreen() {
  const navigation = useNavigation();
  const [sections, setSections] = useState({
    mision: false,
    vision: false,
    servicios: false,
    adicionales: false,
  });

  const toggleSection = (key: keyof typeof sections) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSections({ ...sections, [key]: !sections[key] });
  };

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
        {/* Título principal */}
        <Text style={styles.title}>Centro de Hemodiálisis de Oriente</Text>

        {/* Descripción */}
        <Text style={styles.description}>
          Fundado el 23 de julio de 1977 por los doctores Abraham Francisco Arriola Bichara Bichara,
          Agustín Antonio Alvarenga Landaverde, Roberto José Bichara Nasser y Reinaldo Héctor López
          Castellón, con el objetivo de mejorar la atención médica en la Zona Oriental de El Salvador.
          Desde entonces ha sido un centro médico especializado en hemodiálisis enfrentando
          dificultades para encontrar personal capacitado e impulsando el desarrollo de la ciudad.
        </Text>

        {/* Secciones desplegables */}
        {[
          { key: 'mision', label: 'Misión', content: 'Nuestra misión es brindar atención médica especializada en hemodiálisis con calidad humana y profesional.' },
          { key: 'vision', label: 'Visión', content: 'Ser el centro líder en tratamientos renales en la región oriental de El Salvador.' },
          { key: 'servicios', label: 'Servicios', content: '• Hemodiálisis\n• Consulta nefrológica\n• Laboratorio clínico\n• Atención de urgencias' },
          { key: 'adicionales', label: 'Adicionales', content: '• Parqueo gratuito\n• Wi-Fi para pacientes\n• Cafetería\n• Atención bilingüe' },
        ].map(({ key, label, content }) => (
          <View key={key} style={styles.section}>
            <TouchableOpacity onPress={() => toggleSection(key as keyof typeof sections)}>
              <Text style={styles.sectionTitle}>{label}</Text>
            </TouchableOpacity>
            {sections[key as keyof typeof sections] && (
              <Text style={styles.sectionContent}>{content}</Text>
            )}
          </View>
        ))}

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
    paddingTop: 80, // espacio adicional desde el tope para separar del botón
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 20,
    textAlign: 'justify',
  },
  section: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2a44',
  },
  sectionContent: {
    marginTop: 8,
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

