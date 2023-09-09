import React, { FC } from "react";
import { GameMode, GameState, GridSize, TableDirection } from "../interfaces";
import {
  directionToDisplay,
  gameModeToDisplay,
  gridSizeToDisplay,
} from "../utils";

interface ControlPanelProps {
  gameState: GameState;
  onHidePanels: () => void;
  onExposePanels: () => void;
  hidden: boolean;
  onStart: () => void;
  onRestart: () => void;
  onGridSizeChange: (gridSize: GridSize) => void;
  onGameModeChange: (gameMode: GameMode) => void;
  onDirectionChange: (direction: TableDirection) => void;
}

const ControlPanel: FC<ControlPanelProps> = (props) => {
  const {
    gameState,
    onHidePanels,
    onExposePanels,
    hidden,
    onGridSizeChange,
    onStart,
    onRestart,
    onGameModeChange,
    onDirectionChange,
  } = props;

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

        {/* <div className="playAgainContainer">
          {gameState === "NotStarted" && (
            <button className="playAgain" onClick={onStart}>
              Start
            </button>
          )}
          {gameState === "Completed" && (
            <button className="playAgain" onClick={onRestart}>
              Play Again
            </button>
          )}
        </div> */}

        <div className="gameSettings">
          <div className="gridSettings">
            {gridSizes.map((size) => (
              <button onClick={() => onGridSizeChange(size)}>
                {gridSizeToDisplay(size)}
              </button>
            ))}
          </div>

          <div className="gameModeSettings">
            {gameModes.map((mode) => (
              <button onClick={() => onGameModeChange(mode)}>
                {gameModeToDisplay(mode)}
              </button>
            ))}
          </div>

          <div className="directionSettings">
            {directions.map((direction) => (
              <button onClick={() => onDirectionChange(direction)}>
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
