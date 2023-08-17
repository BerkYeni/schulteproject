import React, { FC } from "react";
import { Tile } from "../interfaces";

interface SchulteTileProps {
  tile: Tile;
  onClick: () => void;
}

const SchulteTile: FC<SchulteTileProps> = (props) => {
  const { tile, onClick } = props;

  return (
    <button
      className={`tile ${tile.checked ? "clicked" : "unclicked"}`}
      onClick={onClick}
    >
      <div className={``}>{tile.value}</div>
    </button>
  );
};

export default SchulteTile;
