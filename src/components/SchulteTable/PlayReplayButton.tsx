import React, { FC } from "react";
import { GameState } from "../../interfaces";
import PlaySvg from "../Other/PlaySvg";
import ReplaySvg from "../Other/ReplaySvg";

interface PlayReplayButtonProps {
  gameState: GameState;
  onStart: () => void;
  onRestart: () => void;
}

const PlayReplayButton: FC<PlayReplayButtonProps> = ({gameState, onStart, onRestart,}) => {
  return (
    <div>
      {(gameState === "NotStarted" || gameState === "Completed") && (
        <button
          className="tableReplay"
          onClick={gameState === "NotStarted" ? onStart : onRestart}
        >
          {gameState === "NotStarted" ? <PlaySvg /> : <ReplaySvg />}
        </button>
      )}
    </div>
  );
};

export default PlayReplayButton;