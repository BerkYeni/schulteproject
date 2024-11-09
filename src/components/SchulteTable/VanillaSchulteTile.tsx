import React, { FC } from "react";
import { Tile } from "../../interfaces";

interface VanillaSchulteTileProps {
  tile: Tile;
  onClick: () => void;
}

const VanillaSchulteTile: FC<VanillaSchulteTileProps> = (props) => {
  const { tile, onClick } = props;

  return (
    <button
      className={`tile ${tile.checked ? "clicked" : "unclicked"}`}
      onMouseDown={onClick}
    >
      <div className={""}>{tile.value}</div>
    </button>
  );
};

export default VanillaSchulteTile;
