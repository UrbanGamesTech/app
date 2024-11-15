import React, { useState, useCallback } from 'react';
import { Trophy, Calendar, Users, Layout, DollarSign, Table, Award } from 'lucide-react';
import { Team, Fixture, Match } from './types/tournament';
import { generateGroups, generateFixture } from './utils/fixtureGenerator';
import { generateTeams } from './utils/teamGenerator';
import { FixtureDisplay } from './components/FixtureDisplay';
import { TournamentSetup } from './components/TournamentSetup';
import { MatchResultForm } from './components/MatchResultForm';
import { PlayerStats } from './components/PlayerStats';
import { BudgetManager } from './components/BudgetManager';
import { GroupStandings } from './components/GroupStandings';
import { calculateStandings } from './utils/standingsCalculator';

function App() {
  const [activeTab, setActiveTab] = useState('setup');
  const [teams, setTeams] = useState<Team[]>([]);
  const [fixture, setFixture] = useState<Fixture | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const handleGenerateTournament = (config: {
    totalTeams: number;
    courts: number;
    teamsPerGroup: number;
    tournamentName: string;
  }) => {
    const generatedTeams = generateTeams(config.totalTeams);
    setTeams(generatedTeams);
    
    const groups = generateGroups(generatedTeams, config.teamsPerGroup);
    const newFixture = generateFixture(groups, config.courts);
    newFixture.tournamentName = config.tournamentName;
    setFixture(newFixture);
    setActiveTab('fixture');
  };

  const handleTeamNameUpdate = useCallback((teamId: string, newName: string) => {
    if (!fixture) return;

    // Update teams in groups
    const updatedGroups = fixture.groups.map(group => ({
      ...group,
      teams: group.teams.map(team => 
        team.id === teamId ? { ...team, name: newName } : team
      )
    }));

    // Update teams in matches
    const updatedRounds = fixture.rounds.map(round =>
      round.map(match => ({
        ...match,
        homeTeam: match.homeTeam.id === teamId 
          ? { ...match.homeTeam, name: newName }
          : match.homeTeam,
        awayTeam: match.awayTeam.id === teamId
          ? { ...match.awayTeam, name: newName }
          : match.awayTeam
      }))
    );

    setFixture({
      ...fixture,
      groups: updatedGroups,
      rounds: updatedRounds
    });
  }, [fixture]);

  const handleMatchUpdate = useCallback((updatedMatch: Match) => {
    if (!fixture) return;

    const updatedRounds = fixture.rounds.map(round =>
      round.map(match => match.id === updatedMatch.id ? updatedMatch : match)
    );

    // Recalculate standings
    const updatedGroups = fixture.groups.map(group => ({
      ...group,
      standings: calculateStandings(
        group.teams,
        updatedRounds.flat().filter(match => 
          group.teams.some(team => team.id === match.homeTeam.id || team.id === match.awayTeam.id)
        )
      )
    }));

    setFixture({
      ...fixture,
      rounds: updatedRounds,
      groups: updatedGroups
    });
  }, [fixture]);

  return (
    <div className="min-h-screen bg-[var(--bg-dark)]">
      <header className="bg-black border-b border-yellow-500/20 p-4">
        <div className="container mx-auto flex flex-col items-center justify-center">
          <div className="flex items-center gap-4 mb-4">
            <Trophy className="w-12 h-12 text-yellow-500" />
            <h1 className="text-4xl font-bold text-yellow-500">
              {fixture?.tournamentName || 'URBAN GAMES'}
            </h1>
          </div>
          
          <nav className="flex gap-2 overflow-x-auto w-full max-w-3xl justify-center">
            {[
              { id: 'setup', icon: <Users />, label: 'CONFIGURACIÓN' },
              { id: 'fixture', icon: <Calendar />, label: 'FIXTURE' },
              { id: 'standings', icon: <Award />, label: 'POSICIONES' },
              { id: 'stats', icon: <Trophy />, label: 'ESTADÍSTICAS' },
              { id: 'budget', icon: <DollarSign />, label: 'PRESUPUESTO' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                disabled={!fixture && tab.id !== 'setup'}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all
                  ${activeTab === tab.id 
                    ? 'bg-yellow-500 text-black font-bold' 
                    : 'text-gray-400 hover:text-yellow-500'}
                  ${!fixture && tab.id !== 'setup' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'setup' && (
          <TournamentSetup onGenerate={handleGenerateTournament} />
        )}
        
        {activeTab === 'fixture' && fixture && (
          <FixtureDisplay 
            fixture={fixture}
            onMatchUpdate={handleMatchUpdate}
            onTeamNameUpdate={handleTeamNameUpdate}
          />
        )}
        
        {activeTab === 'standings' && fixture && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fixture.groups.map(group => (
              <GroupStandings key={group.id} group={group} />
            ))}
          </div>
        )}
        
        {activeTab === 'stats' && fixture && (
          <PlayerStats 
            teams={teams}
          />
        )}
        
        {activeTab === 'budget' && fixture && (
          <BudgetManager 
            fixture={fixture}
          />
        )}
      </main>
    </div>
  );
}

export default App;