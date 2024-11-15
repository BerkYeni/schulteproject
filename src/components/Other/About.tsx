import React, { FC } from "react";
import AboutSection from "./AboutSection";

interface AboutProps {
}

const About: FC<AboutProps> = (props) => {
  const aboutSections = [
    {
      title: "🧩 About This Website",
      contentFunc: () => (
        <p>Welcome to a space designed for <strong>relaxation and fun</strong> through a simple yet engaging game: the <strong>Schulte Table</strong>. Whether you're here to test your cognitive skills or just unwind, this site has something for you!</p>
      ),
    },
    {
      title: "🎮 What is a Schulte Table?",
      contentFunc: () => (
        <p>The <strong>Schulte Table</strong> is a cognitive exercise invented by German psychotherapist <strong>Walter Schulte</strong>. It’s a classic game that sharpens focus and mental agility. The goal is straightforward:</p>
      ),
    },
  ];

  return (
    <div className="about">
      <button className="closeAboutButton">X</button>

      {aboutSections.map((section, index) => <AboutSection key={index} titleContent={section.title} sectionContent={section.contentFunc()} />)}
    </div>
  )
}


export default About;
