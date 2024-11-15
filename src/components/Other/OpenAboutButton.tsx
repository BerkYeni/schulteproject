import React, { FC } from "react";

interface OpenAboutButtonProps {
  onOpenAbout: () => void;
}

const OpenAboutButton: FC<OpenAboutButtonProps> = (props) => {
  const { onOpenAbout } = props;

  return (
    <button
      id="openAboutButton"
      className={`screenControlButton smoothTransition tile unclicked`}
      onClick={onOpenAbout}
    >
      <span>{"❔"}</span>
    </button>
  )
}


export default OpenAboutButton;
