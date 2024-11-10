import React, { FC } from "react";
import { matchesInfoToDisplay } from "../../interfaces";
import { formatMatchDuration } from "../../utils";

interface MatchesInfoProps {
  onResetMatches: () => void;
  matchesInfoToDisplay: matchesInfoToDisplay;
}

const MatchesInfo: FC<MatchesInfoProps> = (props) => {
  const { onResetMatches, matchesInfoToDisplay } = props;

  const { lastPlayedRecord, personalBestRecord, recordCategoryToDisplay } =
    matchesInfoToDisplay;

  const Records: FC = (props) => {
    if (!(personalBestRecord && lastPlayedRecord)) {
      return <div>No records yet.</div>;
    }

    const isPersonalBest =
      personalBestRecord.durationInMilliseconds ===
      lastPlayedRecord.durationInMilliseconds;

    const personalBestInSeconds = formatMatchDuration(personalBestRecord);
    const lastPlayedInSeconds = formatMatchDuration(lastPlayedRecord);

    return (
      <>
        <div>Personal Best</div>
        <div className="pbText timeContainer">{personalBestInSeconds}<span className="secondsSign"> s</span></div>

        <div>Last Played</div>
        <div className="lpText timeContainer">
          {/* Last Played: {lastPlayedInSeconds} s {isPersonalBest ? " ⭐" : ""} */}
          {lastPlayedInSeconds}<span className="secondsSign"> s</span> {isPersonalBest ? " ⭐" : ""}
        </div>
      </>
    );
  };

  return (
    <div className="matchesInfo">
      {/* <button onClick={onResetMatches}>Reset</button> */}
      <div className="matchesInfoInner">
        {/* <div>{recordCategoryToDisplay}</div> */}
        <Records />
      </div>
    </div>
  );
};

export default MatchesInfo;
