import React, { FC } from "react";
import { formatMatchDuration } from "../utils";
import { matchesInfoToDisplay } from "../interfaces";

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
        <div>Personal Best: {personalBestInSeconds} s</div>

        <div>
          Last Played: {lastPlayedInSeconds} s {isPersonalBest && " ⭐"}
        </div>
      </>
    );
  };

  return (
    <div className="matchesInfo">
      <button onClick={onResetMatches}>Reset</button>

      <div>{recordCategoryToDisplay}</div>

      <Records />
    </div>
  );
};

export default MatchesInfo;
