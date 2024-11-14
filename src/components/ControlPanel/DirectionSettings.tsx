import React, { FC } from "react";
import { directions, directionToDisplay } from "../../utils";
import { GameState, OnDirectionChange, TableDirection, TableSettings } from "../../interfaces";

interface DirectionSettingsProps {
  tableSettings: TableSettings;
  onDirectionChange: OnDirectionChange;
  gameState: GameState;
}

const DirectionSettings: FC<DirectionSettingsProps> = (props) => {
  const { tableSettings, onDirectionChange, gameState } = props;

  return (
    <div className="setting">
      <div>Direction</div>

      <select 
        defaultValue={tableSettings.direction} 
        disabled={gameState === "Playing" || gameState === "Countdown"} 
        className={gameState === "Playing" ? "dontClick" : ""}
        name="directionSetting" id="directionSetting" 
        onChange={(event) => onDirectionChange(event.target.value as TableDirection)}
      >
        {directions.map((direction, index) => (
          <option
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
