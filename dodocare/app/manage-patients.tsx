import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

type Patient = {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
};

export default function ManagePatientsScreen() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'patients'));
      const docs: Patient[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data() as Patient;
        docs.push({ ...data, id: docSnap.id });
      });
      setPatients(docs);
      setLoading(false);
    };
    fetchPatients();
  }, []);

  const agregarPaciente = async () => {
    if (!nombre.trim() || !email.trim() || !telefono.trim()) {
      Alert.alert('Por favor completa todos los campos');
      return;
    }
    try {
      const docRef = await addDoc(collection(db, 'patients'), {
        nombre,
        email,
        telefono,
      });
      setPatients([...patients, { id: docRef.id, nombre, email, telefono }]);
      setNombre('');
      setEmail('');
      setTelefono('');
    } catch (error) {
      Alert.alert('Error al agregar paciente');
    }
  };

  const eliminarPaciente = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'patients', id));
      setPatients(patients.filter(item => item.id !== id));
    } catch (error) {
      Alert.alert('Error al eliminar paciente');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestionar Pacientes</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nombre del paciente"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.addButton} onPress={agregarPaciente}>
          <Text style={styles.addButtonText}>Agregar Paciente</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={patients}
        keyExtractor={item => item.id}
        style={{ width: '100%', marginTop: 20 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {loading ? 'Cargando...' : 'No hay pacientes registrados.'}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.patientCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.patientName}>{item.nombre}</Text>
              <Text style={styles.patientInfo}>Email: {item.email}</Text>
              <Text style={styles.patientInfo}>Teléfono: {item.telefono}</Text>
            </View>
            <TouchableOpacity onPress={() => eliminarPaciente(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D3748',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#F8FAFC',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  patientCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
  },
  patientName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2D3748',
  },
  patientInfo: {
    color: '#444',
    fontSize: 13,
  },
  deleteButton: {
    backgroundColor: '#E53E3E',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});