import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  email: string;
  address: string;
  numero?: number;
};

export default function ManageDoctorsScreen() {
  const [nombre, setNombre] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Leer médicos al iniciar
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'doctors'));
      const docs: Doctor[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        docs.push({
          id: docSnap.id,
          name: data.name ?? data.nombre ?? 'Nombre no disponible',
          specialty: data.specialty ?? data.especialidad ?? 'Especialidad no disponible',
          email: data.email ?? '',
          address: data.address ?? '',
          numero: data.numero,
        });
      });
      setDoctores(docs);
      setLoading(false);
    };
    fetchDoctors();
  }, []);

  // Validación de email
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const resetForm = () => {
    setNombre('');
    setEspecialidad('');
    setEmail('');
    setAddress('');
    setEditingId(null);
  };

  const agregarDoctor = async () => {
    if (!nombre || !especialidad || !email || !address) {
      Alert.alert('Completa todos los campos');
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert('Por favor ingresa un correo electrónico válido');
      return;
    }
    try {
      if (editingId) {
        // Editar médico existente
        await updateDoc(doc(db, 'doctors', editingId), {
          name: nombre,
          specialty: especialidad,
          email,
          address,
        });
        setDoctores(doctores.map(doc =>
          doc.id === editingId
            ? { ...doc, name: nombre, specialty: especialidad, email, address }
            : doc
        ));
        resetForm();
      } else {
        // Agregar nuevo médico
        const querySnapshot = await getDocs(collection(db, 'doctors'));
        let maxNumero = 0;
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.numero && data.numero > maxNumero) {
            maxNumero = data.numero;
          }
        });
        const nuevoNumero = maxNumero + 1;

        const docRef = await addDoc(collection(db, 'doctors'), {
          name: nombre,
          specialty: especialidad,
          email,
          address,
          numero: nuevoNumero,
        });
        setDoctores([...doctores, { id: docRef.id, name: nombre, specialty: especialidad, email, address, numero: nuevoNumero }]);
        resetForm();
      }
    } catch (error) {
      Alert.alert('Error al guardar médico');
    }
  };

  const eliminarDoctor = (id: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este médico?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'doctors', id));
              setDoctores(doctores.filter(doc => doc.id !== id));
              if (editingId === id) resetForm();
            } catch (error) {
              Alert.alert('Error al eliminar médico');
            }
          },
        },
      ]
    );
  };

  const editarDoctor = (doctor: Doctor) => {
    setNombre(doctor.name);
    setEspecialidad(doctor.specialty);
    setEmail(doctor.email);
    setAddress(doctor.address);
    setEditingId(doctor.id);
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
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Dirección del consultorio"
          value={address}
          onChangeText={setAddress}
        />
        <TouchableOpacity style={styles.addButton} onPress={agregarDoctor}>
          <Text style={styles.addButtonText}>
            {editingId ? 'Guardar Cambios' : 'Agregar Médico'}
          </Text>
        </TouchableOpacity>
        {editingId && (
          <TouchableOpacity style={[styles.addButton, { backgroundColor: '#aaa', marginTop: 8 }]} onPress={resetForm}>
            <Text style={styles.addButtonText}>Cancelar</Text>
          </TouchableOpacity>
        )}
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
              <Text style={styles.doctorName}>{item.name}</Text>
              <Text style={styles.doctorInfo}>Especialidad: {item.specialty}</Text>
              <Text style={styles.doctorInfo}>Email: {item.email}</Text>
              <Text style={styles.doctorInfo}>Dirección: {item.address}</Text>
            </View>
            <View>
              <TouchableOpacity onPress={() => editarDoctor(item)} style={[styles.deleteButton, { backgroundColor: '#3B82F6', marginBottom: 6 }]}>
                <Text style={styles.deleteButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => eliminarDoctor(item.id)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
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