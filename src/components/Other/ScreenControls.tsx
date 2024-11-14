import React, { FC } from "react";
import { OnExposePanels, OnHidePanels } from "../../interfaces";
import HidePanelsButton from "./HidePanelsButton";
import ChangeThemeToggleButton from "./ChangeThemeToggleButton";

interface ScreenControlsProps {
  hidden: boolean;
  onHidePanels: OnHidePanels;
  onExposePanels: OnExposePanels;
}

const ScreenControls: FC<ScreenControlsProps> = (props) => {
  const { hidden, onHidePanels, onExposePanels } = props;

  return (
    <div>
      <HidePanelsButton hidden={hidden} onExposePanels={onExposePanels} onHidePanels={onHidePanels} />

      <ChangeThemeToggleButton />
    </div>
  )
}


export default ScreenControls;
