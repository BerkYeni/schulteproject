import React, { FC } from "react";
import { GameMode, GameState } from "../interfaces";

interface ControlPanelProps {
  gameState: GameState;
  onHidePanels: () => void;
  onExposePanels: () => void;
  hidden: boolean;
  changeGameMode: (gameMode: GameMode) => void;
  onStart: () => void;
  onRestart: () => void;
}

const ControlPanel: FC<ControlPanelProps> = (props) => {
  const {
    gameState,
    onHidePanels,
    onExposePanels,
    hidden,
    changeGameMode,
    onStart,
    onRestart,
  } = props;

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
      </div>
    </>
  );
};

export default ControlPanel;
