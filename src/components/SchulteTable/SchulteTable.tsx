import React, { FC } from "react";
import { MemoryTile, TableSettings } from "../../interfaces"; // If needed for Memory mode
import { GameMode, GameState, Tile, GridSize } from "../../interfaces";
import { gridSizeToCss, renderSchulteTile } from "../../utils";
import PlaySvg from "../Other/PlaySvg";
import ReplaySvg from "../Other/ReplaySvg";
import PlayReplayButton from "./PlayReplayButton";

interface SchulteTableProps {
  gameMode: GameMode;
  gameState: GameState;
  tiles: Tile[] | MemoryTile[];
  tableSettings: TableSettings
  onStart: () => void;
  onRestart: () => void;
  onNumberInput: (inputtedNumber: number) => void;
  expectedNumber?: number; // Optional for specific modes
}

const SchulteTable: FC<SchulteTableProps> = ({
  gameMode,
  gameState,
  tiles,
  tableSettings,
  onStart,
  onRestart,
  onNumberInput,
  expectedNumber,
}) => {
  return (
    <div className={`schulteTable ${gridSizeToCss(tableSettings.gridSize)} ${gameState === "Playing" || gameState === "Countdown"  ? "" : "dimOverlay"}`}>
      {tiles.map((tile, index) => renderSchulteTile(tile, index, gameMode, gameState, tableSettings.direction, onNumberInput, expectedNumber))}
    </div>
  );
};

export default SchulteTable;