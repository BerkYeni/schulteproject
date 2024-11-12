import React, { FC } from "react";
import Chronometer from "./Chronometer";
import MatchesInfo from "./MatchesInfo";
import { ChronometerState, matchesInfoToDisplay } from "../../interfaces";
import { formatMatchDuration } from "../../utils";
import PersonalInfo from "./PersonalInfo";

interface StatisticsProps {
  hidden: boolean;
  chronometerState: ChronometerState;
  matchesInfoToDisplay: matchesInfoToDisplay;
  onResetMatches: () => void;
}

const Statistics: FC<StatisticsProps> = (props) => {
  const { hidden, chronometerState, onResetMatches, matchesInfoToDisplay } =
    props;

  const { lastPlayedRecord } = matchesInfoToDisplay;

  let lastPlayedInSeconds;
  if (lastPlayedRecord) {
    lastPlayedInSeconds = formatMatchDuration(lastPlayedRecord);
  }

  return (
    <div className={`statistics smoothTransition ${hidden ? "slideRight" : ""}`}>
      <div className="statisticsInner">
        <div className="chronometerAndMatchesInfoContainer">
          <Chronometer
            chronometerState={chronometerState}
            lastPlayedInSeconds={lastPlayedInSeconds}
          />
          <MatchesInfo
            matchesInfoToDisplay={matchesInfoToDisplay}
            onResetMatches={onResetMatches}
          />
        </div>
        <PersonalInfo />
      </div>
    </div>
  );
};

export default Statistics;
