import React, { useState } from 'react';
import { Users, Calendar, Award, Edit2, Save, X } from 'lucide-react';
import { Fixture, Match, Team } from '../types/tournament';
import { MatchResultForm } from './MatchResultForm';
import { MatchCard } from './MatchCard';

interface FixtureDisplayProps {
  fixture: Fixture;
  onMatchUpdate?: (match: Match) => void;
  onTeamNameUpdate?: (teamId: string, newName: string) => void;
}

function getUniqueTimeSlots(matches: any[]): string[] {
  return Array.from(new Set(matches.map((m) => m.time))).sort();
}

export function FixtureDisplay({
  fixture,
  onMatchUpdate,
  onTeamNameUpdate,
}: FixtureDisplayProps) {
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const handleTeamNameEdit = (teamId: string, currentName: string) => {
    setEditingTeam(teamId);
    setNewTeamName(currentName);
  };

  const handleTeamNameSave = (teamId: string) => {
    if (onTeamNameUpdate && newTeamName.trim()) {
      onTeamNameUpdate(teamId, newTeamName.trim());
    }
    setEditingTeam(null);
    setNewTeamName('');
  };

  const handleMatchClick = (match: Match) => {
    setSelectedMatch(match);
  };

  const handleMatchResultSave = (result: MatchResult) => {
    if (onMatchUpdate && selectedMatch) {
      onMatchUpdate({
        ...selectedMatch,
        result,
        status: 'completed',
      });
    }
    setSelectedMatch(null);
  };

  return (
    <div className="space-y-12 animate-[fadeIn_0.5s_ease-out]">
      {/* Grupos */}
      <section>
        <h3 className="section-header flex items-center justify-center gap-2 mb-8">
          <Users className="w-6 h-6" />
          GRUPOS DEL TORNEO
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {fixture.groups.map((group) => (
            <div key={group.id} className="group-card w-full max-w-xs">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-yellow-500" />
                <h4 className="group-title">GRUPO {group.id.split('-')[1]}</h4>
              </div>
              <ul className="space-y-2">
                {group.teams.map((team) => (
                  <li
                    key={team.id}
                    className="match-card flex items-center justify-between"
                  >
                    {editingTeam === team.id ? (
                      <div className="flex items-center gap-2 w-full">
                        <input
                          type="text"
                          value={newTeamName}
                          onChange={(e) => setNewTeamName(e.target.value)}
                          className="input flex-1"
                          autoFocus
                        />
                        <button
                          onClick={() => handleTeamNameSave(team.id)}
                          className="text-green-500 hover:text-green-600"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingTeam(null)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span>{team.name}</span>
                        <button
                          onClick={() => handleTeamNameEdit(team.id, team.name)}
                          className="text-yellow-500 hover:text-yellow-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Fixture */}
      <section>
        <h3 className="section-header flex items-center justify-center gap-2 mb-8">
          <Calendar className="w-6 h-6" />
          CALENDARIO DE PARTIDOS
        </h3>
        <div className="space-y-8">
          {fixture.rounds.map((round, roundIndex) => (
            <div key={roundIndex} className="card p-6">
              <h4 className="text-xl font-bold text-yellow-500 mb-4">
                FECHA {roundIndex + 1}
              </h4>
              <div className="overflow-x-auto">
                <table className="fixture-table">
                  <thead>
                    <tr>
                      <th className="rounded-tl-lg">HORARIO</th>
                      {Array.from({ length: fixture.courtCount }, (_, i) => (
                        <th
                          key={i}
                          className={
                            i === fixture.courtCount - 1 ? 'rounded-tr-lg' : ''
                          }
                        >
                          CANCHA {i + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {getUniqueTimeSlots(round).map((time, timeIndex) => {
                      const matchesInTimeSlot = round.filter(
                        (m) => m.time === time
                      );
                      return (
                        <tr key={time}>
                          <td className="font-semibold">{time}</td>
                          {Array.from(
                            { length: fixture.courtCount },
                            (_, courtIndex) => {
                              const match = matchesInTimeSlot.find(
                                (m) => m.court === courtIndex + 1
                              );
                              return (
                                <td key={courtIndex}>
                                  {match ? (
                                    <div
                                      className="flex flex-col items-center gap-2 cursor-pointer"
                                      onClick={() => handleMatchClick(match)}
                                    >
                                      <div className="flex items-center gap-4">
                                        <span className="font-semibold text-yellow-500">
                                          {match.homeTeam.name}
                                        </span>
                                        <div className="flex items-center gap-2">
                                          <span>
                                            {match.result
                                              ? match.result.homeGoals
                                              : '-'}
                                          </span>
                                          <span>-</span>
                                          <span>
                                            {match.result
                                              ? match.result.awayGoals
                                              : '-'}
                                          </span>
                                        </div>
                                        <span className="font-semibold text-yellow-500">
                                          {match.awayTeam.name}
                                        </span>
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-gray-600">-</span>
                                  )}
                                </td>
                              );
                            }
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Match Result Form Modal */}
      {selectedMatch && (
        <div className="modal">
          <MatchResultForm
            match={selectedMatch}
            onSave={handleMatchResultSave}
            players={[
              ...selectedMatch.homeTeam.players,
              ...selectedMatch.awayTeam.players,
            ]}
          />
        </div>
      )}
    </div>
  );
}
