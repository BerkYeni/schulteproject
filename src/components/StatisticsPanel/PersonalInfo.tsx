import React, { FC } from "react";
// import { ReactComponent as GithubMark } from "../../github-mark/github-mark-white.svg";
import githubMark from "../../github-mark/github-mark-white.png";
import berkyeniMark from "../../berkyeni-mark.png";


interface PersonalInfoProps {
}

const PersonalInfo: FC<PersonalInfoProps> = (props) => {
  // const {  } = props;

  return (
    <div className="personalInfo">

      <a href="https://berkyeni.com" className="infoLink" target="_blank" rel="noopener noreferrer">
        <div className="siteLinkInner">
          <span className="linkContent">Visit my website</span><img className="siteMark" src={berkyeniMark} alt="Berk Yeni's Mark" />
        </div>
      </a>

      <a href="https://github.com/BerkYeni/schulteproject" className="infoLink" target="_blank" rel="noopener noreferrer">
        <div className="siteLinkInner">
          <span className="linkContent">See the source code</span><img className="siteMark" src={githubMark} alt="GitHub Mark" />
        </div>
      </a>

    </div>
  );
};

export default PersonalInfo;
