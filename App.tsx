import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HashRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { SportType, Player, SportConfig, Formation, Team } from './types';
import { SPORTS, MOCK_NAMES } from './constants';
import { FieldVisualizer } from './components/FieldVisualizer';

// --- Persistence Helpers ---

const STORAGE_KEY = 'lineup_maker_teams_v3_clean';

const loadTeams = (): Team[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load teams:", e);
    return [];
  }
};

const saveTeams = (teams: Team[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
  } catch (e) {
    console.error("Failed to save teams:", e);
  }
};

// --- Shared Components ---

const GlassCard: React.FC<{ children: React.ReactNode, className?: string, onClick?: () => void }> = ({ children, className, onClick }) => (
  <div 
    onClick={onClick}
    className={`glass rounded-2xl md:rounded-3xl overflow-hidden transition-soft ${className} ${onClick ? 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]' : ''}`}
  >
    {children}
  </div>
);

// --- Pages ---

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const stored = loadTeams().sort((a, b) => b.lastModified - a.lastModified);
    setTeams(stored);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 min-h-screen flex flex-col">
      <div className="text-center mb-10 md:mb-16 space-y-2 md:space-y-4 animate-float">
        <h1 className="text-4xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 uppercase">
          Lineup Maker
        </h1>
        <p className="text-xs md:text-xl text-slate-400 font-light tracking-widest uppercase">Professional Team Studio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlassCard 
          onClick={() => navigate('/create')}
          className="min-h-[13rem] flex flex-col items-center justify-center gap-4 border-dashed border-white/20 hover:border-white/40 group bg-white/5"
        >
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth={2.5} strokeLinecap="round" /></svg>
          </div>
          <span className="text-lg font-bold tracking-tight uppercase text-white/60 group-hover:text-white transition-colors">Create New Lineup</span>
        </GlassCard>

        {teams.map(team => {
          const sport = SPORTS.find(s => s.id === team.sportId) || SPORTS[0];
          const startersCount = team.players.filter(p => !p.onBench).length;
          
          return (
            <GlassCard 
              key={team.id}
              onClick={() => navigate(`/team/${team.id}`)}
              className="min-h-[13rem] h-auto p-6 flex flex-col justify-between gap-6 group relative border border-white/5 hover:border-white/20"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3 w-full">
                  <span className="text-4xl shrink-0">{sport.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors whitespace-normal break-words uppercase leading-tight">{team.name}</h3>
                    <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest mt-1">{sport.name}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex -space-x-2">
                  {team.players.filter(p => !p.onBench).slice(0, 5).map(p => (
                    <div key={p.id} className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-slate-900 flex items-center justify-center text-[9px] font-black shadow-lg">
                      {p.number}
                    </div>
                  ))}
                  {startersCount > 5 && (
                    <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[9px] font-bold text-white/40 shadow-lg">
                      +{startersCount - 5}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-white/20 font-black uppercase tracking-widest">
                  {new Date(team.lastModified).toLocaleDateString()}
                </span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

const CreateTeamPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [selectedSport, setSelectedSport] = useState<SportType | null>(null);
  const [placeholder, setPlaceholder] = useState('');

  // Update dynamic placeholder
  useEffect(() => {
    if (selectedSport) {
      const sport = SPORTS.find(s => s.id === selectedSport);
      if (sport && sport.examples) {
        const randomExample = sport.examples[Math.floor(Math.random() * sport.examples.length)];
        setPlaceholder(`e.g. ${randomExample}`);
      }
    } else {
      // Pick a random sport, then a random real team from its examples list
      const randomSport = SPORTS[Math.floor(Math.random() * SPORTS.length)];
      const randomExample = randomSport.examples[Math.floor(Math.random() * randomSport.examples.length)];
      setPlaceholder(`e.g. ${randomExample}`);
    }
  }, [selectedSport]);

  const handleCreate = () => {
    if (!selectedSport) return;
    
    const sport = SPORTS.find(s => s.id === selectedSport)!;
    const finalName = name.trim() || `Untitled ${sport.name} Team`;
    
    const initialPlayers: Player[] = sport.formations[0].positions.map((pos, idx) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
      number: (Math.floor(Math.random() * 99) + 1).toString(),
      position: pos.label,
      x: pos.x,
      y: pos.y,
      onBench: false,
      slotIndex: idx
    }));

    const newTeam: Team = {
      id: Math.random().toString(36).substr(2, 9),
      name: finalName,
      sportId: selectedSport,
      players: initialPlayers,
      formationIndex: 0,
      lastModified: Date.now(),
      formationRosters: {
        0: initialPlayers
      }
    };

    const existing = loadTeams();
    saveTeams([...existing, newTeam]);
    navigate(`/team/${newTeam.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 min-h-screen">
      <GlassCard className="p-8 md:p-12 space-y-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <h2 className="text-3xl font-black tracking-tight uppercase">New Lineup</h2>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-widest text-white/40 block ml-1">Lineup Name (Optional)</label>
          <input 
            type="text" 
            placeholder={placeholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-widest text-white/40 block ml-1">Select Arena</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {SPORTS.map(sport => (
              <button
                key={sport.id}
                onClick={() => setSelectedSport(sport.id)}
                className={`p-6 rounded-2xl flex flex-col items-center gap-3 transition-soft border-2 ${selectedSport === sport.id ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
              >
                <span className="text-4xl">{sport.icon}</span>
                <span className="text-sm font-bold">{sport.name}</span>
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleCreate}
          disabled={!selectedSport}
          className="w-full py-5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-20 disabled:cursor-not-allowed rounded-2xl text-xl font-black uppercase tracking-widest transition-soft shadow-xl shadow-indigo-500/20"
        >
          Initialize Studio
        </button>
      </GlassCard>
    </div>
  );
};

const EditorPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  
  const [team, setTeam] = useState<Team | null>(null);
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const [editingPositionsId, setEditingPositionsId] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    const teams = loadTeams();
    const found = teams.find(t => t.id === teamId);
    if (found) {
      setTeam(found);
      setIsSaved(true);
    } else {
      navigate('/');
    }
  }, [teamId, navigate]);

  const sport = useMemo(() => {
    if (!team) return SPORTS[0];
    return SPORTS.find(s => s.id === team.sportId) || SPORTS[0];
  }, [team]);

  const currentFormation = useMemo(() => {
    if (!team || !sport) return SPORTS[0].formations[0];
    return sport.formations[team.formationIndex] || sport.formations[0];
  }, [sport, team]);

  const startersBySlot = useMemo(() => {
    const map: Record<number, Player> = {};
    if (!team) return map;
    team.players.filter(p => !p.onBench).forEach(p => {
      if (p.slotIndex !== undefined) map[p.slotIndex] = p;
    });
    return map;
  }, [team?.players]);

  const updateTeam = useCallback((updates: Partial<Team>) => {
    setTeam(prev => {
      if (!prev) return null;
      setIsSaved(false);
      
      const updatedTeam = { 
        ...prev, 
        ...updates, 
        lastModified: Date.now() 
      };

      if (updates.players && !updates.formationRosters) {
        updatedTeam.formationRosters = {
          ...(prev.formationRosters || {}),
          [updatedTeam.formationIndex]: updates.players
        };
      }
      
      const teams = loadTeams();
      saveTeams(teams.map(t => t.id === prev.id ? updatedTeam : t));
      
      setTimeout(() => setIsSaved(true), 1200);
      return updatedTeam;
    });
  }, []);

  const updatePlayer = (id: string, updates: Partial<Player>) => {
    if (!team) return;
    const newPlayers = team.players.map(p => p.id === id ? { ...p, ...updates } : p);
    updateTeam({ players: newPlayers });
  };

  const handleFormationChange = (idx: number) => {
    if (!team) return;
    const prevIdx = team.formationIndex;
    const nextFormation = sport.formations[idx];
    
    const rosters = { ...(team.formationRosters || {}) };
    rosters[prevIdx] = [...team.players];

    let nextPlayers: Player[];

    if (rosters[idx]) {
      nextPlayers = rosters[idx];
    } else {
      nextPlayers = team.players.map(p => {
        if (p.onBench) return p;
        if (p.slotIndex !== undefined && p.slotIndex < nextFormation.positions.length) {
          const newPos = nextFormation.positions[p.slotIndex];
          return { ...p, position: newPos.label, x: newPos.x, y: newPos.y };
        }
        return { ...p, onBench: true, slotIndex: undefined };
      });
      rosters[idx] = nextPlayers;
    }

    updateTeam({ 
      formationIndex: idx, 
      players: nextPlayers,
      formationRosters: rosters
    });
  };

  const fillSlotFromBench = (slotIdx: number, benchPlayerId: string) => {
    if (!team || !benchPlayerId) return;
    const pos = currentFormation.positions[slotIdx];
    const newPlayers = team.players.map(p => {
      if (p.id === benchPlayerId) {
        return { ...p, onBench: false, slotIndex: slotIdx, position: pos.label, x: pos.x, y: pos.y };
      }
      if (!p.onBench && p.slotIndex === slotIdx) {
        return { ...p, onBench: true, slotIndex: undefined };
      }
      return p;
    });
    updateTeam({ players: newPlayers });
  };

  const fillSlotWithNew = (slotIdx: number) => {
    if (!team) return;
    const pos = currentFormation.positions[slotIdx];
    const newPlayer: Player = {
      id: Math.random().toString(36).substr(2, 9),
      name: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
      number: (Math.floor(Math.random() * 99) + 1).toString(),
      position: pos.label,
      x: pos.x,
      y: pos.y,
      onBench: false,
      slotIndex: slotIdx
    };
    updateTeam({ players: [...team.players, newPlayer] });
  };

  const toggleBench = (id: string) => {
    if (!team) return;
    const player = team.players.find(p => p.id === id);
    if (!player) return;

    if (!player.onBench) {
      updatePlayer(id, { onBench: true, slotIndex: undefined });
    } else {
      const starters = team.players.filter(p => !p.onBench);
      const occupiedSlots = new Set(starters.map(s => s.slotIndex));
      let targetSlot = -1;
      for (let i = 0; i < currentFormation.positions.length; i++) {
        if (!occupiedSlots.has(i)) {
          targetSlot = i;
          break;
        }
      }

      if (targetSlot !== -1) {
        const pos = currentFormation.positions[targetSlot];
        updatePlayer(id, { onBench: false, slotIndex: targetSlot, position: pos.label, x: pos.x, y: pos.y });
      } else {
        const lastStarter = starters[starters.length - 1];
        if (!lastStarter) return;
        const pos = currentFormation.positions[lastStarter.slotIndex!];
        const newPlayers = team.players.map(p => {
          if (p.id === id) return { ...p, onBench: false, slotIndex: lastStarter.slotIndex, position: pos.label, x: pos.x, y: pos.y };
          if (!p.onBench && p.id === lastStarter.id) return { ...p, onBench: true, slotIndex: undefined };
          return p;
        });
        updateTeam({ players: newPlayers });
      }
    }
  };

  const addBenchPlayer = () => {
    if (!team) return;
    const newPlayer: Player = {
      id: Math.random().toString(36).substr(2, 9),
      name: "New Prospect",
      number: (Math.floor(Math.random() * 99) + 1).toString(),
      position: "SUB",
      x: 0,
      y: 0,
      onBench: true
    };
    updateTeam({ players: [...team.players, newPlayer] });
  };

  if (!team) return null;

  const benched = team.players.filter(p => p.onBench);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen p-3 md:p-8 gap-4 md:gap-8 overflow-x-hidden">
      
      <div className="flex items-center justify-between lg:hidden mb-2">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
          Studio
        </button>
        <div className="text-right ml-4 flex-1">
          <h2 className="text-base font-black whitespace-normal break-words uppercase leading-tight">{team.name}</h2>
          <div className="flex items-center justify-end gap-1.5 mt-1">
            <div className={`w-1.5 h-1.5 rounded-full ${isSaved ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
            <p className="text-[8px] uppercase font-bold text-white/30">{isSaved ? 'Auto-Saved' : 'Saving...'}</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[480px] flex flex-col gap-4 md:gap-6 shrink-0 lg:h-full lg:overflow-hidden order-2 lg:order-1">
        
        <GlassCard className="hidden lg:flex p-6 shrink-0 items-start justify-between gap-4">
          <button onClick={() => navigate('/')} className="hover:text-white/60 transition-colors flex items-center gap-2 font-bold text-xs uppercase tracking-widest mt-1 shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
            Dashboard
          </button>
          <div className="text-right flex-1 min-w-0">
            <h2 className="text-lg font-black whitespace-normal break-words uppercase leading-tight">{team.name}</h2>
            <div className="flex items-center justify-end gap-1.5 mt-1">
              <div className={`w-1.5 h-1.5 rounded-full ${isSaved ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
              <p className="text-[9px] uppercase font-bold text-white/30 tracking-widest">{isSaved ? 'Auto-Saved' : 'Saving...'}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 shrink-0 flex flex-col gap-3 border-white/10">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-2">Select Formation</h3>
          <div className="flex flex-row lg:flex-wrap gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            {sport.formations.map((f, i) => (
              <button
                key={f.name}
                onClick={() => handleFormationChange(i)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-bold transition-soft ${team.formationIndex === i ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="flex-1 p-4 md:p-6 flex flex-col gap-4 lg:h-full lg:overflow-hidden">
          <div className="flex justify-between items-start gap-4">
             <div className="flex items-center gap-2 flex-1">
                <input 
                  type="text" 
                  value={team.name}
                  onChange={(e) => updateTeam({ name: e.target.value })}
                  className="bg-transparent font-bold focus:outline-none border-b border-transparent focus:border-indigo-500 transition-colors w-full uppercase leading-tight"
                  placeholder="Lineup Name"
                />
             </div>
          </div>

          <div className="flex-1 lg:overflow-y-auto custom-scrollbar space-y-6 pb-8">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-3 ml-1">Starting Lineup</h4>
              <div className="space-y-2.5">
                {currentFormation.positions.map((pos, idx) => {
                  const player = startersBySlot[idx];
                  if (!player) {
                    return (
                      <div key={`empty-${idx}`} className="p-3 rounded-xl border border-dashed border-white/5 bg-white/2 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                           <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-[8px] font-black text-white/10">?</div>
                           <span className="text-[10px] font-bold text-white/10 uppercase tracking-widest">{pos.label} (VACANT)</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <select 
                            className="bg-slate-800 text-[8px] font-bold p-1 rounded border border-white/5 focus:outline-none cursor-pointer"
                            onChange={(e) => fillSlotFromBench(idx, e.target.value)}
                            value=""
                           >
                             <option value="" disabled>BENCH</option>
                             {benched.map(bp => <option key={bp.id} value={bp.id}>{bp.name}</option>)}
                           </select>
                           <button 
                            onClick={() => fillSlotWithNew(idx)}
                            className="text-[8px] font-bold bg-white/5 px-2 py-1 rounded hover:bg-white/10 text-white/20"
                           >
                            + NEW
                           </button>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div 
                      key={player.id} 
                      className={`group p-3 rounded-xl glass-dark border transition-soft flex flex-col gap-2 ${activePlayerId === player.id ? 'border-indigo-500 ring-2 ring-indigo-500/10' : 'border-white/5'}`}
                      onMouseEnter={() => setActivePlayerId(player.id)}
                      onMouseLeave={() => setActivePlayerId(null)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] bg-slate-900 border border-white/20 shrink-0 text-white shadow-inner">
                          <input 
                            type="text"
                            maxLength={2}
                            value={player.number}
                            onChange={(e) => updatePlayer(player.id, { number: e.target.value })}
                            className="bg-transparent w-full text-center focus:outline-none font-black"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <input 
                            type="text" 
                            value={player.name}
                            onChange={(e) => updatePlayer(player.id, { name: e.target.value })}
                            className="bg-transparent text-sm font-semibold w-full focus:outline-none"
                            placeholder="Player Name"
                          />
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[8px] uppercase font-bold text-indigo-400">{player.position}</span>
                            {(player.secondaryPosition || player.tertiaryPosition) && (
                              <span className="text-[8px] uppercase font-bold text-white/40">
                                {player.secondaryPosition && ` / ${player.secondaryPosition}`}
                                {player.tertiaryPosition && ` / ${player.tertiaryPosition}`}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => setEditingPositionsId(editingPositionsId === player.id ? null : player.id)}
                            className={`p-1 transition-colors ${editingPositionsId === player.id ? 'text-indigo-400' : 'text-white/20 hover:text-white'}`}
                            title="Edit Roles"
                          >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" strokeWidth={2} strokeLinecap="round" /></svg>
                          </button>
                          <button 
                            onClick={() => toggleBench(player.id)}
                            className="p-1 text-white/10 hover:text-red-400"
                            title="Move to Bench"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth={2} strokeLinecap="round"/></svg>
                          </button>
                        </div>
                      </div>
                      
                      {editingPositionsId === player.id && (
                        <div className="flex gap-2 mt-2 pt-2 border-t border-white/5 animate-in fade-in slide-in-from-top-1 duration-200">
                          <div className="flex-1">
                            <label className="text-[7px] uppercase font-bold text-white/30 block mb-1">Secondary Position</label>
                            <input 
                              type="text" 
                              value={player.secondaryPosition || ''}
                              onChange={(e) => updatePlayer(player.id, { secondaryPosition: e.target.value })}
                              className="bg-white/5 text-[10px] p-1.5 rounded w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-white/5"
                              placeholder="e.g. Nickel"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-[7px] uppercase font-bold text-white/30 block mb-1">Tertiary Position</label>
                            <input 
                              type="text" 
                              value={player.tertiaryPosition || ''}
                              onChange={(e) => updatePlayer(player.id, { tertiaryPosition: e.target.value })}
                              className="bg-white/5 text-[10px] p-1.5 rounded w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-white/5"
                              placeholder="e.g. ST"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3 ml-1">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tactical Bench</h4>
                <button onClick={addBenchPlayer} className="text-indigo-400 hover:text-indigo-300">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth={3} strokeLinecap="round"/></svg>
                </button>
              </div>
              <div className="space-y-2">
                {benched.map(player => (
                  <div key={player.id} className="p-3 rounded-xl glass-dark border border-white/5 flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-black text-white border border-white/5 shadow-inner">
                        <input 
                          type="text" 
                          value={player.number}
                          onChange={(e) => updatePlayer(player.id, { number: e.target.value })}
                          className="bg-transparent w-full text-center focus:outline-none"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <input 
                          type="text" 
                          value={player.name}
                          onChange={(e) => updatePlayer(player.id, { name: e.target.value })}
                          className="bg-transparent text-xs font-semibold w-full focus:outline-none"
                          placeholder="Player Name"
                        />
                      </div>
                      <button 
                        onClick={() => toggleBench(player.id)}
                        className="text-[8px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300"
                      >
                        PROMOTE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="flex-1 relative w-full flex items-center justify-center order-1 lg:order-2 py-4 lg:p-16 overflow-hidden">
        <div 
          className={`w-full max-w-sm lg:max-w-md shadow-2xl relative overflow-hidden group border border-white/10 transition-all duration-700 bg-black/20 rounded-[24px] md:rounded-[40px] ${sport.aspectRatio}`}
        >
          <div className="absolute inset-0">
            <FieldVisualizer sport={sport.id} />
          </div>

          <div className="absolute inset-0 pointer-events-none">
            {team.players.filter(p => !p.onBench).map(player => (
              <div
                key={player.id}
                style={{ left: `${player.x}%`, top: `${player.y}%` }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out ${activePlayerId === player.id ? 'z-50' : 'z-10'}`}
              >
                <div className="flex flex-col items-center">
                   <div 
                    className={`w-9 h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full bg-slate-950/90 flex items-center justify-center flex-col border transition-soft shadow-xl pointer-events-auto cursor-pointer ${activePlayerId === player.id ? 'ring-4 ring-white/50 bg-slate-900 border-white scale-110' : 'border-white/20 hover:scale-110 hover:border-white/40'}`}
                    onClick={() => setActivePlayerId(player.id)}
                  >
                    <span className="text-[10px] md:text-[13px] font-black text-white drop-shadow-lg leading-none">{player.number}</span>
                    <span className="text-[5px] md:text-[6px] lg:text-[7px] font-bold opacity-60 uppercase tracking-tighter leading-none mt-0.5">{player.position}</span>
                  </div>
                  <div className={`mt-1 md:mt-2 glass-dark px-1.5 md:px-2 py-0.5 md:py-1 rounded-md backdrop-blur-md border border-white/5 shadow-sm transition-opacity duration-300 ${activePlayerId === player.id ? 'opacity-100 ring-1 ring-white/30 translate-y-[-2px]' : 'opacity-90'}`}>
                    <span className="text-[6px] md:text-[8px] font-black whitespace-nowrap text-white drop-shadow-sm uppercase tracking-tight">{player.name || "UNNAMED"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<CreateTeamPage />} />
        <Route path="/team/:teamId" element={<EditorPage />} />
      </Routes>
    </HashRouter>
  );
};

export default App;