import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

type Doctor = {
  id: string;
  nombre: string;
  especialidad: string;
  email: string;
  numero?: number;
};

export default function ReportsScreen() {
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [especialidades, setEspecialidades] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'doctors'));
      const docs: Doctor[] = [];
      const especialidadCount: { [key: string]: number } = {};
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data() as Doctor;
        docs.push({ ...data, id: docSnap.id });
        if (data.especialidad) {
          especialidadCount[data.especialidad] = (especialidadCount[data.especialidad] || 0) + 1;
        }
      });
      setDoctores(docs);
      setEspecialidades(especialidadCount);
      setLoading(false);
    };
    fetchDoctors();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reportes</Text>
      {loading ? (
        <ActivityIndicator color="#fff" size="large" style={{ marginTop: 30 }} />
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Total de médicos registrados:</Text>
            <Text style={styles.cardNumber}>{doctores.length}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Médicos por especialidad:</Text>
            <FlatList
              data={Object.entries(especialidades)}
              keyExtractor={([especialidad]) => especialidad}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <Text style={styles.especialidad}>{item[0]}</Text>
                  <Text style={styles.cantidad}>{item[1]}</Text>
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No hay especialidades registradas.</Text>
              }
            />
          </View>
        </>
      )}
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 16,
    color: '#2D3748',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardNumber: {
    fontSize: 32,
    color: '#4CAF50',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  especialidad: {
    color: '#2D3748',
    fontSize: 15,
  },
  cantidad: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 15,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
});