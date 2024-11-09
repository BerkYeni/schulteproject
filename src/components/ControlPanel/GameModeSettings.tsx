import React, { FC } from "react";
import { gameModes, gameModeToDisplay } from "../../utils";
import { GameMode, OnGameModeChange } from "../../interfaces";

interface GameModeSettingsProps {
  gameMode: GameMode;
  onGameModeChange: OnGameModeChange;
}

const GameModeSettings: FC<GameModeSettingsProps> = (props) => {
  const { gameMode, onGameModeChange } = props;

  return (
    <div className="gameModeSettings">
      {gameModes.map((mode, index) => (
        <button
          className={gameMode === mode ? "clicked" : ""}
          key={index}
          onClick={() => onGameModeChange(mode)}
        >
          {gameModeToDisplay(mode)}
        </button>
      ))}
    </div>
  )
}


export default GameModeSettings;
