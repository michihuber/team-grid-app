import React, { useState, useCallback, useRef } from 'react';
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
  const [bracket, setBracket] = useState(initialBracket);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentTeam, setCurrentTeam] = useState({ roundIndex: 0, matchIndex: 0 });
  const [editMode, setEditMode] = useState(false);
  const emojiPickerRef = useRef(null);

  const customEmojiCategories = [
    {
      name: 'Flags',
      category: 'flags',
    },
  ];

  const handleTeamClick = (roundIndex, matchIndex) => {
    if (editMode) {
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
      round.map((team, mIndex) => 
        (rIndex === roundIndex && mIndex === matchIndex) ? emojiObject.emoji : team
      )
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
      <h1>16-Team Single Elimination Tournament</h1>
      <div className="edit-toggle">
        <label>
          <input
            type="checkbox"
            checked={editMode}
            onChange={() => setEditMode(!editMode)}
          />
          Edit Mode
        </label>
      </div>
      <p>Tip: {editMode ? "Click" : "Right-click"} on a team name to add an emoji.</p>
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
                  if (!editMode) handleTeamClick(roundIndex, matchIndex);
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
