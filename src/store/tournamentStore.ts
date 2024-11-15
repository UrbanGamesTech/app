import create from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Match, Team, MatchResult } from '../types/tournament';
import { createIncidencia } from '../services/api';

interface TournamentStore {
  matches: Match[];
  teams: Team[];
  lastSync: string | null;
  isLoading: boolean;
  error: string | null;
  
  updateMatch: (matchId: string, result: MatchResult) => Promise<void>;
  setError: (error: string | null) => void;
}

export const useTournamentStore = create<TournamentStore>()(
  persist(
    (set, get) => ({
      matches: [],
      teams: [],
      lastSync: null,
      isLoading: false,
      error: null,

      updateMatch: async (matchId: string, result: MatchResult) => {
        try {
          set({ isLoading: true });

          const matches = get().matches.map(match => 
            match.id === matchId 
              ? { ...match, result, status: 'completed' } 
              : match
          );

          const match = matches.find(m => m.id === matchId)!;
          const fecha = format(new Date(), 'dd/MM/yyyy', { locale: es });

          // Registrar goleadores
          for (const scorer of result.scorers) {
            await createIncidencia({
              fecha,
              equipo: scorer.teamId === match.homeTeam.id ? match.homeTeam.name : match.awayTeam.name,
              goleador: scorer.playerName,
              rojas: 0,
              amarillas: 0
            });
          }

          // Registrar tarjetas
          for (const card of result.cards) {
            await createIncidencia({
              fecha,
              equipo: card.teamId === match.homeTeam.id ? match.homeTeam.name : match.awayTeam.name,
              goleador: card.playerName,
              rojas: card.type === 'red' ? 1 : 0,
              amarillas: card.type === 'yellow' ? 1 : 0
            });
          }

          set({ 
            matches,
            lastSync: new Date().toISOString(),
            isLoading: false 
          });
        } catch (error) {
          set({ error: 'Error al actualizar el partido', isLoading: false });
          console.error('Error en updateMatch:', error);
        }
      },

      setError: (error) => set({ error })
    }),
    {
      name: 'tournament-storage',
      partialize: (state) => ({ 
        matches: state.matches,
        teams: state.teams,
        lastSync: state.lastSync
      })
    }
  )
);