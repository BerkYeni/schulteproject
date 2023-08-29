import React, { FC } from "react";
import { GameMode, GameState, GridSize } from "../interfaces";
import { gameModeToDisplay, gridSizeToDisplay } from "../utils";

interface ControlPanelProps {
  gameState: GameState;
  onHidePanels: () => void;
  onExposePanels: () => void;
  hidden: boolean;
  changeGameMode: (gameMode: GameMode) => void;
  onStart: () => void;
  onRestart: () => void;
  onGridSizeChange: (gridSize: GridSize) => void;
  onGameModeChange: (gameMode: GameMode) => void;
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
  } = props;

  const gridSizes = [GridSize.Size3x3, GridSize.Size4x4, GridSize.Size5x5];
  const gameModes = [GameMode.Vanilla, GameMode.Reaction];

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
            {gridSizes.map((size) => (
              <button onClick={() => onGridSizeChange(size)}>
                {gridSizeToDisplay(size)}
              </button>
            ))}
          </div>

          <div className="GameModeetting">
            {gameModes.map((mode) => (
              <button onClick={() => onGameModeChange(mode)}>
                {gameModeToDisplay(mode)}
              </button>
            ))}
          </div>

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
          {/* </div> */}
        </div>
      </div>
    </>
  );
};

export default ControlPanel;
