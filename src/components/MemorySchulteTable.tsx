import React, { FC, useEffect, useState } from "react";
import {
  GameState,
  GridSize,
  MemoryTile,
  MemoryTileAnimationTracker,
  Tile,
} from "../interfaces";
import ReplaySvg from "./ReplaySvg";
import PlaySvg from "./PlaySvg";
import { gridSizeToCss } from "../utils";
import MemorySchulteTile from "./MemorySchulteTile";

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

  // const animationTracker = (tiles: Tile[]): MemoryTileAnimationTracker[] =>
  //   tiles.map((tile) => ({
  //     value: tile.value,
  //     timeoutId: undefined,
  //   }));

  // const [tileAnimationTracker, setTileAnimationTracker] = useState(
  //   animationTracker(tiles)
  // );

  // useEffect(() => {
  //   setTileAnimationTracker(animationTracker(tiles));
  // }, [tiles]);

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