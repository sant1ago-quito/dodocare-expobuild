import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ComponentProps } from 'react';
import { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';

// Define todos los íconos que necesitas en tu app
type AppIcons = 
  | 'calendar'         // Agendar cita
  | 'medical-bag'      // Historial médico (usar 'medical-services' en Material)
  | 'people'           // Directorio médico
  | 'medication'       // Recetas médicas
  | 'healing'          // Incapacidades
  | 'local-hospital'   // Información del hospital
  | 'logout'           // Botón de salir
  | 'home'             // Inicio
  | 'send'             // Explorar
  | 'person'           // Perfil
  | 'chevron-left'     // Navegación
  | 'info'             // Información
  | 'settings'         // Configuración
  | 'notifications';   // Notificaciones

// Mapeo de nombres personalizados a Material Icons
const ICON_MAPPING: Record<AppIcons, ComponentProps<typeof MaterialIcons>['name']> = {
  'calendar': 'calendar-today',
  'medical-bag': 'medical-services',
  'people': 'people',
  'medication': 'medication',
  'healing': 'healing',
  'local-hospital': 'local-hospital',
  'logout': 'logout',
  'home': 'home',
  'send': 'send',
  'person': 'person',
  'chevron-left': 'chevron-left',
  'info': 'info',
  'settings': 'settings',
  'notifications': 'notifications'
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight,
}: {
  name: AppIcons;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: 'unspecified' | 'ultralight' | 'thin' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'heavy' | 'black';
}) {
  return (
    <MaterialIcons 
      name={ICON_MAPPING[name]} 
      size={size} 
      color={color} 
      style={[
        style,
        weight && { fontWeight: weightToFontWeight(weight) }
      ]}
    />
  );
}

// Helper para convertir peso de SF Symbol a fontWeight compatible con React Native
function weightToFontWeight(
  weight: 'unspecified' | 'ultralight' | 'thin' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'heavy' | 'black'
): TextStyle['fontWeight'] {
  const mapping: Record<typeof weight, TextStyle['fontWeight']> = {
    'unspecified': undefined,
    'ultralight': 200,
    'thin': 300,
    'light': 300,
    'regular': 400,
    'medium': 500,
    'semibold': 600,
    'bold': 700,
    'heavy': 800,
    'black': 900,
  };
  return mapping[weight];
}

export type IconSymbolName = AppIcons;
