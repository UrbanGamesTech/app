import React from 'react';

interface QuickTeamGeneratorProps {
  totalTeams: number;
  setTotalTeams: (value: number) => void;
  courts: number;
  setCourts: (value: number) => void;
  onGenerate: () => void;
}

export function QuickTeamGenerator({
  totalTeams,
  setTotalTeams,
  courts,
  setCourts,
  onGenerate
}: QuickTeamGeneratorProps) {
  return (
    <div className="bg-black text-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-yellow-500 text-center mb-6">CONFIGURACIÓN DEL TORNEO</h2>
      <div className="flex flex-col items-center gap-4">
        <div className="w-full max-w-xs">
          <label className="block text-sm font-semibold text-yellow-500 mb-2">CANTIDAD DE EQUIPOS</label>
          <input
            type="number"
            min="3"
            value={totalTeams}
            onChange={(e) => setTotalTeams(Number(e.target.value))}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div className="w-full max-w-xs">
          <label className="block text-sm font-semibold text-yellow-500 mb-2">CANTIDAD DE CANCHAS</label>
          <input
            type="number"
            min="1"
            value={courts}
            onChange={(e) => setCourts(Number(e.target.value))}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <button
          onClick={onGenerate}
          className="w-full max-w-xs py-2 bg-yellow-500 text-black font-bold rounded-md hover:bg-yellow-600 transition-colors"
        >
          CREAR TORNEO
        </button>
      </div>
    </div>
  );
}
