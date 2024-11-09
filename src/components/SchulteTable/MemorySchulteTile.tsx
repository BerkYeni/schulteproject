import React, { FC, useState } from "react";
import { MemoryTile, GameState } from "../../interfaces";

interface MemorySchulteTileProps {
  tile: MemoryTile;
  onClick: (tile: MemoryTile) => void;
  gameState: GameState;
}

const MemorySchulteTile: FC<MemorySchulteTileProps> = (props) => {
  const { tile, onClick, gameState } = props;

  return (
    <button
      className={`tile ${tile.checked ? "clicked" : "unclicked"}`}
      onMouseDown={() => onClick(tile)}
    >
      <div
        className={`tileText ${
          gameState !== "Playing"
            ? ""
            : tile.checked
            ? ""
            : tile.animationPlaying
            ? "revealTileShortly transparent"
            : "hidden"
        }`}
      >
        {tile.value}
      </div>
    </button>
  );
};

export default MemorySchulteTile;
