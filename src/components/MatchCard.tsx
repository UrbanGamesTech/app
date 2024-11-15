import React from 'react';
import { Match } from '../types/tournament';

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  return (
    <div className="match-card">
      <div className="match-info">
        <span className="match-time">{match.time}</span>
        {match.date && <span className="match-date">{match.date}</span>}
      </div>
      
      <div className="match-teams">
        <div className="team home">
          <span className="team-name">{match.homeTeam.name}</span>
        </div>
        
        <div className="match-vs">
          <span>VS</span>
          <span className="court-number">Cancha {match.court}</span>
        </div>
        
        <div className="team away">
          <span className="team-name">{match.awayTeam.name}</span>
        </div>
      </div>
      
      {match.group && (
        <div className="match-group">
          Grupo {match.group.split('-')[1]}
        </div>
      )}
    </div>
  );
}