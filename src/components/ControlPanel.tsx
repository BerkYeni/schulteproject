import React, { FC } from "react";
import { GameMode, GameState, GridSize } from "../interfaces";
import { gridSizeToDisplay } from "../utils";

interface ControlPanelProps {
  gameState: GameState;
  onHidePanels: () => void;
  onExposePanels: () => void;
  hidden: boolean;
  changeGameMode: (gameMode: GameMode) => void;
  onStart: () => void;
  onRestart: () => void;
  onGridSizeChange: (gridSize: GridSize) => void;
}

const ControlPanel: FC<ControlPanelProps> = (props) => {
  const {
    gameState,
    onHidePanels,
    onExposePanels,
    hidden,
    changeGameMode,
    onGridSizeChange,
    onStart,
    onRestart,
  } = props;

  const gridSizeEntries = Object.entries(GridSize).filter(
    (entry) => !isNaN(Number(entry[1]))
  );

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

        <div className="playAgainContainer">
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
        </div>

        <div className="gameSettings">
          <div className="gridSetting">
            {gridSizeEntries.map()}

            {/* <button onClick={() => handleGridSizeSetting(GridSize.Size3x3)}>
              {gridSizeToDisplay(GridSize.Size3x3)}
            </button>
            <button onClick={() => handleGridSizeSetting(GridSize.Size4x4)}>
              {gridSizeToDisplay(GridSize.Size4x4)}
            </button>
            <button onClick={() => handleGridSizeSetting(GridSize.Size5x5)}>
              {gridSizeToDisplay(GridSize.Size5x5)}
            </button>
          </div>

          <div className="GameModeetting">
            <button onClick={() => handleGameModeSetting(GameMode.Vanilla)}>
              {gameModeToDisplay(GameMode.Vanilla)}
            </button>
            <button onClick={() => handleGameModeSetting(GameMode.Reverse)}>
              {gameModeToDisplay(GameMode.Reverse)}
            </button>
            <button onClick={() => handleGameModeSetting(GameMode.Memory)}>
              {gameModeToDisplay(GameMode.Memory)}
            </button>
            <button onClick={() => handleGameModeSetting(GameMode.Reaction)}>
              {gameModeToDisplay(GameMode.Reaction)}
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ControlPanel;
