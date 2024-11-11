import React, { FC } from "react";
import { gameModes, gameModeToDisplay } from "../../utils";
import { GameMode, GameState, OnGameModeChange } from "../../interfaces";

interface GameModeSettingsProps {
  gameMode: GameMode;
  onGameModeChange: OnGameModeChange;
  gameState: GameState;
}

const GameModeSettings: FC<GameModeSettingsProps> = (props) => {
  const { gameMode, onGameModeChange, gameState } = props;

  return (
    <div className="gameModeSettings">
      <label htmlFor="gameModeSetting">Gamemode</label><br/>

      <select disabled={gameState === "Playing" || gameState === "Countdown"} className={gameState === "Playing" ? "dontClick" : ""}
        name="gameModeSetting" id="gameModeSetting" onChange={(event) => onGameModeChange(parseInt(event.target.value))}>
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
    </div>
  )
}


export default GameModeSettings;
