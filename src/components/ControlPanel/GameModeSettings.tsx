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
      <label htmlFor="gameModeSetting">Gamemode</label><br/>

      <select name="gameModeSetting" id="gameModeSetting" onChange={(event) => onGameModeChange(parseInt(event.target.value))}>
        {gameModes.map((mode, index) => (
          <option
            selected={mode === gameMode ? true : false}
            className={gameMode === mode ? "clicked" : ""}
            key={index}
            value={mode}
          >
            {gameModeToDisplay(mode)}
          </option>
        ))}
      </select>

      {/* {gameModes.map((mode, index) => (
        <button
          className={gameMode === mode ? "clicked" : ""}
          key={index}
          onClick={() => onGameModeChange(mode)}
        >
          {gameModeToDisplay(mode)}
        </button>
      ))} */}
    </div>
  )
}


export default GameModeSettings;
