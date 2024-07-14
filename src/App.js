import React, { useState, useCallback, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
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
  const [bracket, setBracket] = useState(() => {
    const savedBracket = localStorage.getItem('tournament-bracket');
    return savedBracket ? JSON.parse(savedBracket) : initialBracket;
  });

  const customEmojiCategories = [
    {
      name: 'Flags',
      category: 'flags',
    },
  ];

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentTeam, setCurrentTeam] = useState({ roundIndex: 0, matchIndex: 0 });
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('tournament-mode') || 'play';
  });
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('tournament-bracket', JSON.stringify(bracket));
  }, [bracket]);

  useEffect(() => {
    localStorage.setItem('tournament-mode', mode);
  }, [mode]);

  const handleTeamClick = (roundIndex, matchIndex) => {
    if (mode === 'edit') {
      setCurrentTeam({ roundIndex, matchIndex });
      setShowEmojiPicker(true);
    } else {
      if (roundIndex === bracket.length - 1) return; // Final round reached

      const newBracket = [...bracket];
      const winner = bracket[roundIndex][matchIndex];
      const nextRoundIndex = roundIndex + 1;
      const nextMatchIndex = Math.floor(matchIndex / 2);

      newBracket[nextRoundIndex][nextMatchIndex] = winner;
      setBracket(newBracket);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    const { roundIndex, matchIndex } = currentTeam;
    const newBracket = bracket.map((round, rIndex) => 
      round.map((team, mIndex) => {
        if (rIndex === roundIndex && mIndex === matchIndex) {
          const currentName = team.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '').trim();
          return `${emojiObject.emoji} ${currentName}`;
        }
        return team;
      })
    );
    setBracket(newBracket);
    setShowEmojiPicker(false);
  };

  const handleClickOutside = useCallback((event) => {
    if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
      setShowEmojiPicker(false);
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="App">
      <h1>Susos Turnierapp</h1>
      <div className="mode-toggle">
        <button 
          className={mode === 'play' ? 'active' : ''}
          onClick={() => setMode('play')}
        >
    Spielen
        </button>
        <button 
          className={mode === 'edit' ? 'active' : ''}
          onClick={() => setMode('edit')}
        >
    Aussuchen
        </button>
      </div>
      <p>Tip: {mode === 'edit' ? "Click" : "Right-click"} on a team to add a country flag.</p>
      <div className="bracket">
        {bracket.map((round, roundIndex) => (
          <div key={roundIndex} className="round">
            {round.map((team, matchIndex) => (
              <div
                key={matchIndex}
                className="team"
                onClick={() => handleTeamClick(roundIndex, matchIndex)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  if (mode === 'play') handleTeamClick(roundIndex, matchIndex);
                }}
              >
                {team || 'TBD'}
              </div>
            ))}
          </div>
        ))}
      </div>
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="emoji-picker-container">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            categories={customEmojiCategories}
            searchPlaceholder="Search for a country flag..."
            autoFocusSearch={false}
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
