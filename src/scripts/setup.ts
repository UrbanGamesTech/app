import { google } from 'googleapis';

async function setup() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.VITE_GOOGLE_PRIVATE_KEY,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.VITE_GOOGLE_SHEETS_ID;

    // Verificar si la hoja existe
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const sheet = response.data.sheets?.find(s => 
      s.properties?.title === 'SHEET1'
    );

    if (!sheet) {
      // Crear nueva hoja con encabezados
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: 'SHEET1',
              }
            }
          }]
        }
      });

      // Agregar encabezados
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'SHEET1!A1:E1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [['FECHA', 'EQUIPO', 'GOLEADOR', 'ROJAS', 'AMARILLAS']]
        }
      });
    }

    console.log('Configuración completada exitosamente');
  } catch (error) {
    console.error('Error en la configuración:', error);
    process.exit(1);
  }
}

setup();