import { SportType, SportConfig } from './types';

export const SPORTS: SportConfig[] = [
  {
    id: SportType.SOCCER,
    name: 'Soccer',
    icon: '⚽',
    fieldColor: 'bg-[#008000]',
    accentColor: 'text-emerald-400',
    aspectRatio: 'aspect-[2/3]',
    examples: ['Manchester City', 'Real Madrid', 'Liverpool FC', 'FC Barcelona', 'Bayern Munich'],
    formations: [
      {
        name: '4-4-2 Wide',
        positions: [
          { label: 'GK', x: 50, y: 135 }, 
          { label: 'LB', x: 15, y: 110 }, { label: 'LCB', x: 35, y: 115 },
          { label: 'RCB', x: 65, y: 115 }, { label: 'RB', x: 85, y: 110 }, 
          { label: 'LM', x: 15, y: 75 }, { label: 'LCM', x: 38, y: 80 }, 
          { label: 'RCM', x: 62, y: 80 }, { label: 'RM', x: 85, y: 75 },
          { label: 'LST', x: 32, y: 35 }, { label: 'RST', x: 68, y: 35 }
        ]
      },
      {
        name: '4-3-3 Spread',
        positions: [
          { label: 'GK', x: 50, y: 135 }, 
          { label: 'LB', x: 15, y: 108 }, { label: 'LCB', x: 35, y: 118 },
          { label: 'RCB', x: 65, y: 118 }, { label: 'RB', x: 85, y: 108 }, 
          { label: 'CDM', x: 50, y: 90 }, { label: 'LCM', x: 28, y: 68 }, 
          { label: 'RCM', x: 72, y: 68 }, { label: 'LW', x: 18, y: 28 },
          { label: 'RW', x: 82, y: 28 }, { label: 'ST', x: 50, y: 20 }
        ]
      }
    ]
  },
  {
    id: SportType.BASKETBALL,
    name: 'Basketball',
    icon: '🏀',
    fieldColor: 'bg-[#FDF5E6]',
    accentColor: 'text-orange-400',
    aspectRatio: 'aspect-[2/3]',
    examples: ['Los Angeles Lakers', 'Golden State Warriors', 'Boston Celtics', 'Chicago Bulls', 'Miami Heat'],
    formations: [
      {
        name: 'Man-to-Man',
        positions: [
          { label: 'PG', x: 50, y: 105 }, { label: 'SG', x: 20, y: 85 }, { label: 'SF', x: 80, y: 85 },
          { label: 'PF', x: 30, y: 50 }, { label: 'C', x: 70, y: 50 }
        ]
      },
      {
        name: '2-3 Zone',
        positions: [
          { label: 'LG', x: 35, y: 100 }, { label: 'RG', x: 65, y: 100 }, { label: 'LF', x: 15, y: 65 },
          { label: 'RF', x: 85, y: 65 }, { label: 'C', x: 50, y: 50 }
        ]
      }
    ]
  },
  {
    id: SportType.HOCKEY,
    name: 'Hockey',
    icon: '🏒',
    fieldColor: 'bg-white',
    accentColor: 'text-blue-400',
    aspectRatio: 'aspect-[2/3]',
    examples: ['Montreal Canadiens', 'Toronto Maple Leafs', 'Chicago Blackhawks', 'Detroit Red Wings', 'Boston Bruins'],
    formations: [
      {
        name: 'Standard 5v5',
        positions: [
          { label: 'G', x: 50, y: 130 }, { label: 'LD', x: 25, y: 105 }, { label: 'RD', x: 75, y: 105 },
          { label: 'LW', x: 15, y: 55 }, { label: 'C', x: 50, y: 60 }, { label: 'RW', x: 85, y: 55 }
        ]
      },
      {
        name: 'Power Play (1-3-1)',
        positions: [
          { label: 'G', x: 50, y: 130 }, { label: 'D', x: 50, y: 100 }, { label: 'LW', x: 15, y: 65 },
          { label: 'RW', x: 85, y: 65 }, { label: 'B', x: 50, y: 55 }, { label: 'C', x: 50, y: 25 }
        ]
      }
    ]
  },
  {
    id: SportType.FOOTBALL,
    name: 'Football',
    icon: '🏈',
    fieldColor: 'bg-[#228B22]',
    accentColor: 'text-green-400',
    aspectRatio: 'aspect-[2/3]',
    examples: ['Kansas City Chiefs', 'Dallas Cowboys', 'SF 49ers', 'NE Patriots', 'Pittsburgh Steelers'],
    formations: [
      {
        name: 'Shotgun Spread',
        positions: [
          { label: 'C', x: 50, y: 45 }, 
          { label: 'LG', x: 40, y: 45 }, 
          { label: 'RG', x: 60, y: 45 }, 
          { label: 'LT', x: 30, y: 45 }, 
          { label: 'RT', x: 70, y: 45 },
          { label: 'WR1', x: 8, y: 32 }, 
          { label: 'WR2', x: 22, y: 32 }, 
          { label: 'WR3', x: 78, y: 32 }, 
          { label: 'WR4', x: 92, y: 32 },
          { label: 'QB', x: 50, y: 76 }, 
          { label: 'RB', x: 38, y: 76 }
        ]
      },
      {
        name: 'Base 3-4 Defense',
        positions: [
          { label: 'NT', x: 50, y: 43 }, 
          { label: 'LDE', x: 38, y: 43 }, 
          { label: 'RDE', x: 62, y: 43 }, 
          { label: 'LOLB', x: 20, y: 55 }, 
          { label: 'ROLB', x: 80, y: 55 },
          { label: 'LILB', x: 42, y: 65 }, 
          { label: 'RILB', x: 58, y: 65 },
          { label: 'LCB', x: 10, y: 40 }, 
          { label: 'RCB', x: 90, y: 40 },
          { label: 'FS', x: 30, y: 28 }, 
          { label: 'SS', x: 70, y: 28 }
        ]
      },
      {
        name: 'Nickel 2-4-5',
        positions: [
          { label: 'LDT', x: 46, y: 58 }, 
          { label: 'RDT', x: 54, y: 58 }, 
          { label: 'LOLB', x: 22, y: 55 }, 
          { label: 'ROLB', x: 78, y: 55 }, 
          { label: 'LILB', x: 44, y: 70 }, 
          { label: 'RILB', x: 56, y: 70 },
          { label: 'LCB', x: 10, y: 42 }, 
          { label: 'RCB', x: 90, y: 42 }, 
          { label: 'NIC', x: 50, y: 40 }, 
          { label: 'FS', x: 32, y: 25 }, 
          { label: 'SS', x: 68, y: 25 }
        ]
      }
    ]
  },
  {
    id: SportType.BASEBALL,
    name: 'Baseball',
    icon: '⚾',
    fieldColor: 'bg-[#2E8B57]',
    accentColor: 'text-amber-400',
    aspectRatio: 'aspect-square',
    examples: ['NY Yankees', 'LA Dodgers', 'Boston Red Sox', 'Chicago Cubs', 'St. Louis Cardinals'],
    formations: [
      {
        name: 'Standard Defense',
        positions: [
          { label: 'P', x: 50, y: 65 }, { label: 'C', x: 50, y: 92 }, { label: '1B', x: 80, y: 68 },
          { label: '2B', x: 68, y: 50 }, { label: 'SS', x: 32, y: 50 }, { label: '3B', x: 20, y: 68 },
          { label: 'LF', x: 18, y: 32 }, { label: 'CF', x: 50, y: 18 }, { label: 'RF', x: 82, y: 32 }
        ]
      }
    ]
  }
];

export const MOCK_NAMES = [
  "Alexander", "Jordan", "Marcus", "Elena", "Lucas", "Sophie", "Ryan", "Maya", 
  "Liam", "Noah", "Olivia", "James", "Benjamin", "Henry", "Theodore", "Jack"
];