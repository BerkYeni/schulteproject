import React, { FC } from "react";
import { OnExposePanels, OnHidePanels } from "../../interfaces";

interface HidePanelsButtonProps {
  hidden: boolean;
  onHidePanels: OnHidePanels;
  onExposePanels: OnExposePanels;
}

const HidePanelsButton: FC<HidePanelsButtonProps> = (props) => {
  // possibly add a custom hook for controlling hide/expose logic
  const { hidden, onHidePanels, onExposePanels } = props;

  return (
    <button
      id="exposePanelsButton"
      className={`screenControlButton exposePanels smoothTransition tile unclicked`}
      onClick={hidden ? onExposePanels : onHidePanels}
    >
      <span>{hidden ? "➕" : "➖"}</span>
    </button>
  )
}


export default HidePanelsButton;
