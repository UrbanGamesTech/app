import { initializeGoogleSheets } from '../src/services/googleSheets';
import dotenv from 'dotenv';

dotenv.config();

async function setup() {
  try {
    console.log('Configurando conexión con Google Sheets...');
    const doc = await initializeGoogleSheets();
    
    // Verificar y crear hoja si no existe
    if (!doc.sheetsByTitle['SHEET1']) {
      console.log('Creando hoja de cálculo...');
      await doc.addSheet({ 
        title: 'SHEET1',
        headerValues: ['FECHA', 'EQUIPO', 'GOLEADOR', 'ROJAS', 'AMARILLAS']
      });
    }
    
    console.log('Configuración completada exitosamente');
  } catch (error) {
    console.error('Error en la configuración:', error);
    process.exit(1);
  }
}

setup();