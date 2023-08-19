import React, { FC } from "react";
import Chronometer from "./Chronometer";
import MatchesInfo from "./MatchesInfo";
import { ChronometerState, matchesInfoToDisplay } from "../interfaces";

interface StatisticsProps {
  hidden: boolean;
  chronometerState: ChronometerState;
  matchesInfoToDisplay: matchesInfoToDisplay;
  onResetMatches: () => void;
}

const Statistics: FC<StatisticsProps> = (props) => {
  const { hidden, chronometerState, onResetMatches, matchesInfoToDisplay } =
    props;

  return (
    <div className={`statistics ${hidden && "hidden"}`}>
      <Chronometer
        chronometerState={chronometerState}
        lastPlayedInSeconds={matchesInfoToDisplay.lastPlayedInSeconds}
      />
      <MatchesInfo
        matchesInfoToDisplay={matchesInfoToDisplay}
        onResetMatches={onResetMatches}
      />
    </div>
  );
};

export default Statistics;
