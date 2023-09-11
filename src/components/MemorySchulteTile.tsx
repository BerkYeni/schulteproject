import React, { FC } from "react";
import { GameState, MemoryTile, Tile } from "../interfaces";

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
      <div className={tile.animationPlaying ? "revealTileShortly" : ""}>
        {tile.value}
      </div>
    </button>
  );
};

export default MemorySchulteTile;
