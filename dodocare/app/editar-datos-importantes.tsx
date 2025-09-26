// app/editar-datos-importantes.tsx
import React, { useState, useEffect } from 'react';
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
import { Picker } from '@react-native-picker/picker';

export default function EditarDatosImportantes() {
  const [nombre, setNombre] = useState('');
  const [dui, setDui] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [sexo, setSexo] = useState('');
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const cargarDatos = async () => {
      if (user) {
        const docRef = doc(db, 'pacientes', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setNombre(data.nombre || '');
          setDui(data.dui || '');
          setFechaNacimiento(data.fechaNacimiento || '');
          setSexo(data.sexo || '');
        }
      }
      setLoading(false);
    };
    cargarDatos();
  }, [user]);

  const guardarDatos = async () => {
    if (!user) return;
    try {
      const docRef = doc(db, 'pacientes', user.uid);
      await updateDoc(docRef, {
        nombre,
        dui,
        fechaNacimiento,
        sexo,
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
        <Text style={styles.name}>{nombre}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>Datos Importantes</Text>
          <TouchableOpacity onPress={guardarDatos}>
            <Ionicons name="save-outline" size={24} color="#00c853" />
          </TouchableOpacity>
        </View>

        <LabelInput
          label="Dui"
          placeholder="Ejemplo: 12345678-9"
          value={dui}
          onChangeText={setDui}
        />

        <LabelInput
          label="Fecha de Nacimiento"
          placeholder="Ejemplo: 10/04/2001"
          value={fechaNacimiento}
          onChangeText={setFechaNacimiento}
        />

        {/* Picker para Sexo */}
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.label}>Sexo</Text>
          <View style={styles.inputContainer}>
            <Picker
              selectedValue={sexo}
              onValueChange={setSexo}
              style={{ color: sexo ? '#000' : '#aaa' }}
            >
              <Picker.Item label="Selecciona una opción" value="" color="#aaa" />
              <Picker.Item label="Masculino" value="Masculino" />
              <Picker.Item label="Femenino" value="Femenino" />
            </Picker>
          </View>
        </View>
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
