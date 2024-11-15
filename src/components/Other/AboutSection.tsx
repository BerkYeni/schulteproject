import React, { FC, useState } from "react";

interface AboutSectionProps {
  titleContent: string;
  sectionContent: string | JSX.Element;
}

const AboutSection: FC<AboutSectionProps> = (props) => {
  const { sectionContent, titleContent } = props;

  const [accordionOpened, setAccordionOpened] = useState(false);

  return (
    <div className="accordion">
      <h1 
        className="accordionHeader" 
        onClick={() => setAccordionOpened((prev) => !prev)}
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

  // return (
  //   <section className="accordion" id={sectionId}>
  //     <h1 className="sectionTitle"><a href={`#about-${sectionId}`}>{titleContent}</a></h1>
  //     <div className="sectionContent">
  //       <div className="sectionContentWrapper">
  //         <p>
  //           {sectionContent}
  //         </p>
  //       </div>
  //     </div>
  //   </section>
  // )
}


export default AboutSection;
