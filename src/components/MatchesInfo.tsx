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

  // const handleReset = () => {
  //   if (!setMatches) throw new Error("setMatches must not be null");
  //   setMatches([]);
  // };

  // TODO: find a better word than settings, settings sounds technical,
  // apply the same strategy as changing gamemode name 'classic' to 'vanilla'

  // const settingSpecificMatches = findSettingSpecificMatches(
  //   matches,
  //   gridSize,
  //   gameMode
  // );

  // const personalBestRecord = findPersonalBestRecord(settingSpecificMatches);
  // const personalBestSeconds = personalBestRecord
  //   ? formatMatchDuration(personalBestRecord)
  //   : undefined;

  // // TODO: i might wanna add date to match record type and sort them that way
  // const lastMatchRecord = findLastPlayed(settingSpecificMatches);
  // const lastMatchSeconds = lastMatchRecord
  //   ? formatMatchDuration(lastMatchRecord)
  //   : undefined;

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

      {/* <div>{`${gridSizeToDisplay(gridSize)} ${gameModeToDisplay(
        gameMode
      )}`}</div> */}

      {/* {settingSpecificMatches.length <= 0 ? (
        <div>No records yet.</div>
      ) : (
        <>
          <div>Personal Best: {personalBestSeconds} s</div>
          <div>
            Last Played: {lastMatchSeconds} s
            {lastMatchRecord === personalBestRecord && " ⭐"}
          </div>
        </>
      )} */}
    </div>
  );
};

export default MatchesInfo;
