import React, { FC, useState } from "react";

interface AboutSectionProps {
  titleContent: string;
  sectionContent: string | JSX.Element;
  accordionOpened: boolean;
  onAccordionClick: () => void;
}

const AboutSection: FC<AboutSectionProps> = (props) => {
  const { sectionContent, titleContent, accordionOpened, onAccordionClick } = props;

  // const [accordionOpened, setAccordionOpened] = useState(false);

  return (
    <div className="accordion">
      <h1 
        className="accordionHeader" 
        onClick={() => onAccordionClick()}
      >
        {titleContent}
      </h1>
      <div className={`accordionWrapper ${accordionOpened ? "accordionWrapperOpen" : ""}`}>
        <div className="accordionContent">
          {sectionContent}
        </div>
      </div>
    </div>
  )
}


export default AboutSection;
