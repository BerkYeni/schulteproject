import React, { FC } from "react";
import { OnExposePanels, OnHidePanels } from "../interfaces";

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
      // className={`exposePanels tile unclicked ${!hidden && "hidden"}`}
      className={`exposePanels tile unclicked ${hidden && "rotateAround"}`}
      onClick={hidden ? onExposePanels : onHidePanels}
    >
      ←
    </button>
  )
}


export default HidePanelsButton;
