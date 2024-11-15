import React, { FC } from "react";
import AboutSection from "./AboutSection";

interface AboutProps {
}

const About: FC<AboutProps> = (props) => {
  const sectionContent = () => (
    <span>This CodePen demonstrates how we can animate the opening and closing
    states of an accordion with fancy reveal animation using only CSS. This
    concept is suitable for creating <strong>FAQ sections</strong>,
    <strong>Table of Contents</strong>, and more.</span>
  )

  return (
    <div className="about">
      <button className="closeAboutButton">X</button>

      <AboutSection sectionId="overview" titleContent="Overview" sectionContent={sectionContent()} />
      <AboutSection sectionId="overview" titleContent="Overview" sectionContent={sectionContent()} />
      <AboutSection sectionId="overview" titleContent="Overview" sectionContent={sectionContent()} />
      <AboutSection sectionId="overview" titleContent="Overview" sectionContent={sectionContent()} />
      <AboutSection sectionId="overview" titleContent="Overview" sectionContent={sectionContent()} />
      <AboutSection sectionId="overview" titleContent="Overview" sectionContent={sectionContent()} />
      <AboutSection sectionId="overview" titleContent="Overview" sectionContent={sectionContent()} />
      <AboutSection sectionId="overview" titleContent="Overview" sectionContent={sectionContent()} />
      <AboutSection sectionId="overview" titleContent="Overview" sectionContent={sectionContent()} />
      <AboutSection sectionId="overview" titleContent="Overview" sectionContent={sectionContent()} />
      <AboutSection sectionId="overview" titleContent="Overview" sectionContent={sectionContent()} />

    </div>
  )
}


export default About;
