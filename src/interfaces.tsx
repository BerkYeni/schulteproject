export type GameState = "NotStarted" | "Countdown" | "Playing" | "Completed";

export enum GridSize {
  Size3x3 = 9,
  Size4x4 = 16,
  Size5x5 = 25,
}

export interface Tile {
  value: number;
  checked: boolean;
}

export interface Table {
  state: GameState;
  tiles: Tile[];
  expectedNumber: number;
}

// TODO: make base action state
// note: these should be enum prolly
export interface InputNumberAction {
  type: "InputNumber";
  inputtedNumber: number;
}

export interface StartGameAction {
  type: "Start";
}

export interface RestartGameAction {
  type: "Restart";
}

export type TableAction =
  | InputNumberAction
  | StartGameAction
  | RestartGameAction;

export interface MarkStartAction {
  type: "Mark";
}

export interface SaveRecordAction {
  type: "SaveRecord";
}

export type MatchRecordAction = MarkStartAction | SaveRecordAction;

export interface MatchRecord {
  gridSize: GridSize;
  durationInMilliseconds: number;
  gameMode: GameMode;
  startTime: Date;
}

export enum GameMode {
  Vanilla,
  Reverse,
  Memory,
  Reaction,
}

export interface GameModeRule {
  winCondition: (
    pressedNumber: number,
    tiles: number[],
    expectedNumber: number
  ) => boolean;
  expectedNumberSetter: (previousExpectedNumber: number) => number;
}

export type ChronometerState = "Idle" | "Active" | "DisplayResult";

export interface matchesInfoToDisplay {
  recordCategoryToDisplay: string;
  personalBestRecord: MatchRecord | undefined;
  lastPlayedRecord: MatchRecord | undefined;
}
