import React, { FC, useContext, useEffect, useState } from "react";
import { formatMatchDuration } from "../utils";
import { ChronometerState } from "../interfaces";

// TODO: make chronometer into a class or a closure

let chronometerIntervalId: undefined | NodeJS.Timer = undefined;

interface ChronometerProps {
  lastPlayedInSeconds: string | undefined;
  chronometerState: ChronometerState;
}

const Chronometer: FC<ChronometerProps> = (props) => {
  const { chronometerState, lastPlayedInSeconds } = props;
  const [seconds, setSeconds] = useState<number>(0);

  const initiateChronometer = () => {
    const interval = setInterval(() => {
      setSeconds((previousSeconds) => {
        return previousSeconds + 1;
      });
    }, 1000);

    return interval;
  };

  useEffect(() => {
    console.log(seconds);
  }, [seconds]);

  switch (chronometerState) {
    case "Idle":
      if (chronometerIntervalId !== undefined) {
        clearInterval(chronometerIntervalId);
        setSeconds((previousSeconds) => 0);
      }
      break;

    case "Active":
      if (chronometerIntervalId === undefined) {
        setSeconds((previousSeconds) => 0);
        chronometerIntervalId = initiateChronometer();
      }
      break;

    case "DisplayResult":
      if (chronometerIntervalId !== undefined) {
        clearInterval(chronometerIntervalId);
        chronometerIntervalId = undefined;
        setSeconds((previousSeconds) => 0);
      }
      break;
  }

  return (
    <div className="chronometer">
      {chronometerState === "Idle" ? (
        <span>--</span>
      ) : chronometerState === "Active" ? (
        <span>{seconds} s</span>
      ) : (
        <span>{lastPlayedInSeconds || "--"} seconds</span>
      )}
    </div>
  );
};

export default Chronometer;
