import React, { FC } from "react";
import { directions, directionToDisplay } from "../../utils";
import { OnDirectionChange, TableSettings } from "../../interfaces";

interface DirectionSettingsProps {
  tableSettings: TableSettings;
  onDirectionChange: OnDirectionChange;
}

const DirectionSettings: FC<DirectionSettingsProps> = (props) => {
  const { tableSettings, onDirectionChange } = props;

  return (
    <div className="directionSettings">
      {directions.map((direction, index) => (
        <button
          className={
            tableSettings.direction === direction ? "clicked" : ""
          }
          key={index}
          onClick={() => onDirectionChange(direction)}
        >
          {directionToDisplay(direction)}
        </button>
      ))}
    </div>
  )
}


export default DirectionSettings;
