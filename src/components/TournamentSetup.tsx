import React, { useState } from 'react';
import { Users, Layout, Trophy } from 'lucide-react';

interface TournamentSetupProps {
  onGenerate: (config: {
    totalTeams: number;
    courts: number;
    teamsPerGroup: number;
    tournamentName: string;
  }) => void;
}

export function TournamentSetup({ onGenerate }: TournamentSetupProps) {
  const [totalTeams, setTotalTeams] = useState(8);
  const [courts, setCourts] = useState(2);
  const [teamsPerGroup, setTeamsPerGroup] = useState(4);
  const [tournamentName, setTournamentName] = useState('URBAN GAMES');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onGenerate({
      totalTeams,
      courts,
      teamsPerGroup,
      tournamentName
    });
    
    setIsGenerating(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
      <div className="card p-8">
        <h2 className="section-header flex items-center justify-center gap-2">
          <Trophy className="w-6 h-6" />
          CONFIGURACIÓN DEL TORNEO
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-yellow-500 mb-2">
              NOMBRE DEL TORNEO
            </label>
            <input
              type="text"
              value={tournamentName}
              onChange={(e) => setTournamentName(e.target.value)}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-500 mb-2">
              <Users className="w-4 h-4 inline mr-2" />
              CANTIDAD DE EQUIPOS
            </label>
            <input
              type="number"
              value={totalTeams}
              onChange={(e) => setTotalTeams(parseInt(e.target.value) || 0)}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-500 mb-2">
              <Layout className="w-4 h-4 inline mr-2" />
              CANTIDAD DE CANCHAS
            </label>
            <input
              type="number"
              value={courts}
              onChange={(e) => setCourts(parseInt(e.target.value) || 0)}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-500 mb-2">
              EQUIPOS POR GRUPO
            </label>
            <input
              type="number"
              value={teamsPerGroup}
              onChange={(e) => setTeamsPerGroup(parseInt(e.target.value) || 0)}
              className="input"
              required
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isGenerating}
        className={`btn btn-primary w-full ${isGenerating ? 'opacity-75 cursor-wait' : ''}`}
      >
        {isGenerating ? 'GENERANDO...' : 'CREAR TORNEO'}
      </button>
    </form>
  );
}