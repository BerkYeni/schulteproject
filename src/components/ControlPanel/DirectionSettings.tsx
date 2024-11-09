import React, { FC } from "react";
import { directions, directionToDisplay } from "../../utils";
import { OnDirectionChange, TableDirection, TableSettings } from "../../interfaces";

interface DirectionSettingsProps {
  tableSettings: TableSettings;
  onDirectionChange: OnDirectionChange;
}

const DirectionSettings: FC<DirectionSettingsProps> = (props) => {
  const { tableSettings, onDirectionChange } = props;

  return (
    <div className="directionSettings">
      <label htmlFor="directionSetting">Direction</label><br/>

      <select name="directionSetting" id="directionSetting" onChange={(event) => onDirectionChange(event.target.value as TableDirection)}>
        {directions.map((direction, index) => (
          <option
            selected={direction === tableSettings.direction ? true : false}
            className={tableSettings.direction === direction ? "clicked" : ""}
            key={index}
            value={direction}
          >
            {directionToDisplay(direction)}
          </option>
        ))}
      </select>
    </div>
  )
}


export default DirectionSettings;
