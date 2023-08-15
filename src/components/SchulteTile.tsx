import React, { FC, useEffect, useState } from "react";
import { GameMode, GameState } from "../interfaces";

interface SchulteTileProps {
  // gameMode: GameMode;
  tileNumber: number;
  onClick: () => void;
  // expectedNumber: number;
  // gameState: GameState;
  // handleTile: (
  //   event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  //   pressedNumber: number,
  //   setPlayAnimation: React.Dispatch<React.SetStateAction<boolean>>
  // ) => void;
}

const SchulteTile: FC<SchulteTileProps> = (props) => {
  const { tileNumber, onClick } = props;

  return (
    <button className={`tile unclicked`} onClick={onClick}>
      <div className={``}>{tileNumber}</div>
    </button>
  );

  // const [playAnimation, setPlayAnimation] = useState<boolean>(false);

  // if (gameState === "Completed") {
  //   if (playAnimation === true) {
  //     setPlayAnimation(false);
  //   }
  // }

  // const GameModeStyleRule =
  //   gameMode === GameMode.Reverse
  //     ? tileNumber > expectedNumber
  //     : tileNumber < expectedNumber;
  // return (
  //   <button
  //     className={`tile ${
  //       GameModeStyleRule && gameState !== "NotStarted"
  //         ? "clicked"
  //         : "unclicked"
  //     }`}
  //     onClick={onClick}
  //   >
  //     <div
  //       className={`${
  //         gameMode === GameMode.Reaction &&
  //         tileNumber !== expectedNumber &&
  //         gameState !== "Completed"
  //           ? "hidden"
  //           : ""
  //       } ${
  //         // for testing purposes
  //         gameMode === GameMode.Memory
  //           ? gameState === "Playing"
  //             ? tileNumber >= expectedNumber
  //               ? playAnimation
  //                 ? "revealTileShortly transparent"
  //                 : "hidden"
  //               : ""
  //             : ""
  //           : ""
  //       }`}
  //       onAnimationEnd={() => setPlayAnimation(false)}
  //     >
  //       {tileNumber}
  //     </div>
  //   </button>
  // );
};

export default SchulteTile;
