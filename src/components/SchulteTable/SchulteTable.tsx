import React, { FC } from "react";
import { MemoryTile, TableSettings } from "../../interfaces"; // If needed for Memory mode
import { GameMode, GameState, Tile, GridSize } from "../../interfaces";
import { gridSizeToCss, renderSchulteTile } from "../../utils";

interface SchulteTableProps {
  gameMode: GameMode;
  gameState: GameState;
  tiles: Tile[] | MemoryTile[];
  tableSettings: TableSettings
  panelsAreHidden: boolean;
  onNumberInput: (inputtedNumber: number) => void;
  expectedNumber?: number; // Optional for specific modes
}

const SchulteTable: FC<SchulteTableProps> = ({
  gameMode,
  gameState,
  tiles,
  tableSettings,
  onNumberInput,
  expectedNumber,
  panelsAreHidden,
}) => {
  const className = `schulteTable smoothTransition ${
    gridSizeToCss(tableSettings.gridSize)
  } ${
    gameState === "Playing" || gameState === "Countdown"  ? "" : "dimOverlay"
  } ${
    panelsAreHidden ? "tableCanExpand" : ""
  }`;

  return (
    <div className={className}>
      {tiles.map((tile, index) => renderSchulteTile(
        tile, index, gameMode, gameState, tableSettings.direction, onNumberInput, expectedNumber
      ))}
    </div>
  );
};

export default SchulteTable;