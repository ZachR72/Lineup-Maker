
export enum SportType {
  HOCKEY = 'hockey',
  SOCCER = 'soccer',
  BASEBALL = 'baseball',
  FOOTBALL = 'football',
  BASKETBALL = 'basketball'
}

export interface TacticalPosition {
  label: string;
  x: number;
  y: number;
}

export interface Formation {
  name: string;
  positions: TacticalPosition[];
}

export interface Player {
  id: string;
  name: string;
  number: string;
  position: string; // Primary
  secondaryPosition?: string;
  tertiaryPosition?: string;
  x: number;
  y: number;
  onBench: boolean;
  slotIndex?: number;
}

export interface Team {
  id: string;
  name: string;
  sportId: SportType;
  players: Player[];
  formationIndex: number;
  lastModified: number;
  formationRosters?: Record<number, Player[]>; // Stores unique rosters per formation
}

export interface SportConfig {
  id: SportType;
  name: string;
  icon: string;
  fieldColor: string;
  accentColor: string;
  formations: Formation[];
  aspectRatio: string;
  examples: string[];
}
