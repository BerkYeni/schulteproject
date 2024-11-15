import React, { FC } from "react";
import { JsxElement } from "typescript";

interface AboutSectionProps {
  sectionId: string;
  titleContent: string;
  sectionContent: string | JSX.Element;
}

const AboutSection: FC<AboutSectionProps> = (props) => {
  const { sectionContent, sectionId, titleContent } = props;

  return (
    <section className="accordion" id={sectionId}>
      <h1 className="sectionTitle"><a href={`#about-${sectionId}`}>{titleContent}</a></h1>
      <div className="sectionContent">
        <div className="sectionContentWrapper">
          <p>
            {sectionContent}
          </p>
        </div>
      </div>
    </section>
  )
}


export default AboutSection;
