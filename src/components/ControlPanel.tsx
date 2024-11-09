import React, { FC } from "react";
import {
  ControlPanelEventCallbacks,
  GameMode,
  GameState,
  GridSize,
  TableDirection,
  TableSettings,
} from "../interfaces";
import {
  directionToDisplay,
  gameModeToDisplay,
  gridSizeToDisplay,
} from "../utils";
import GridSettings from "./GridSettings";

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

      <div className="gameSettings">

        <GridSettings tableSettings={tableSettings} onGridSizeChange={onGridSizeChange} />

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

        <div className="directionSettings">
          {directions.map((direction, index) => (
            <button
              className={
                tableSettings.direction === direction ? "clicked" : ""
              }
              key={index}
              onClick={() => onDirectionChange(direction)}
            >
              {directionToDisplay(direction)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
