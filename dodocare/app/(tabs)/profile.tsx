import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../AuthContext';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen() {
  const { role } = useAuth();
  const router = useRouter();
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [search, setSearch] = useState('');
  const [nombre, setNombre] = useState<string | null>(null);
  const [loadingNombre, setLoadingNombre] = useState(true);
  const [dui, setDui] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [sexo, setSexo] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [tipoSangre, setTipoSangre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  // NUEVOS ESTADOS:
  const [alergias, setAlergias] = useState('');
  const [medicamentos, setMedicamentos] = useState('');
  const [condicion, setCondicion] = useState('');
  const [contactoNombre, setContactoNombre] = useState('');
  const [contactoParentesco, setContactoParentesco] = useState('');
  const [contactoTipoSangre, setContactoTipoSangre] = useState('');
  const [contactoTelefono, setContactoTelefono] = useState('');

  useEffect(() => {
    const fetchNombre = async () => {
      if (currentUser) {
        try {
          const docRef = doc(db, 'pacientes', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setNombre(docSnap.data().nombre || null);
          } else {
            setNombre(null);
          }
        } catch (e) {
          setNombre(null);
        }
      }
      setLoadingNombre(false);
    };
    fetchNombre();
  }, [currentUser]);

  const fetchDatos = async () => {
    if (currentUser) {
      const docRef = doc(db, 'pacientes', currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDui(data.dui || '');
        setFechaNacimiento(data.fechaNacimiento || '');
        setSexo(data.sexo || '');
        setPeso(data.peso || '');
        setAltura(data.altura || '');
        setTipoSangre(data.tipoSangre || '');
        setDireccion(data.direccion || '');
        setTelefono(data.telefono || '');
        // NUEVOS CAMPOS:
        setAlergias(data.alergias || '');
        setMedicamentos(data.medicamentos || '');
        setCondicion(data.condicion || '');
        setContactoNombre(data.contactoNombre || '');
        setContactoParentesco(data.contactoParentesco || '');
        setContactoTipoSangre(data.contactoTipoSangre || '');
        setContactoTelefono(data.contactoTelefono || '');
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDatos();
    }, [])
  );

  const guardarDatosUsuario = async () => {
    if (!currentUser) return;
    const docRef = doc(db, 'pacientes', currentUser.uid);
    await updateDoc(docRef, {
      dui,
      fechaNacimiento,
      sexo,
      peso,
      altura,
      tipoSangre,
      direccion,
      telefono,
      // NUEVOS CAMPOS:
      alergias,
      medicamentos,
      condicion,
      contactoNombre,
      contactoParentesco,
      contactoTipoSangre,
      contactoTelefono,
    });
    Alert.alert('Datos actualizados');
  };

  // Solo bloquea si es invitado
  if (role === 'guest') {
    return (
      <View style={styles.restrictedContainer}>
        <Text style={styles.restrictedText}>
          Esta sección no está disponible para usuarios invitados.
        </Text>
      </View>
    );
  }

  // ✅ Si es usuario registrado → mostramos perfil
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      {/* Bienvenida con ícono */}
      <View style={styles.welcomeCard}>
        <Image
          source={require('@/assets/images/WelcomeIcon.png')}
          style={styles.welcomeIcon}
        />
        <Text style={styles.name}>
          {loadingNombre
            ? 'Cargando...'
            : nombre
              ? nombre
              : 'Nombre no disponible'}
        </Text>
      </View>

      {/* Sección: Datos Importantes */}
      <View style={styles.card}>
        <SectionHeader title="Datos Importantes" />
        <InfoRow label="Dui" value={dui} />
        <InfoRow label="Fecha de Nacimiento" value={fechaNacimiento} />
        <InfoRow label="Sexo" value={sexo} />
        <EditIcon onPress={() => router.push('/editar-datos-importantes')} />
      </View>

      {/* Sección: Datos Complementarios */}
      <View style={styles.card}>
        <SectionHeader title="Datos Complementarios" />
        <InfoRow label="Peso" value={peso} />
        <InfoRow label="Altura" value={altura} />
        <InfoRow label="Tipo de Sangre" value={tipoSangre} />
        <InfoRow label="Dirección" value={direccion} />
        <InfoRow label="Teléfono" value={telefono} />
        <EditIcon onPress={() => router.push('/editar-datos-complementarios')} />
      </View>

      {/* Sección: Información Importante */}
      <View style={styles.card}>
        <SectionHeader title="Información Importante" />
        <InfoRow label="Alergias" value={alergias} />
        <InfoRow label="Medicamentos" value={medicamentos} />
        <InfoRow label="Condición Médica" value={condicion} />
        <EditIcon onPress={() => router.push('/editar-info-medica')} />
      </View>

      {/* Sección: Contacto de Emergencia */}
      <View style={styles.card}>
        <SectionHeader title="Contacto de Emergencia" />
        <InfoRow label="Nombre" value={contactoNombre} />
        <InfoRow label="Parentesco" value={contactoParentesco} />
        <InfoRow label="Tipo de Sangre" value={contactoTipoSangre} />
        <InfoRow label="Teléfono" value={contactoTelefono} />
        <EditIcon onPress={() => router.push('/editar-contacto-emergencia')} />
      </View>

      {/* Botón para guardar cambios */}
      <TouchableOpacity style={styles.button} onPress={guardarDatosUsuario}>
        <Text style={styles.buttonText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// 🔹 Componentes reutilizables
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const SectionHeader = ({ title }: { title: string }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const EditIcon = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.editIcon} onPress={onPress}>
    <Ionicons name="create-outline" size={18} color="#1f2a44" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1f2a44',
    padding: 16,
  },
  welcomeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 20,
    marginBottom: 20,
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  welcomeIcon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1f2a44',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
    color: '#1f2a44',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: {
    fontWeight: '500',
    color: '#333',
  },
  value: {
    color: '#555',
  },
  editIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  restrictedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1f2a44',
    padding: 20,
  },
  restrictedText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
