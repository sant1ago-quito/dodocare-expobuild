import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, addDoc, DocumentData, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase'; // Ajusta la ruta si es necesario

export default function AppointmentScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<DocumentData | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [confirmedAppointments, setConfirmedAppointments] = useState<
    { doctor: string; date: string }[]
  >([]);
  const [doctors, setDoctors] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const querySnapshot = await getDocs(collection(db, 'doctors'));
        const docs = querySnapshot.docs.map(doc => doc.data());
        setDoctors(docs);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const appointments = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            doctor: data.doctor,
            date: data.date,
          };
        });
        setConfirmedAppointments(appointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    }
    fetchAppointments();
  }, []);

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(search.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const handleConfirm = async () => {
    if (selectedDoctor && selectedDate) {
      try {
        await addDoc(collection(db, 'appointments'), {
          doctor: selectedDoctor.name,
          specialty: selectedDoctor.specialty,
          date: selectedDate,
          createdAt: new Date().toISOString(),
        });
        // Recarga las citas desde Firebase
        const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const appointments = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            doctor: data.doctor,
            date: data.date,
          };
        });
        setConfirmedAppointments(appointments);
      } catch (error) {
        console.error('Error guardando la cita en Firebase:', error);
      }
      setSelectedDoctor(null);
      setSelectedDate('');
      setSearch('');
    }
  };

  const handleEmergencyCall = () => {
    Linking.openURL('tel:134');
  };

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyCall}>
        <Text style={styles.emergencyText}>Llamada de Emergencia 134</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Paso 1: Selección del doctor */}
        <View style={styles.card}>
          <Text style={styles.stepTitle}>Paso 1: Selecciona al Especialista</Text>
          <TextInput
            style={styles.searchBar}
            placeholder="Buscar por nombre o especialidad..."
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
          />
          {loading ? (
            <Text style={styles.text}>Cargando doctores...</Text>
          ) : (
            filteredDoctors.map((doctor, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.doctorCard,
                  selectedDoctor?.name === doctor.name && styles.selectedDoctor,
                ]}
                onPress={() => setSelectedDoctor(doctor)}
              >
                {/* Puedes agregar un ícono aquí si quieres */}
                <View style={styles.avatarPlaceholder}>
                  <Text style={{ fontSize: 32 }}>👨‍⚕️</Text>
                </View>
                <View>
                  <Text style={styles.name}>{doctor.name}</Text>
                  <Text style={styles.specialty}>{doctor.specialty}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Paso 2: Selección de fecha */}
        {selectedDoctor && (
          <View style={styles.card}>
            <Text style={styles.stepTitle}>Paso 2: Selecciona el Día</Text>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={{
                ...(selectedDate && {
                  [selectedDate]: {
                    selected: true,
                    selectedColor: '#4CAF50',
                  },
                }),
              }}
              minDate={new Date().toISOString().split('T')[0]}
            />
          </View>
        )}

        {/* Confirmación */}
        {selectedDoctor && selectedDate && (
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmText}>Solicitar Cita</Text>
          </TouchableOpacity>
        )}

        {/* Lista de citas confirmadas */}
        <View style={styles.card}>
          <Text style={styles.stepTitle}>✅ Citas Confirmadas</Text>
          {confirmedAppointments.length > 0 ? (
            confirmedAppointments.map((appt, index) => (
              <View key={index} style={{ marginBottom: 8 }}>
                <Text style={styles.text}>
                  Cita con <Text style={{ fontWeight: 'bold' }}>{appt.doctor}</Text>
                </Text>
                <Text style={styles.text}>
                  Fecha: <Text style={{ fontWeight: 'bold' }}>{appt.date}</Text>
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.text}>No tenemos registros de citas reservadas.</Text>
          )}
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#1f2a44',
    paddingTop: 60,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
    marginTop: 30,
    paddingBottom: 40,
  },
   emergencyButton: {
    position: 'absolute',
    top: 40, // Espacio desde el borde superior
    right: 10,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10, // Menor o cuadrado
    zIndex: 10,
  },
  emergencyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: '100%',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1f2a44',
  },
  searchBar: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    width: '100%',
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  selectedDoctor: {
    backgroundColor: '#c8e6c9',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
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
  text: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  backText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
