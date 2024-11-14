import React, { FC } from "react";
import { GameState, OnGridSizeChange, TableSettings } from "../../interfaces";
import { gridSizes, gridSizeToDisplay } from "../../utils";

interface GridSettingsProps {
  tableSettings: TableSettings;
  onGridSizeChange: OnGridSizeChange;
  gameState: GameState;
}

const GridSettings: FC<GridSettingsProps> = (props) => {
  const { tableSettings, onGridSizeChange, gameState } = props;

  return (
    <div className="setting">
      <div>Grid Size</div>

      <select 
        defaultValue={tableSettings.gridSize} 
        disabled={gameState === "Playing" || gameState === "Countdown"} 
        className={gameState === "Playing" ? "dontClick" : ""}
        name="gridSetting" id="gridSetting" 
        onChange={(event) => onGridSizeChange(parseInt(event.target.value))}
      >
        {gridSizes.map((size, index) => (
          <option
            className={tableSettings.gridSize === size ? "clicked" : ""}
            key={index}
            value={size}
          >
            {gridSizeToDisplay(size)}
          </option>
        ))}
      </select>
    </div>
  )
}


export default GridSettings;