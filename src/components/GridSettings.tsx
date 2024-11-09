import React, { FC } from "react";
import { GridSize, OnGridSizeChange, TableSettings } from "../interfaces";
import { gridSizeToDisplay } from "../utils";

interface GridSettingsProps {
  tableSettings: TableSettings;
  onGridSizeChange: OnGridSizeChange
}

const GridSettings: FC<GridSettingsProps> = (props) => {
  const { tableSettings, onGridSizeChange } = props;
  const gridSizes = [GridSize.Size3x3, GridSize.Size4x4, GridSize.Size5x5];

  return (
    <div className="gridSettings">
    {gridSizes.map((size, index) => (
      <button
        className={tableSettings.gridSize === size ? "clicked" : ""}
        key={index}
        onClick={() => onGridSizeChange(size)}
      >
        {gridSizeToDisplay(size)}
      </button>
    ))}
    </div>
  )
}



export default GridSettings;