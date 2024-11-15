import React, { FC } from "react";
import { OnExposePanels, OnHidePanels } from "../../interfaces";
import HidePanelsButton from "./HidePanelsButton";
import ChangeThemeToggleButton from "./ChangeThemeToggleButton";
import OpenAboutButton from "./OpenAboutButton";

interface ScreenControlsProps {
  hidden: boolean;
  onHidePanels: OnHidePanels;
  onExposePanels: OnExposePanels;
  onOpenAbout: () => void;
}

const ScreenControls: FC<ScreenControlsProps> = (props) => {
  const { hidden, onHidePanels, onExposePanels, onOpenAbout } = props;

  return (
    <div className="screenControls">
      <HidePanelsButton hidden={hidden} onExposePanels={onExposePanels} onHidePanels={onHidePanels} />

      <ChangeThemeToggleButton />

      <OpenAboutButton onOpenAbout={onOpenAbout} />
    </div>
  )
}


export default ScreenControls;
