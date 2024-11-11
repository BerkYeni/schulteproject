import React, { FC } from "react";
import { GameMode, GameState, Setting, SettingLists, TableSettings } from "../../interfaces";

interface GenericGameSettingProps {
  settingToMap: SettingLists;
  currentSetting: TableSettings[keyof TableSettings] | GameMode;
  onSettingChange: (setting: string) => void;
  gameMode: GameMode;
  gameState: GameState;
  label: string;
  displayFunction: (setting: Setting) => string;
}

const GenericGameSetting: FC<GenericGameSettingProps> = (props) => {
  const { currentSetting, onSettingChange, gameState, settingToMap, gameMode, label, displayFunction } = props;

  return (
    <div>
      <label htmlFor={label}>{label}</label><br/>

      <select 
        disabled={gameState === "Playing" || gameState === "Countdown"} 
        className={gameState === "Playing" ? "dontClick" : ""}
        name={label} id={label} onChange={(event) => onSettingChange(event.target.value)}
      >
        {settingToMap.map((value, index) => (
          <option
            selected={value === currentSetting}
            className={currentSetting === value ? "clicked" : ""}
            key={index}
            value={value}
          >
            {displayFunction(value)}
          </option>
        ))}
      </select>
    </div>
  )
}


export default GenericGameSetting;