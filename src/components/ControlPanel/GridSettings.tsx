import React, { FC } from "react";
import { OnGridSizeChange, TableSettings } from "../../interfaces";
import { gridSizes, gridSizeToDisplay } from "../../utils";

interface GridSettingsProps {
  tableSettings: TableSettings;
  onGridSizeChange: OnGridSizeChange
}

const GridSettings: FC<GridSettingsProps> = (props) => {
  const { tableSettings, onGridSizeChange } = props;

  return (
    <div className="gridSettings">
      <label htmlFor="gridSetting">Grid Size</label><br/>

      <select name="gridSetting" id="gridSetting" onChange={(event) => onGridSizeChange(parseInt(event.target.value))}>
        {gridSizes.map((size, index) => (
          <option
            selected={size === tableSettings.gridSize ? true : false}
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