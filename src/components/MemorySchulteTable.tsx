import React, { FC, useState } from "react";
import { GameState, GridSize, Tile } from "../interfaces";
import ReplaySvg from "./ReplaySvg";
import PlaySvg from "./PlaySvg";
import { gridSizeToCss } from "../utils";
import MemorySchulteTile from "./MemorySchulteTile";

interface MemorySchulteTableProps {
  gameState: GameState;
  tiles: Tile[];
  gridSize: GridSize;
  onStart: () => void;
  onRestart: () => void;
  onNumberInput: (inputtedNumber: number) => void;
}

const MemorySchulteTable: FC<MemorySchulteTableProps> = (props) => {
  const { gameState, tiles, gridSize, onStart, onNumberInput, onRestart } =
    props;

  // const [tileAnimationTracker, setTileAnimationTracker] = useState({})

  const tileWithStandardPropsGiven = (
    tile: Tile,
    index: number,
    gameState: GameState
  ) => {
    return (
      <MemorySchulteTile
        onClick={(tile) => handleClick(tile)}
        key={index}
        tile={tile}
        gameState={gameState}
        animationIsPlaying={tile.checked}
      />
    );
  };

  const handleClick = (tile: Tile) => {
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
