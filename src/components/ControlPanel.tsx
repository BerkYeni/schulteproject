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
    onHidePanels,
    onExposePanels,
    onGridSizeChange,
    onGameModeChange,
    onDirectionChange,
  } = eventCallbacks;

  const gridSizes = [GridSize.Size3x3, GridSize.Size4x4, GridSize.Size5x5];
  const gameModes = [GameMode.Vanilla, GameMode.Reaction, GameMode.Memory];
  const directions: TableDirection[] = ["Ascending", "Descending"];

  return (
    <>
      <button
        id="exposePanelsButton"
        className={`exposePanels tile unclicked ${!hidden && "hidden"}`}
        onClick={onExposePanels}
      >
        →
      </button>
      <div className={`controlPanel ${hidden && "hidden"}`}>
        <div className="toggleVisibilityContainer">
          <button
            className="toggleVisibility tile unclicked"
            onClick={onHidePanels}
          >
            ←
          </button>
        </div>

        <div className="gameSettings">
          <div className="gridSettings">
            {gridSizes.map((size, index) => (
              <button
                className={tableSettings.gridSize === size ? "clicked" : ""}
                key={index}
                onClick={() => onGridSizeChange(size)}
              >
                {gridSizeToDisplay(size)}
              </button>
            ))}
          </div>

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
    </>
  );
};

export default ControlPanel;
