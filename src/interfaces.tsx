import React, { ReactNode } from "react";

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

export type MemoryTile = {
  value: number;
  checked: boolean;
  animationPlaying: boolean;
  timeoutId: NodeJS.Timeout | undefined;
};

export type TableDirection = "Ascending" | "Descending";

export interface TableSettings {
  gridSize: GridSize;
  direction: TableDirection;
}

export interface Table {
  state: GameState;
  tiles: Tile[];
  expectedNumber: number;
  settings: TableSettings;
}

export interface MemoryTable {
  state: GameState;
  tiles: MemoryTile[];
  expectedNumber: number;
  settings: TableSettings;
}

export interface InputNumberAction {
  type: "InputNumber";
  inputtedNumber: number;
}

export interface StartCountDownAction {
  type: "StartCountDown";
}

export interface StartGameAction {
  type: "Start";
}

export interface ResetGameAction {
  type: "Reset";
}

export interface RestartGameAction {
  type: "Restart";
}

export interface ChangeGridSizeAction {
  type: "ChangeGridSize";
  gridSize: GridSize;
}

export interface ChangeDirectionAction {
  type: "ChangeDirection";
  direction: TableDirection;
}

export interface StopAnimationAction {
  type: "StopAnimation";
  value: number;
}

export type TableAction =
  | InputNumberAction
  | StartGameAction
  | ResetGameAction
  | RestartGameAction
  | ChangeGridSizeAction
  | ChangeDirectionAction;

export type MemoryTableAction =
  | InputNumberAction
  | StartCountDownAction
  | StartGameAction
  | ResetGameAction
  | RestartGameAction
  | ChangeGridSizeAction
  | ChangeDirectionAction
  | StopAnimationAction;

export interface MarkStartAction {
  type: "Mark";
}

export interface SaveRecordAction {
  type: "SaveRecord";
  tableSettings: TableSettings;
}

export type MatchRecordAction = MarkStartAction | SaveRecordAction;

export interface MatchRecord {
  gridSize: GridSize;
  durationInMilliseconds: number;
  gameMode: GameMode;
  startTime: Date;
  direction: TableDirection;
}

export enum GameMode {
  Vanilla,
  Memory,
  Reaction,
  Line,
}

export interface GameModeRule {
  winCondition: (
    pressedNumber: number,
    tiles: number[],
    expectedNumber: number
  ) => boolean;
  expectedNumberSetter: (previousExpectedNumber: number) => number;
}

export type ChronometerState =
  | "Idle"
  | "Active"
  | "DisplayResult"
  | "Countdown";

export interface matchesInfoToDisplay {
  recordCategoryToDisplay: string;
  personalBestRecord: MatchRecord | undefined;
  lastPlayedRecord: MatchRecord | undefined;
}


export interface ControlPanelEventCallbacks {
  onGridSizeChange: (gridSize: GridSize) => void;
  onGameModeChange: (gameMode: GameMode) => void;
  onDirectionChange: (direction: TableDirection) => void;
}

export type OnHidePanels = () => void;
export type OnExposePanels = () => void;
export type OnGridSizeChange = ControlPanelEventCallbacks['onGridSizeChange'];
export type OnGameModeChange = ControlPanelEventCallbacks['onGameModeChange'];
export type OnDirectionChange = ControlPanelEventCallbacks['onDirectionChange'];



export interface GenericTile extends Tile {
  animationPlaying?: boolean;
  timeoutId?: NodeJS.Timeout;
}

export type SchulteTile = Tile | MemoryTile;
