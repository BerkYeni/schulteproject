import React, { FC } from "react";
import { Tile } from "../../interfaces";

interface ReactionSchulteTileProps {
  tile: Tile;
  onClick: () => void;
  expectedNumber: number;
}

const ReactionSchulteTile: FC<ReactionSchulteTileProps> = (props) => {
  const { tile, onClick, expectedNumber } = props;

  return (
    <button
      className={`tile ${tile.checked ? "clicked" : "unclicked"}`}
      onMouseDown={onClick}
    >
      <div
        className={
          tile.value !== expectedNumber && !tile.checked ? "hidden" : ""
        }
      >
        {tile.value}
      </div>
    </button>
  );
};

export default ReactionSchulteTile;
