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
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  doc,
  updateDoc,
  DocumentData,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase';
import { useAuth } from '../AuthContext';

type Appointment = {
  id: string;
  doctor: string;
  date: string;
  userId: string;
};

export default function AppointmentScreen() {
  const { role } = useAuth();
  const navigation = useNavigation();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<DocumentData | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [confirmedAppointments, setConfirmedAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [reschedulingIndex, setReschedulingIndex] = useState<number | null>(null);
  const [newDate, setNewDate] = useState('');

  // 🔒 Bloqueo para invitados
  if (role === 'guest') {
    return (
      <View style={styles.restrictedContainer}>
        <Text style={styles.restrictedText}>
          Esta sección no está disponible para usuarios invitados.
        </Text>
      </View>
    );
  }

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'doctors'));
        const docs = querySnapshot.docs.map(docSnap => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            name: data.name ?? data.nombre ?? '',
            specialty: data.specialty ?? data.especialidad ?? '',
            email: data.email ?? '',
          };
        });
        setDoctors(docs);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!currentUser) return;
      try {
        const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const appointments: Appointment[] = querySnapshot.docs
          .map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              doctor: data.doctor,
              date: data.date,
              userId: data.userId,
            };
          })
          .filter(appt => appt.userId === currentUser.uid);
        setConfirmedAppointments(appointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    fetchAppointments();
  }, [currentUser]);

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(search.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const handleDayPress = (day: any) => setSelectedDate(day.dateString);

  const handleConfirm = async () => {
    if (!selectedDoctor || !selectedDate || !currentUser) return;

    try {
      await addDoc(collection(db, 'appointments'), {
        doctor: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        date: selectedDate,
        createdAt: new Date().toISOString(),
        userId: currentUser.uid,
      });

      // Refresca la lista
      const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const appointments: Appointment[] = querySnapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            doctor: data.doctor,
            date: data.date,
            userId: data.userId,
          };
        })
        .filter(appt => appt.userId === currentUser.uid);
      setConfirmedAppointments(appointments);

      setSelectedDoctor(null);
      setSelectedDate('');
      setSearch('');
    } catch (error) {
      console.error('Error guardando la cita:', error);
    }
  };

  const handleEmergencyCall = () => Linking.openURL('tel:134');

  const handleReschedule = (appt: Appointment, index: number) => {
    setReschedulingIndex(index);
    setNewDate('');
  };

  const confirmReschedule = async (appt: Appointment) => {
    if (!newDate) return;

    try {
      await updateDoc(doc(db, 'appointments', appt.id), { date: newDate });

      // Refresca la lista
      const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const appointments: Appointment[] = querySnapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            doctor: data.doctor,
            date: data.date,
            userId: data.userId,
          };
        })
        .filter(a => a.userId === currentUser?.uid);
      setConfirmedAppointments(appointments);

      setReschedulingIndex(null);
      setNewDate('');
    } catch (error) {
      console.error('Error reprogramando la cita:', error);
    }
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
              markedDates={selectedDate ? { [selectedDate]: { selected: true, selectedColor: '#4CAF50' } } : {}}
              minDate={new Date().toISOString().split('T')[0]}
            />
          </View>
        )}

        {/* Confirmación */}
        {selectedDoctor && selectedDate && (
          <TouchableOpacity style={[styles.confirmButton, { alignSelf: 'stretch' }]} onPress={handleConfirm}>
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
                <TouchableOpacity
                  style={{ marginTop: 4, backgroundColor: '#FFC107', borderRadius: 6, padding: 6 }}
                  onPress={() => handleReschedule(appt, index)}
                >
                  <Text style={{ color: '#1f2a44', fontWeight: 'bold' }}>Reprogramar</Text>
                </TouchableOpacity>

                {reschedulingIndex === index && (
                  <View>
                    <Calendar
                      onDayPress={day => setNewDate(day.dateString)}
                      markedDates={newDate ? { [newDate]: { selected: true, selectedColor: '#FF9800' } } : {}}
                      minDate={new Date().toISOString().split('T')[0]}
                    />
                    <TouchableOpacity
                      style={{ marginTop: 8, backgroundColor: '#4CAF50', borderRadius: 6, padding: 8, alignSelf: 'stretch' }}
                      onPress={() => confirmReschedule(appt)}
                      disabled={!newDate}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Confirmar nueva fecha</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.text}>No tenemos registros de citas reservadas.</Text>
          )}
        </View>

        {/* Botón Volver */}
        <TouchableOpacity style={[styles.backButton, { alignSelf: 'stretch' }]} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: '#1f2a44', paddingTop: 60 },
  contentContainer: { paddingBottom: 40, paddingHorizontal: 16 },
  emergencyButton: { position: 'absolute', top: 40, right: 10, backgroundColor: '#4CAF50', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, zIndex: 10 },
  emergencyText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 20 },
  stepTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#1f2a44' },
  searchBar: { backgroundColor: '#f0f0f0', borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 12, width: '100%' },
  doctorCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eee', borderRadius: 10, padding: 10, marginBottom: 10 },
  selectedDoctor: { backgroundColor: '#c8e6c9' },
  avatarPlaceholder: { width: 50, height: 50, borderRadius: 25, marginRight: 12, backgroundColor: '#e0e0e0', alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: 'bold', color: '#1f2a44' },
  specialty: { fontSize: 14, color: '#555' },
  text: { fontSize: 16, color: '#555', marginBottom: 4 },
  confirmButton: { backgroundColor: '#4CAF50', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  confirmText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
  backButton: { backgroundColor: '#4CAF50', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  backText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
  restrictedContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1f2a44', padding: 20 },
  restrictedText: { color: '#fff', fontSize: 18, textAlign: 'center' },
});
