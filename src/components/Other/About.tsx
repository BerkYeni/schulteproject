import React, { FC, useState } from "react";
import AboutSection from "./AboutSection";
import { aboutSections } from "./AboutSectionContents";

interface AboutProps {
  onCloseAbout: () => void;
  aboutIsHidden: boolean;
}

const About: FC<AboutProps> = (props) => {
  const { onCloseAbout, aboutIsHidden } = props;
  const [openedAccordionIndex, setOpenedAccordionIndex] = useState<number | null>(0);
  
  return (
    <div className={aboutIsHidden ? "hidden" : ""}>
      <div className="aboutBgOverlay" onClick={onCloseAbout}></div>

      <div className="about">
        <button className="closeAboutButton" onClick={onCloseAbout}>X</button>
        
        <div className="aboutSections">
          {aboutSections.map((section, index) => 
            <AboutSection 
            key={index} 
            titleContent={section.title} 
            sectionContent={section.contentFunc()}
            accordionOpened={openedAccordionIndex === index}
            onAccordionClick={() => setOpenedAccordionIndex((prev) => prev === index ? null : index)}
            />)}
        </div>
      </div>
    </div>
  )
}


export default About;
