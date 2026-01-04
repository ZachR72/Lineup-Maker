
import React from 'react';
import { SportType } from '../types';

interface FieldVisualizerProps {
  sport: SportType;
}

export const FieldVisualizer: React.FC<FieldVisualizerProps> = ({ sport }) => {
  const renderField = () => {
    switch (sport) {
      case SportType.SOCCER:
        return (
          <svg viewBox="0 0 100 150" className="w-full h-full shadow-inner">
            <rect width="100" height="150" fill="#00AA00" />
            <g fill="none" stroke="white" strokeWidth="1">
              <rect x="2" y="2" width="96" height="146" />
              <line x1="2" y1="75" x2="98" y2="75" />
              <circle cx="50" cy="75" r="15" />
              <circle cx="50" cy="75" r="0.5" fill="white" />
              {/* Penalty Areas */}
              <rect x="20" y="2" width="60" height="25" />
              <rect x="35" y="2" width="30" height="8" />
              <circle cx="50" cy="18" r="0.5" fill="white" />
              <path d="M 35 27 Q 50 35 65 27" />
              
              <rect x="20" y="123" width="60" height="25" />
              <rect x="35" y="140" width="30" height="8" />
              <circle cx="50" cy="132" r="0.5" fill="white" />
              <path d="M 35 123 Q 50 115 65 123" />
              
              {/* Corners */}
              <path d="M 2 7 A 5 5 0 0 0 7 2" />
              <path d="M 93 2 A 5 5 0 0 0 98 7" />
              <path d="M 98 143 A 5 5 0 0 0 93 148" />
              <path d="M 7 148 A 5 5 0 0 0 2 143" />
            </g>
          </svg>
        );
      case SportType.BASKETBALL:
        return (
          <svg viewBox="0 0 100 150" className="w-full h-full">
            <rect width="100" height="150" fill="#f5deb3" />
            <g fill="none" stroke="black" strokeWidth="0.8">
              <rect x="2" y="2" width="96" height="146" />
              <line x1="2" y1="75" x2="98" y2="75" />
              <circle cx="50" cy="75" r="15" />
              
              {/* Top Key */}
              <rect x="35" y="2" width="30" height="40" fill="#FFA500" stroke="black" />
              <path d="M 35 42 A 15 15 0 0 0 65 42" strokeDasharray="2,2" />
              <path d="M 35 42 A 15 15 0 0 1 65 42" />
              <circle cx="50" cy="15" r="3" stroke="black" />
              <line x1="42" y1="15" x2="58" y2="15" />
              <path d="M 10 2 L 10 15 A 40 40 0 0 0 90 15 L 90 2" />

              {/* Bottom Key */}
              <rect x="35" y="108" width="30" height="40" fill="#FFA500" stroke="black" />
              <path d="M 35 108 A 15 15 0 0 1 65 108" strokeDasharray="2,2" />
              <path d="M 35 108 A 15 15 0 0 0 65 108" />
              <circle cx="50" cy="135" r="3" stroke="black" />
              <line x1="42" y1="135" x2="58" y2="135" />
              <path d="M 10 148 L 10 135 A 40 40 0 0 1 90 135 L 90 148" />
            </g>
          </svg>
        );
      case SportType.HOCKEY:
        return (
          <svg viewBox="0 0 100 150" className="w-full h-full">
            <rect width="100" height="150" fill="#f0faff" rx="10" />
            <g fill="none" strokeWidth="1">
              <rect x="2" y="2" width="96" height="146" rx="10" stroke="#0077be" />
              
              <line x1="2" y1="75" x2="98" y2="75" stroke="red" strokeWidth="1.5" />
              <line x1="2" y1="50" x2="98" y2="50" stroke="blue" strokeWidth="2" />
              <line x1="2" y1="100" x2="98" y2="100" stroke="blue" strokeWidth="2" />
              <line x1="10" y1="10" x2="90" y2="10" stroke="red" strokeWidth="1" />
              <line x1="10" y1="140" x2="90" y2="140" stroke="red" strokeWidth="1" />
              
              <circle cx="50" cy="75" r="15" stroke="#0077be" />
              <circle cx="50" cy="75" r="1.5" fill="red" stroke="none" />
              
              <g stroke="red" strokeWidth="0.8">
                <circle cx="25" cy="30" r="12" />
                <circle cx="75" cy="30" r="12" />
                <circle cx="25" cy="120" r="12" />
                <circle cx="75" cy="120" r="12" />
              </g>
              
              <path d="M 42 10 A 8 8 0 0 0 58 10" fill="#00aaff" stroke="none" />
              <path d="M 42 140 A 8 8 0 0 1 58 140" fill="#00aaff" stroke="none" />
            </g>
          </svg>
        );
      case SportType.FOOTBALL:
        return (
          <svg viewBox="0 0 100 150" className="w-full h-full">
            <rect width="100" height="150" fill="#228B22" />
            <g fill="white" textAnchor="middle" fontSize="4" fontWeight="bold">
              {/* Field Boundaries */}
              <rect x="5" y="10" width="90" height="130" fill="none" stroke="white" strokeWidth="1" />
              {/* End zones */}
              <rect x="5" y="0" width="90" height="10" fill="#006400" />
              <rect x="5" y="140" width="90" height="10" fill="#006400" />
              
              {/* Yard lines every 10 yards */}
              {[20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130].map((y) => (
                <line key={y} x1="5" y1={y} x2="95" y2={y} stroke="white" strokeWidth="0.3" opacity="0.6" />
              ))}
              
              {/* Yard numbers */}
              {[10, 20, 30, 40, 50, 40, 30, 20, 10].map((num, i) => {
                const yPos = 130 - (i+1)*12;
                return (
                  <g key={i}>
                     <text x="12" y={yPos} fill="white" opacity="0.7" transform={`rotate(90, 12, ${yPos})`}>{num}</text>
                     <text x="88" y={yPos} fill="white" opacity="0.7" transform={`rotate(-90, 88, ${yPos})`}>{num}</text>
                  </g>
                );
              })}
              
              {/* Hash marks */}
              <line x1="40" y1="10" x2="40" y2="140" stroke="white" strokeWidth="0.2" strokeDasharray="1,3" />
              <line x1="60" y1="10" x2="60" y2="140" stroke="white" strokeWidth="0.2" strokeDasharray="1,3" />
            </g>
          </svg>
        );
      case SportType.BASEBALL:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <defs>
              <pattern id="grass-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <rect width="5" height="10" fill="#1b5e20" />
                <rect x="5" width="5" height="10" fill="#2e7d32" />
              </pattern>
            </defs>
            <path d="M 50 2 A 62 62 0 0 1 98 62 L 50 98 L 2 62 A 62 62 0 0 1 50 2" fill="#8d6e63" />
            <path d="M 50 6 A 58 58 0 0 1 94 62 L 50 94 L 6 62 A 58 58 0 0 1 50 6" fill="url(#grass-pattern)" />
            <path d="M 50 48 L 74 65 L 50 90 L 26 65 Z" fill="#cd853f" stroke="#8b4513" strokeWidth="0.3" />
            <path d="M 50 56 L 68 65 L 50 82 L 32 65 Z" fill="url(#grass-pattern)" />
            <g stroke="white" strokeWidth="0.5">
              <line x1="50" y1="92" x2="94" y2="62" />
              <line x1="50" y1="92" x2="6" y2="62" />
            </g>
            <g fill="#cd853f">
               <circle cx="50" cy="92" r="6" />
               <circle cx="50" cy="65" r="3.5" stroke="#8b4513" strokeWidth="0.2" />
               <line x1="48.5" y1="65" x2="51.5" y2="65" stroke="white" strokeWidth="0.4" />
               <circle cx="75" cy="65" r="3" />
               <circle cx="50" cy="48" r="3" />
               <circle cx="25" cy="65" r="3" />
            </g>
            <g fill="white" stroke="#ccc" strokeWidth="0.1">
               <path d="M 50 95 L 48 93 L 48 91 L 52 91 L 52 93 Z" fill="white" stroke="none" />
               <rect x="73.5" y="63.5" width="3" height="3" transform="rotate(45, 75, 65)" />
               <rect x="48.5" y="46.5" width="3" height="3" transform="rotate(45, 50, 48)" />
               <rect x="23.5" y="63.5" width="3" height="3" transform="rotate(45, 25, 65)" />
            </g>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full overflow-hidden flex items-center justify-center">
      {renderField()}
    </div>
  );
};
