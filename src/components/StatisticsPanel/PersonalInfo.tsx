import React, { FC } from "react";
import { ReactComponent as GithubMark } from '../../../public/github-mark/github-mark-white.svg';

interface PersonalInfoProps {
}

const PersonalInfo: FC<PersonalInfoProps> = (props) => {
  // const {  } = props;

  return (
    <div>
      See source code
      <GithubMark />
    </div>
  );
};

export default PersonalInfo;
