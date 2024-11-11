import React, { FC } from "react";
import { MemoryTile } from "../../interfaces"; // If needed for Memory mode
import { GameMode, GameState, Tile, GridSize } from "../../interfaces";
import { gridSizeToCss, renderSchulteTile } from "../../utils";
import PlaySvg from "../Other/PlaySvg";
import ReplaySvg from "../Other/ReplaySvg";

interface SchulteTableProps {
  gameMode: GameMode;
  gameState: GameState;
  tiles: Tile[] | MemoryTile[];
  gridSize: GridSize;
  onStart: () => void;
  onRestart: () => void;
  onNumberInput: (inputtedNumber: number) => void;
  expectedNumber?: number; // Optional for specific modes
}

const SchulteTable: FC<SchulteTableProps> = ({
  gameMode,
  gameState,
  tiles,
  gridSize,
  onStart,
  onRestart,
  onNumberInput,
  expectedNumber,
}) => {
  return (
    <div className={`schulteTable ${gridSizeToCss(gridSize)} ${gameState !== "Playing" ? "dimOverlay" : ""}`}>
      {tiles.map((tile, index) => renderSchulteTile(tile, index, gameMode, gameState, onNumberInput, expectedNumber))}

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

export default SchulteTable;