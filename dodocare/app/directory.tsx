import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function DirectoryScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const querySnapshot = await getDocs(collection(db, 'doctors'));
        const docs = querySnapshot.docs.map(docSnap => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            name: data.name ?? data.nombre ?? '',
            specialty: data.specialty ?? data.especialidad ?? '',
            address: data.address ?? '',
            email: data.email ?? '',
            numero: data.numero,
          };
        });
        setDoctors(docs);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  const handleEmergencyCall = () => {
    Linking.openURL('tel:134');
  };

  const filteredDoctors = doctors.filter((doctor) =>
    (doctor.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (doctor.specialty ?? '').toLowerCase().includes(search.toLowerCase())
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

        {/* Indicador de carga */}
        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          /* Lista de doctores */
          filteredDoctors.map((doctor, index) => (
            <View key={doctor.id ?? index} style={styles.card}>
              <View style={styles.avatarPlaceholder}>
                <Text style={{ fontSize: 32 }}>👨‍⚕️</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{doctor.name || 'Sin nombre'}</Text>
                <Text style={styles.specialty}>{doctor.specialty || 'Sin especialidad'}</Text>
                <Text style={styles.address}>{doctor.address || 'Sin dirección'}</Text>
              </View>
            </View>
          ))
        )}

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
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 12,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
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
