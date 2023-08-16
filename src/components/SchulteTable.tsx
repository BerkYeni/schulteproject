import React, { FC } from "react";
import {
  GameModeRule,
  GameMode,
  GameState,
  GridSize,
  gameModeToDisplayLookUp,
} from "../interfaces";
import ReplaySvg from "./ReplaySvg";
import PlaySvg from "./PlaySvg";
import { gridSizeToArray, gridSizeToCss } from "../utils";
import SchulteTile from "./SchulteTile";

interface SchulteTableProps {
  gameState: GameState;
  // expectedNumber: number;
  // setExpectedNumber: React.Dispatch<React.SetStateAction<number>>;
  tiles: number[];
  gridSize: GridSize;
  // endGame: () => void;
  // gameMode: GameMode;
  // handleStart: () => void;
  onStart: () => void;
  onNumberInput: (inputtedNumber: number) => void;
}

const SchulteTable: FC<SchulteTableProps> = (props) => {
  const {
    gameState,
    // expectedNumber,
    // setExpectedNumber,
    tiles,
    gridSize,
    // endGame,
    // handleStart,
    // gameMode,
    onStart,
    onNumberInput,
  } = props;

  // const GameModeRules: { [key in GameMode]: GameModeRule } = {
  //   [GameMode.Vanilla]: {
  //     expectedNumberSetter: (previousExpectedNumber) =>
  //       previousExpectedNumber + 1,
  //     winCondition: (pressedNumber, tiles, expectedNumber) =>
  //       pressedNumber === Math.max(...tiles),
  //   },
  //   [GameMode.Reverse]: {
  //     expectedNumberSetter: (previousExpectedNumber) =>
  //       previousExpectedNumber - 1,
  //     winCondition: (pressedNumber, tiles, expectedNumber) =>
  //       pressedNumber === Math.min(...tiles),
  //   },
  //   [GameMode.Reaction]: {
  //     expectedNumberSetter: (previousExpectedNumber) =>
  //       previousExpectedNumber + 1,
  //     winCondition: (pressedNumber, tiles, expectedNumber) =>
  //       pressedNumber === Math.max(...tiles),
  //   },
  //   [GameMode.Memory]: {
  //     expectedNumberSetter: (previousExpectedNumber) =>
  //       previousExpectedNumber + 1,
  //     winCondition: (pressedNumber, tiles, expectedNumber) =>
  //       pressedNumber === Math.max(...tiles),
  //   },
  // };

  // const handleTile = (
  //   event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  //   pressedNumber: number,
  //   setPlayAnimation: React.Dispatch<React.SetStateAction<boolean>>
  // ): void => {
  //   if (gameState !== "Playing" || !tiles) {
  //     return;
  //   }

  //   if (gameMode === GameMode.Memory) {
  //     setPlayAnimation(true);
  //   }

  //   if (pressedNumber !== expectedNumber) {
  //     return;
  //   }
  //   const rules = GameModeRules[gameMode];

  //   // win condition
  //   if (rules.winCondition(pressedNumber, tiles, expectedNumber)) {
  //     endGame();
  //   }

  //   setExpectedNumber(rules.expectedNumberSetter);
  // };

  const tileWithStandardPropsGiven = (tileNumber: number, index: number) => {
    return (
      <SchulteTile
        // expectedNumber={expectedNumber}
        // gameMode={gameMode}
        // gameState={gameState}
        onClick={() => onNumberInput(tileNumber)}
        key={index}
        tileNumber={tileNumber}
      />
    );
  };

  const orderedTable = () =>
    gridSizeToArray(gridSize).map(tileWithStandardPropsGiven);

  // const actualTable = () => tiles.map(tileWithStandardPropsGiven);

  return (
    <div className={`schulteTable ${gridSizeToCss(gridSize)}`}>
      {tiles.map(tileWithStandardPropsGiven)}
      {/* {!tiles || gameState === "NotStarted"
        ? orderedTable()
        : tiles.map(tileWithStandardPropsGiven)} */}
      {(gameState === "NotStarted" || gameState === "Completed") && (
        <button className="tableReplay" onClick={onStart}>
          {gameState === "NotStarted" ? <PlaySvg /> : <ReplaySvg />}
        </button>
      )}
    </div>
  );
};

export default SchulteTable;
