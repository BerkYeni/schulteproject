import React, { FC, useEffect, useState } from "react";
import { GameMode, GameState } from "../interfaces";

interface SchulteTileProps {
  gameMode: GameMode;
  tileNumber: number;
  expectedNumber: number;
  gameState: GameState;
  handleTile: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    pressedNumber: number,
    setPlayAnimation: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
}

const SchulteTile: FC<SchulteTileProps> = (props) => {
  const { gameMode, tileNumber, expectedNumber, gameState, handleTile } = props;

  const [playAnimation, setPlayAnimation] = useState<boolean>(false);

  if (gameState === "Completed") {
    if (playAnimation === true) {
      setPlayAnimation(false);
    }
  }

  const GameModeStyleRule =
    gameMode === GameMode.Reverse
      ? tileNumber > expectedNumber
      : tileNumber < expectedNumber;
  return (
    <button
      className={`tile ${
        GameModeStyleRule && gameState !== "NotStarted"
          ? "clicked"
          : "unclicked"
      }`}
      onClick={(event) => handleTile(event, tileNumber, setPlayAnimation)}
    >
      <div
        className={`${
          gameMode === GameMode.Reaction &&
          tileNumber !== expectedNumber &&
          gameState !== "Completed"
            ? "hidden"
            : ""
        } ${
          // for testing purposes
          gameMode === GameMode.Memory
            ? gameState === "Playing"
              ? tileNumber >= expectedNumber
                ? playAnimation
                  ? "revealTileShortly transparent"
                  : "hidden"
                : ""
              : ""
            : ""
        }`}
        onAnimationEnd={() => setPlayAnimation(false)}
      >
        {tileNumber}
      </div>
    </button>
  );
};

export default SchulteTile;
