import React, { FC } from "react";
import { GameState, GridSize, Tile } from "../interfaces";
import ReplaySvg from "./ReplaySvg";
import PlaySvg from "./PlaySvg";
import { gridSizeToCss } from "../utils";
import SchulteTile from "./SchulteTile";

interface SchulteTableProps {
  gameState: GameState;
  tiles: Tile[];
  gridSize: GridSize;
  onStart: () => void;
  onRestart: () => void;
  onNumberInput: (inputtedNumber: number) => void;
}

const SchulteTable: FC<SchulteTableProps> = (props) => {
  const { gameState, tiles, gridSize, onStart, onNumberInput, onRestart } =
    props;

  const tileWithStandardPropsGiven = (tile: Tile, index: number) => {
    return (
      <SchulteTile
        onClick={() => onNumberInput(tile.value)}
        key={index}
        tile={tile}
      />
    );
  };

  return (
    <div className={`schulteTable ${gridSizeToCss(gridSize)}`}>
      {tiles.map(tileWithStandardPropsGiven)}

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
