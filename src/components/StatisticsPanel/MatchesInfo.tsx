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
    // if (!(personalBestRecord && lastPlayedRecord)) {
    //   return <div>No records yet.</div>;
    // }

    const isPersonalBest = lastPlayedRecord 
      ? personalBestRecord?.durationInMilliseconds === lastPlayedRecord?.durationInMilliseconds
      : false;
    
    const personalBestInSeconds = personalBestRecord ? formatMatchDuration(personalBestRecord) : null;
    const lastPlayedInSeconds = lastPlayedRecord ? formatMatchDuration(lastPlayedRecord) : null;

    return (
      <>
        <h1>Scores</h1>
        <div className="scoresContainer">
          <div className="scoresContainerInner">

            <div>Personal Best</div>
            <div className="pbText timeContainer">
              <span className="twinkleLittleStar">{personalBestRecord ? "⭐" : ""}</span>
              <span className="pbContent">{personalBestInSeconds || "--"}</span>
              <span className="secondsSign"> s</span>
            </div>
          </div>

          <div>

          <div className="lpLabel">Last Played</div>
          <div className="lpText timeContainer">
            <span className="twinkleLittleStar">{isPersonalBest ? " ⭐" : ""}</span>
            <span className="lpContent">{lastPlayedInSeconds || "--"}</span>
            <span className="secondsSign"> s</span>
          </div>
          </div>
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
