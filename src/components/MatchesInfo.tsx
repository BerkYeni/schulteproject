import React, { FC, useContext, useState } from "react";
import {
  findLastPlayed,
  findPersonalBestRecord,
  findSettingSpecificMatches,
  formatMatchDuration,
  gameModeToDisplay,
  gridSizeToDisplay,
} from "../utils";
import { GridSize, MatchRecord, matchesInfoToDisplay } from "../interfaces";
import { Match } from "@testing-library/react";

interface MatchesInfoProps {
  onResetMatches: () => void;
  matchesInfoToDisplay: matchesInfoToDisplay;
}

const MatchesInfo: FC<MatchesInfoProps> = (props) => {
  const { onResetMatches, matchesInfoToDisplay } = props;

  const { lastPlayedInSeconds, personalBestInSeconds, recordCategory } =
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

  return (
    <div className="matchesInfo">
      <button onClick={onResetMatches}>Reset</button>

      <div>{recordCategory}</div>

      {!personalBestInSeconds ? (
        <div>No personal best record.</div>
      ) : (
        <div>Personal Best: {personalBestInSeconds} s</div>
      )}

      {!lastPlayedInSeconds ? (
        <div>No records yet.</div>
      ) : (
        <div>Last Played: {lastPlayedInSeconds} s</div>
      )}

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
