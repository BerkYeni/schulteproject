import React, { FC, useState } from "react";
import AboutSection from "./AboutSection";
import { aboutSections } from "./AboutSectionContents";

interface AboutProps {
  onCloseAbout: () => void;
  aboutIsHidden: boolean;
}

const About: FC<AboutProps> = (props) => {
  const { onCloseAbout, aboutIsHidden } = props;
  const [openedAccordionIndex, setOpenedAccordionIndex] = useState(0);
  

  return (
    <div className={aboutIsHidden ? "hidden" : ""}>
      <div className="aboutBgOverlay" onClick={onCloseAbout}></div>

      <div className="about">
        <button className="closeAboutButton" onClick={onCloseAbout}>X</button>

        {aboutSections.map((section, index) => 
          <AboutSection 
            key={index} 
            titleContent={section.title} 
            sectionContent={section.contentFunc()}
            accordionOpened={openedAccordionIndex === index}
            onAccordionClick={() => setOpenedAccordionIndex(index)}
          />)}
      </div>
    </div>
  )
}


export default About;
