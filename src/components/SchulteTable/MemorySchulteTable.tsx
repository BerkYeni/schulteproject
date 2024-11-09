import React, { FC, useEffect, useState } from "react";
import MemorySchulteTile from "./MemorySchulteTile";
import { GameState, MemoryTile, GridSize } from "../../interfaces";
import { gridSizeToCss } from "../../utils";
import PlaySvg from "../Other/PlaySvg";
import ReplaySvg from "../Other/ReplaySvg";

interface MemorySchulteTableProps {
  gameState: GameState;
  tiles: MemoryTile[];
  gridSize: GridSize;
  onStart: () => void;
  onRestart: () => void;
  onNumberInput: (inputtedNumber: number) => void;
}

const MemorySchulteTable: FC<MemorySchulteTableProps> = (props) => {
  const { gameState, tiles, gridSize, onStart, onNumberInput, onRestart } =
    props;

  const tileWithStandardPropsGiven = (
    tile: MemoryTile,
    index: number,
    gameState: GameState
  ) => {
    return (
      <MemorySchulteTile
        onClick={(tile) => handleClick(tile)}
        key={index}
        tile={tile}
        gameState={gameState}
      />
    );
  };

  const handleClick = (tile: MemoryTile) => {
    onNumberInput(tile.value);
  };

  return (
    <div className={`schulteTable ${gridSizeToCss(gridSize)}`}>
      {tiles.map((tile, index) =>
        tileWithStandardPropsGiven(tile, index, gameState)
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

export default MemorySchulteTable;
