import React from 'react';

export interface Level {
  id: number;
  title: string;
  riddle: string;
  password: string;
  icon: React.ReactNode;
  hint: string;
  bonus?: string;
  note?: string;
}

export type GameState = 'intro' | 'playing' | 'finished' | 'transition' | 'my-artem';

export type RoomId = 'kitchen' | 'bathroom' | 'bedroom' | 'living';

export interface ArtemStats {
  hunger: number;
  hygiene: number;
  energy: number;
  happiness: number;
  isSleeping: boolean;
  outfit: string;
  level: number;
  exp: number;
  activeRoom: RoomId;
}

export type ArtemAction = 'feed' | 'wash' | 'sleep' | 'play' | 'outfit' | 'poke';

export interface Outfit {
  id: string;
  name: string;
  style: string;
}
