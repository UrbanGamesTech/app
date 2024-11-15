import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.tournament-manager.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface Incidencia {
  fecha: string;
  equipo: string;
  goleador: string;
  rojas: number;
  amarillas: number;
}

export async function getIncidencias(): Promise<Incidencia[]> {
  const { data } = await api.get<Incidencia[]>('/incidencias');
  return data;
}

export async function createIncidencia(incidencia: Incidencia): Promise<void> {
  await api.post('/incidencias', incidencia);
}

export async function getEstadisticas() {
  const { data } = await api.get('/estadisticas');
  return data;
}