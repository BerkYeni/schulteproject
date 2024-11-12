import React, { FC, useState } from "react";
import stopSign from "../../stopSign.png";
import { ChronometerState } from "../../interfaces";

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

  switch (chronometerState) {
    case "Idle":
    case "DisplayResult":
      if (chronometerIntervalId !== undefined) {
        clearInterval(chronometerIntervalId);
        chronometerIntervalId = undefined;
      }
      if (seconds !== 0) {
        setSeconds((previousSeconds) => 0);
      }
      break;

    case "Active":
      if (chronometerIntervalId === undefined) {
        if (seconds !== 0) {
          setSeconds((previousSeconds) => 0);
        }
        chronometerIntervalId = initiateChronometer();
      }
      break;

    case "Countdown":
      break;
  }

  return (
    <div className="chronometer">
      <h1 className="timerLabel">Timer</h1>
      <div className={`timeContainer ${chronometerState === "Active" ? "timerRunning" : ""}`}>
        {chronometerState === "Idle" ? (
          <><span>--</span><span className="secondsSign"> s</span></>
        ) : chronometerState === "Active" ? (
          <><span>{seconds}</span><span className="secondsSign"> s</span></>
        ) : chronometerState === "Countdown" ? (
          <span>
            <img className="stopSign" src={stopSign} alt="Wait" />
          </span>
        ) : (
          <><span>{lastPlayedInSeconds || "--"}</span><span className="secondsSign"> s</span></>
        )}

      </div>
    </div>
  );
};

export default Chronometer;
