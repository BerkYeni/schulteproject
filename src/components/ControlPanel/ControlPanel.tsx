import React, { FC } from "react";
import {
  ControlPanelEventCallbacks,
  GameMode,
  GameState,
  TableSettings,
} from "../../interfaces";
import GridSettings from "./GridSettings";
import GameModeSettings from "./GameModeSettings";
import DirectionSettings from "./DirectionSettings";

interface ControlPanelProps {
  gameState: GameState;
  tableSettings: TableSettings;
  gameMode: GameMode;
  hidden: boolean;
  eventCallbacks: ControlPanelEventCallbacks;
}

const ControlPanel: FC<ControlPanelProps> = (props) => {
  const { gameState, hidden, eventCallbacks, gameMode, tableSettings } = props;

  const {
    onGridSizeChange,
    onGameModeChange,
    onDirectionChange,
  } = eventCallbacks;

  return (
    <div className={`controlPanel smoothTransition ${hidden ? "slideLeft" : ""}`}>
      <div className="settingsAndHeaderContainer">
        <h1>Game Settings</h1>
        <div className="gameSettings">

          <GridSettings tableSettings={tableSettings} onGridSizeChange={onGridSizeChange} gameState={gameState} />

          <GameModeSettings gameMode={gameMode} onGameModeChange={onGameModeChange} gameState={gameState} />

          <DirectionSettings onDirectionChange={onDirectionChange} tableSettings={tableSettings} gameState={gameState} />

      </div>

      </div>
    </div>
  );
};

export default ControlPanel;
