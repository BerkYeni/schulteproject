import React, { FC, useState } from "react";
import { GameState, MemoryTile } from "../interfaces";

interface MemorySchulteTileProps {
  tile: MemoryTile;
  onClick: (tile: MemoryTile) => void;
  gameState: GameState;
}

const MemorySchulteTile: FC<MemorySchulteTileProps> = (props) => {
  const { tile, onClick } = props;
  const [test, setTest] = useState(tile);
  console.log("test: ", test, "tile: ", tile);
  if (test != tile) {
    console.log("AAAAAAAAAAAHHHHHHHHHHHHHHHHHHHHHHHHHHAHAAAAAAA");
    setTest(tile);
  }

  return (
    <button
      className={`tile ${tile.checked ? "clicked" : "unclicked"}`}
      onMouseDown={() => onClick(tile)}
    >
      <div className={tile.animationPlaying ? "hidden" : "revealTileShortly"}>
        {tile.value}
      </div>
    </button>
  );
};

export default MemorySchulteTile;
