import React, { FC } from "react";
import { GameState, Tile } from "../interfaces";

interface MemorySchulteTileProps {
  tile: Tile;
  onClick: (tile: Tile) => void;
  gameState: GameState;
  animationIsPlaying: boolean;
}

const MemorySchulteTile: FC<MemorySchulteTileProps> = (props) => {
  const { tile, onClick, gameState, animationIsPlaying } = props;

  return (
    <button
      className={`tile ${tile.checked ? "clicked" : "unclicked"}`}
      onClick={() => onClick(tile)}
    >
      <div
        className={
          gameState !== "Playing"
            ? ""
            : animationIsPlaying
            ? "revealTileShortly"
            : ""
        }
      >
        {tile.value}
      </div>
    </button>
  );
};

export default MemorySchulteTile;
