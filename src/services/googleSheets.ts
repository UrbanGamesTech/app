import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: import.meta.env.VITE_GOOGLE_PRIVATE_KEY,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const spreadsheetId = import.meta.env.VITE_GOOGLE_SHEETS_ID;

export async function updateIncidenciasSheet(incidencia: {
  fecha: string;
  equipo: string;
  goleador: string;
  rojas: number;
  amarillas: number;
}) {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'SHEET1!A:E',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          incidencia.fecha,
          incidencia.equipo,
          incidencia.goleador,
          incidencia.rojas,
          incidencia.amarillas
        ]]
      }
    });
  } catch (error) {
    console.error('Error al actualizar Google Sheets:', error);
    throw error;
  }
}

export async function getIncidencias() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'SHEET1!A2:E',
    });

    const rows = response.data.values || [];
    return rows.map(row => ({
      fecha: row[0],
      equipo: row[1],
      goleador: row[2],
      rojas: parseInt(row[3]) || 0,
      amarillas: parseInt(row[4]) || 0
    }));
  } catch (error) {
    console.error('Error al obtener datos de Google Sheets:', error);
    throw error;
  }
}