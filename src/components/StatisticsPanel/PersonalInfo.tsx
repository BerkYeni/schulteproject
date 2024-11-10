import React, { FC } from "react";
// import { ReactComponent as GithubMark } from "../../github-mark/github-mark-white.svg";
import githubMark from "../../github-mark/github-mark-white.png"

interface PersonalInfoProps {
}

const PersonalInfo: FC<PersonalInfoProps> = (props) => {
  // const {  } = props;

  return (
    <div className="personalInfo">

      <a href="https://github.com/BerkYeni/schulteproject" className="infoLink" target="_blank" rel="noopener noreferrer">
        <div className="github">
          <span>See the source code</span><img className="githubMark" src={githubMark} alt="GitHub Mark" />
        </div>
      </a>

      <a href="https://berkyeni.com" className="infoLink" target="_blank" rel="noopener noreferrer">
        <div className="github">
          <span>Visit my website</span><img className="githubMark" src={githubMark} alt="Berk Yeni's Mark" />
        </div>
      </a>

    </div>
  );
};

export default PersonalInfo;
