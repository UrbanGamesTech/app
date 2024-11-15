import React from 'react';
import { Award, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getEstadisticas } from '../services/api';

export function PlayerStats() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['estadisticas'],
    queryFn: getEstadisticas,
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  if (isLoading) {
    return <div className="text-center py-8">Cargando estadísticas...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error al cargar las estadísticas
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Goleadores */}
      <div className="card p-6">
        <h2 className="section-header flex items-center justify-center gap-2 mb-6">
          <Award className="w-6 h-6" />
          TABLA DE GOLEADORES
        </h2>
        <div className="overflow-x-auto">
          <table className="standings-table">
            <thead>
              <tr>
                <th className="text-left">POS</th>
                <th className="text-left">JUGADOR</th>
                <th className="text-left">EQUIPO</th>
                <th>GOLES</th>
              </tr>
            </thead>
            <tbody>
              {stats?.goleadores.map((goleador, index) => (
                <tr key={`${goleador.nombre}-${goleador.equipo}`}>
                  <td>{index + 1}°</td>
                  <td className="font-semibold">{goleador.nombre}</td>
                  <td>{goleador.equipo}</td>
                  <td className="text-center font-bold">{goleador.goles}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tarjetas */}
      <div className="card p-6">
        <h2 className="section-header flex items-center justify-center gap-2 mb-6">
          <AlertTriangle className="w-6 h-6" />
          TABLA DE AMONESTACIONES
        </h2>
        <div className="overflow-x-auto">
          <table className="standings-table">
            <thead>
              <tr>
                <th className="text-left">JUGADOR</th>
                <th className="text-left">EQUIPO</th>
                <th>ROJAS</th>
                <th>AMARILLAS</th>
              </tr>
            </thead>
            <tbody>
              {stats?.tarjetas
                .filter(t => t.rojas > 0 || t.amarillas > 0)
                .map((tarjeta) => (
                  <tr key={`${tarjeta.nombre}-${tarjeta.equipo}`}>
                    <td className="font-semibold">{tarjeta.nombre}</td>
                    <td>{tarjeta.equipo}</td>
                    <td className="text-center text-red-500 font-bold">
                      {tarjeta.rojas}
                    </td>
                    <td className="text-center text-yellow-500 font-bold">
                      {tarjeta.amarillas}
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}