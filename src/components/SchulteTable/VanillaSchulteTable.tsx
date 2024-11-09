import React, { FC } from "react";
import VanillaSchulteTile from "./VanillaSchulteTile";
import { GameState, Tile, GridSize } from "../../interfaces";
import { gridSizeToCss } from "../../utils";
import PlaySvg from "../Other/PlaySvg";
import ReplaySvg from "../Other/ReplaySvg";

interface VanillaSchulteTableProps {
  gameState: GameState;
  tiles: Tile[];
  gridSize: GridSize;
  onStart: () => void;
  onRestart: () => void;
  onNumberInput: (inputtedNumber: number) => void;
}

const VanillaSchulteTable: FC<VanillaSchulteTableProps> = (props) => {
  const { gameState, tiles, gridSize, onStart, onNumberInput, onRestart } =
    props;

  const tileWithStandardPropsGiven = (tile: Tile, index: number) => {
    return (
      <VanillaSchulteTile
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

export default VanillaSchulteTable;
