import React, { FC } from "react";
import { GameMode, GameState, GridSize } from "../interfaces";
import { gameModeToDisplay, gridSizeToDisplay } from "../utils";

interface ControlPanelProps {
  // setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  // handleStart: () => void;
  // setGridSize: React.Dispatch<React.SetStateAction<GridSize>>;
  // resetGame: () => void;

  gameState: GameState;
  setRoundStartTimestamp: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  setOnlyDisplayTable: React.Dispatch<React.SetStateAction<boolean>>;
  hidden: boolean;
  changeGameMode: (gameMode: GameMode) => void;
  onStart: () => void;
}

const ControlPanel: FC<ControlPanelProps> = (props) => {
  const {
    // setGameState,
    // handleStart,
    // setGridSize,
    // resetGame,
    gameState,
    setOnlyDisplayTable,
    hidden,
    changeGameMode,
    onStart,
  } = props;

  const handleToggleVisibility = () => {
    setOnlyDisplayTable(
      (previousOnlyDisplayTable) => !previousOnlyDisplayTable
    );
  };

  // TODO: come back to this
  // const handleGridSizeSetting = (gridSize: GridSize): void => {
  //   switch (gameState) {
  //     case "Playing":
  //       return;
  //     case "NotStarted":
  //       break;
  //     case "Completed":
  //       // TODO: change game state to not started
  //       setGameState("NotStarted");
  //       resetGame();
  //       break;
  //   }

  //   setGridSize(gridSize);
  // };
  // const handleGameModeSetting = (gameMode: GameMode): void => {
  //   switch (gameState) {
  //     case "Playing":
  //       return;
  //     case "NotStarted":
  //       break;
  //     case "Completed":
  //       // TODO: change game state to not started
  //       setGameState("NotStarted");
  //       resetGame();
  //       break;
  //   }

  //   changeGameMode(gameMode);
  // };

  return (
    <>
      <button
        id="exposePanelsButton"
        className={`exposePanels tile unclicked ${!hidden && "hidden"}`}
        onClick={handleToggleVisibility}
      >
        →
      </button>
      <div className={`controlPanel ${hidden && "hidden"}`}>
        <div className="toggleVisibilityContainer">
          <button
            className="toggleVisibility tile unclicked"
            onClick={handleToggleVisibility}
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
            <button className="playAgain" onClick={onStart}>
              Play Again
            </button>
          )}
        </div>

        {/* <div className="gameSettings">
          <div className="gridSetting">
            <button onClick={() => handleGridSizeSetting(GridSize.Size3x3)}>
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
            </button>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default ControlPanel;
