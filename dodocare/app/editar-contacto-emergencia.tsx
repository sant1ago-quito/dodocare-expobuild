// app/editar-contacto-emergencia.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useFocusEffect } from '@react-navigation/native';

export default function EditarContactoEmergencia() {
  const [nombre, setNombre] = useState('');
  const [parentesco, setParentesco] = useState('');
  const [tipoSangre, setTipoSangre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  const fetchDatos = async () => {
    if (user) {
      const docRef = doc(db, 'pacientes', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setNombreUsuario(data.nombre || '');
        setNombre(data.contactoNombre || '');
        setParentesco(data.contactoParentesco || '');
        setTipoSangre(data.contactoTipoSangre || '');
        setTelefono(data.contactoTelefono || '');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDatos();
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchDatos();
    }, [])
  );

  const guardarDatos = async () => {
    if (!user) return;
    try {
      const docRef = doc(db, 'pacientes', user.uid);
      await updateDoc(docRef, {
        contactoNombre: nombre,
        contactoParentesco: parentesco,
        contactoTipoSangre: tipoSangre,
        contactoTelefono: telefono,
      });
      Alert.alert('Éxito', 'Datos guardados correctamente');
      router.back();
    } catch (e) {
      Alert.alert('Error', 'No se pudieron guardar los datos');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.name}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={64} color="#1f2a44" />
        <Text style={styles.name}>{nombreUsuario}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>Contacto de Emergencia</Text>
          <TouchableOpacity onPress={guardarDatos}>
            <Ionicons name="save-outline" size={24} color="#00c853" />
          </TouchableOpacity>
        </View>

        <LabelInput
          label="Nombre"
          placeholder="Ejemplo: María Rivas"
          value={nombre}
          onChangeText={setNombre}
        />

        <LabelInput
          label="Parentesco"
          placeholder="Ejemplo: Madre"
          value={parentesco}
          onChangeText={setParentesco}
        />

        <LabelInput
          label="Tipo de Sangre"
          placeholder="Ejemplo: O+"
          value={tipoSangre}
          onChangeText={setTipoSangre}
        />

        <LabelInput
          label="Teléfono"
          placeholder="Ejemplo: +503 7682-8282"
          value={telefono}
          onChangeText={setTelefono}
        />
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const LabelInput = ({
  label,
  placeholder,
  value,
  onChangeText,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#aaa"
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2a44',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2a44',
  },
  label: {
    fontWeight: '500',
    color: '#1f2a44',
    marginBottom: 4,
  },
  inputContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    fontSize: 14,
    color: '#000',
  },
  backButton: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
