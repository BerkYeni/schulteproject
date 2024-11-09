import React, { FC } from "react";
import ReactionSchulteTile from "./ReactionSchulteTile";
import { GameState, Tile, GridSize } from "../../interfaces";
import { gridSizeToCss } from "../../utils";
import PlaySvg from "../Other/PlaySvg";
import ReplaySvg from "../Other/ReplaySvg";

interface ReactionSchulteTableProps {
  gameState: GameState;
  tiles: Tile[];
  gridSize: GridSize;
  onStart: () => void;
  onRestart: () => void;
  onNumberInput: (inputtedNumber: number) => void;
  expectedNumber: number;
}

const ReactionSchulteTable: FC<ReactionSchulteTableProps> = (props) => {
  const {
    gameState,
    tiles,
    gridSize,
    onStart,
    onNumberInput,
    onRestart,
    expectedNumber,
  } = props;

  const tileWithStandardPropsGiven = (
    tile: Tile,
    index: number,
    expectedNumber: number
  ) => {
    return (
      <ReactionSchulteTile
        onClick={() => onNumberInput(tile.value)}
        key={index}
        tile={tile}
        expectedNumber={expectedNumber}
      />
    );
  };

  return (
    <div className={`schulteTable ${gridSizeToCss(gridSize)}`}>
      {tiles.map((tile, index) =>
        tileWithStandardPropsGiven(tile, index, expectedNumber)
      )}

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

export default ReactionSchulteTable;
