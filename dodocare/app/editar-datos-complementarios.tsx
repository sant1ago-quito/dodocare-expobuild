// app/editar-datos-complementarios.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

export default function EditarDatosComplementarios() {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [sangre, setSangre] = useState('O+');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');

  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={64} color="#1f2a44" />
        <Text style={styles.name}>Javier Alejandro{"\n"}Rivas Perla</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>Datos Complementarios</Text>
          <TouchableOpacity>
            <Ionicons name="save-outline" size={24} color="#00c853" />
          </TouchableOpacity>
        </View>

        <LabelInput
          label="Peso"
          placeholder="Ejemplo: 176.37"
          value={peso}
          onChangeText={setPeso}
          suffix="Libras"
        />

        <LabelInput
          label="Altura"
          placeholder="Ejemplo: 1.82"
          value={altura}
          onChangeText={setAltura}
          suffix="Metros"
        />

        <Text style={styles.label}>Tipo de Sangre</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={sangre}
            onValueChange={(itemValue) => setSangre(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Tipo O+ (O Positivo)" value="O+" />
            <Picker.Item label="Tipo O- (O Negativo)" value="O-" />
            <Picker.Item label="Tipo A+" value="A+" />
            <Picker.Item label="Tipo A-" value="A-" />
            <Picker.Item label="Tipo B+" value="B+" />
            <Picker.Item label="Tipo B-" value="B-" />
            <Picker.Item label="Tipo AB+" value="AB+" />
            <Picker.Item label="Tipo AB-" value="AB-" />
          </Picker>
        </View>

        <LabelInput
          label="Dirección"
          placeholder="Ejemplo: Colonia Milagro de la Paz"
          value={direccion}
          onChangeText={setDireccion}
        />

        <LabelInput
          label="Teléfono"
          placeholder="Ejemplo: 7682-8282"
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
  suffix,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  suffix?: string;
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
      {suffix && <Text style={styles.suffix}>{suffix}</Text>}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  suffix: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  pickerContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    marginBottom: 12,
  },
  picker: {
    height: 44,
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
