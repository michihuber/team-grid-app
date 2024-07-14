import React, { useState, useCallback } from 'react';
import './App.css';

const initialBracket = [
  ['Team 1', 'Team 2', 'Team 3', 'Team 4', 'Team 5', 'Team 6', 'Team 7', 'Team 8',
   'Team 9', 'Team 10', 'Team 11', 'Team 12', 'Team 13', 'Team 14', 'Team 15', 'Team 16'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', ''],
  ['', ''],
  ['']
];

function App() {
  const [bracket, setBracket] = useState(initialBracket);

  const handleTeamClick = (roundIndex, matchIndex) => {
    if (roundIndex === bracket.length - 1) return; // Final round reached

    const newBracket = [...bracket];
    const winner = bracket[roundIndex][matchIndex];
    const nextRoundIndex = roundIndex + 1;
    const nextMatchIndex = Math.floor(matchIndex / 2);

    newBracket[nextRoundIndex][nextMatchIndex] = winner;
    setBracket(newBracket);
  };

  const handleContextMenu = useCallback((event, roundIndex, matchIndex) => {
    event.preventDefault();
    const newName = prompt('Enter new team name:');
    if (newName !== null) {
      const newBracket = bracket.map((round, rIndex) => 
        round.map((team, mIndex) => 
          (rIndex === roundIndex && mIndex === matchIndex) ? newName : team
        )
      );
      setBracket(newBracket);
    }
  }, [bracket]);

  return (
    <div className="App">
      <h1>16-Team Single Elimination Tournament</h1>
      <div className="bracket">
        {bracket.map((round, roundIndex) => (
          <div key={roundIndex} className="round">
            {round.map((team, matchIndex) => (
              <div
                key={matchIndex}
                className="team"
                onClick={() => handleTeamClick(roundIndex, matchIndex)}
                onContextMenu={(e) => handleContextMenu(e, roundIndex, matchIndex)}
              >
                {team || 'TBD'}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
