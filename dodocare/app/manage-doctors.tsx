import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { db } from '../firebase'; // Asegúrate que la ruta sea correcta
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

type Doctor = {
  id: string;
  nombre: string;
  especialidad: string;
  email: string;
};

export default function ManageDoctorsScreen() {
  const [nombre, setNombre] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [email, setEmail] = useState('');
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // Leer médicos al iniciar
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'doctors'));
      const docs: Doctor[] = [];
      querySnapshot.forEach((docSnap) => {
        docs.push({ id: docSnap.id, ...docSnap.data() } as Doctor);
      });
      setDoctores(docs);
      setLoading(false);
    };
    fetchDoctors();
  }, []);

  const agregarDoctor = async () => {
    if (!nombre || !especialidad || !email) {
      Alert.alert('Completa todos los campos');
      return;
    }
    try {
      const docRef = await addDoc(collection(db, 'doctors'), {
        nombre,
        especialidad,
        email,
      });
      setDoctores([...doctores, { id: docRef.id, nombre, especialidad, email }]);
      setNombre('');
      setEspecialidad('');
      setEmail('');
    } catch (error) {
      Alert.alert('Error al agregar médico');
    }
  };

  const eliminarDoctor = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'doctors', id));
      setDoctores(doctores.filter(doc => doc.id !== id));
    } catch (error) {
      Alert.alert('Error al eliminar médico');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestionar Médicos</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nombre del médico"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Especialidad"
          value={especialidad}
          onChangeText={setEspecialidad}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TouchableOpacity style={styles.addButton} onPress={agregarDoctor}>
          <Text style={styles.addButtonText}>Agregar Médico</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={doctores}
        keyExtractor={item => item.id}
        style={{ width: '100%', marginTop: 20 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {loading ? 'Cargando...' : 'No hay médicos registrados.'}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.doctorCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.doctorName}>{item.nombre}</Text>
              <Text style={styles.doctorInfo}>Especialidad: {item.especialidad}</Text>
              <Text style={styles.doctorInfo}>Email: {item.email}</Text>
            </View>
            <TouchableOpacity onPress={() => eliminarDoctor(item.id)} style={styles.deleteButton}>
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
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
  },
  doctorName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2D3748',
  },
  doctorInfo: {
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