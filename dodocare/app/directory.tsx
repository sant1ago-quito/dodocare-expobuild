import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function DirectoryScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');

  const handleEmergencyCall = () => {
    Linking.openURL('tel:134');
  };

  const doctors = [
    {
      name: 'Dr. Alexis Benitez Hernandez',
      specialty: 'Médico Internista',
      address: 'Clínica Central, Calle 5, San Miguel',
      image: require('../assets/images/Dr1.webp'),
    },
    {
      name: 'Dr. Gilberto Edmundo de Evián',
      specialty: 'Ginecólogo-Obstetra',
      address: 'Hospital de la Mujer, Av. Roosevelt, San Miguel',
      image: require('../assets/images/Dr2.jpg'),
    },
    {
      name: 'Dr. Enrique Guerrero Perla',
      specialty: 'Cirujano General',
      address: 'Centro Médico El Salvador, Col. Médica',
      image: require('../assets/images/Dr3.jpg'),
    },
    {
      name: 'Dra. Jackeline Lissbeth Flores Hernández',
      specialty: 'Ginecología Obstetra',
      address: 'Hospital Materno Infantil, Calle Rubén Darío',
      image: require('../assets/images/Dr2.jpg'),
    },
  ];

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(search.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#1f2a44' }}>
      {/* Botón de emergencia flotante */}
      <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyCall}>
        <Text style={styles.emergencyText}>Llamada de Emergencia 134</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Barra de búsqueda */}
        <TextInput
          style={styles.searchBar}
          placeholder="Escribe la especialidad o nombre..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />

        <Text style={styles.filterText}>Filtrado por: Especialidad o Nombre</Text>

        {/* Lista de doctores */}
        {filteredDoctors.map((doctor, index) => (
          <View key={index} style={styles.card}>
            <Image source={doctor.image} style={styles.avatar} />
            <View style={styles.info}>
              <Text style={styles.name}>{doctor.name}</Text>
              <Text style={styles.specialty}>{doctor.specialty}</Text>
              <Text style={styles.address}>{doctor.address}</Text>
            </View>
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
    paddingTop: 80,
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
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2a44',
  },
  specialty: {
    fontSize: 14,
    color: '#555',
  },
  address: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
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
