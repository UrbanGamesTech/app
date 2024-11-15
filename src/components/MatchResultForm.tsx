import React, { useState } from 'react';
import { Match, MatchResult } from '../types/tournament';
import { updateIncidenciasSheet } from '../services/googleSheets';
import { X } from 'lucide-react';

interface MatchResultFormProps {
  match: Match;
  onSave: (result: MatchResult) => void;
  onClose: () => void;
}

export function MatchResultForm({ match, onSave, onClose }: MatchResultFormProps) {
  // ... (resto del estado igual)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-extrabold text-yellow-500">
              RESULTADO DEL PARTIDO
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8 mb-8">
            <div className="text-center space-y-4">
              <p className="text-xl font-bold text-white">{match.homeTeam.name}</p>
              <input
                type="number"
                min="0"
                value={homeGoals}
                onChange={(e) => setHomeGoals(parseInt(e.target.value) || 0)}
                className="input input-lg text-center w-24 mx-auto font-bold text-2xl"
              />
            </div>

            <div className="text-center flex items-center justify-center">
              <span className="text-3xl font-bold text-yellow-500">VS</span>
            </div>

            <div className="text-center space-y-4">
              <p className="text-xl font-bold text-white">{match.awayTeam.name}</p>
              <input
                type="number"
                min="0"
                value={awayGoals}
                onChange={(e) => setAwayGoals(parseInt(e.target.value) || 0)}
                className="input input-lg text-center w-24 mx-auto font-bold text-2xl"
              />
            </div>
          </div>

          <div className="space-y-8">
            {/* Goleadores */}
            <div>
              <h4 className="text-xl font-bold text-yellow-500 mb-4">GOLEADORES</h4>
              <div className="space-y-3">
                {scorers.map((scorer, index) => (
                  <div key={scorer.playerId} className="flex items-center gap-4">
                    <input
                      type="text"
                      value={scorer.playerName}
                      onChange={(e) => {
                        const newScorers = [...scorers];
                        newScorers[index].playerName = e.target.value.toUpperCase();
                        setScorers(newScorers);
                      }}
                      placeholder="NOMBRE DEL JUGADOR"
                      className="input input-lg flex-1"
                    />
                    <input
                      type="number"
                      min="1"
                      value={scorer.goals}
                      onChange={(e) => {
                        const newScorers = [...scorers];
                        newScorers[index].goals = parseInt(e.target.value) || 1;
                        setScorers(newScorers);
                      }}
                      className="input input-sm w-20 text-center"
                    />
                    <button
                      type="button"
                      onClick={() => setScorers(scorers.filter((_, i) => i !== index))}
                      className="btn btn-danger h-10 w-10 p-0 flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-4 mt-4">
                  <button
                    type="button"
                    onClick={() => addScorer(match.homeTeam.id)}
                    className="btn btn-secondary flex-1"
                  >
                    + {match.homeTeam.name}
                  </button>
                  <button
                    type="button"
                    onClick={() => addScorer(match.awayTeam.id)}
                    className="btn btn-secondary flex-1"
                  >
                    + {match.awayTeam.name}
                  </button>
                </div>
              </div>
            </div>

            {/* Tarjetas */}
            <div>
              <h4 className="text-xl font-bold text-yellow-500 mb-4">TARJETAS</h4>
              <div className="space-y-3">
                {cards.map((card, index) => (
                  <div key={card.playerId} className="flex items-center gap-4">
                    <input
                      type="text"
                      value={card.playerName}
                      onChange={(e) => {
                        const newCards = [...cards];
                        newCards[index].playerName = e.target.value.toUpperCase();
                        setCards(newCards);
                      }}
                      placeholder="NOMBRE DEL JUGADOR"
                      className="input input-lg flex-1"
                    />
                    <select
                      value={card.type}
                      onChange={(e) => {
                        const newCards = [...cards];
                        newCards[index].type = e.target.value as 'yellow' | 'red';
                        setCards(newCards);
                      }}
                      className="input input-sm w-32"
                    >
                      <option value="yellow">AMARILLA</option>
                      <option value="red">ROJA</option>
                    </select>
                    <input
                      type="number"
                      min="1"
                      max="90"
                      value={card.minute}
                      onChange={(e) => {
                        const newCards = [...cards];
                        newCards[index].minute = parseInt(e.target.value) || 1;
                        setCards(newCards);
                      }}
                      className="input input-sm w-20 text-center"
                      placeholder="Min"
                    />
                    <button
                      type="button"
                      onClick={() => setCards(cards.filter((_, i) => i !== index))}
                      className="btn btn-danger h-10 w-10 p-0 flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-4 mt-4">
                  <button
                    type="button"
                    onClick={() => addCard(match.homeTeam.id)}
                    className="btn btn-secondary flex-1"
                  >
                    + {match.homeTeam.name}
                  </button>
                  <button
                    type="button"
                    onClick={() => addCard(match.awayTeam.id)}
                    className="btn btn-secondary flex-1"
                  >
                    + {match.awayTeam.name}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button type="submit" className="btn btn-primary w-full text-lg">
              GUARDAR RESULTADO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}