import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

type Speciality = {
  id: string;
  nombre: string;
};

export default function SpecialtiesScreen() {
  const [nombre, setNombre] = useState('');
  const [specialties, setSpecialties] = useState<Speciality[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecialties = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'specialties'));
      const docs: Speciality[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data() as Speciality;
        docs.push({ ...data, id: docSnap.id });
      });
      setSpecialties(docs);
      setLoading(false);
    };
    fetchSpecialties();
  }, []);

  const agregarEspecialidad = async () => {
    if (!nombre.trim()) {
      Alert.alert('Por favor ingresa el nombre de la especialidad');
      return;
    }
    try {
      const docRef = await addDoc(collection(db, 'specialties'), {
        nombre,
      });
      setSpecialties([...specialties, { id: docRef.id, nombre }]);
      setNombre('');
    } catch (error) {
      Alert.alert('Error al agregar especialidad');
    }
  };

  const eliminarEspecialidad = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'specialties', id));
      setSpecialties(specialties.filter(item => item.id !== id));
    } catch (error) {
      Alert.alert('Error al eliminar especialidad');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Especialidades Médicas</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nombre de la especialidad"
          value={nombre}
          onChangeText={setNombre}
        />
        <TouchableOpacity style={styles.addButton} onPress={agregarEspecialidad}>
          <Text style={styles.addButtonText}>Agregar Especialidad</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={specialties}
        keyExtractor={item => item.id}
        style={{ width: '100%', marginTop: 20 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {loading ? 'Cargando...' : 'No hay especialidades registradas.'}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.specialtyCard}>
            <Text style={styles.specialtyName}>{item.nombre}</Text>
            <TouchableOpacity onPress={() => eliminarEspecialidad(item.id)} style={styles.deleteButton}>
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
  specialtyCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
    justifyContent: 'space-between',
  },
  specialtyName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2D3748',
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