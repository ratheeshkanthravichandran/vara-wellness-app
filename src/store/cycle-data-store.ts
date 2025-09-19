'use client';
import { create } from 'zustand';
import { addDays, format, differenceInDays, startOfDay } from 'date-fns';

// --- Data Types ---
export type LogData = {
  flow: 'none' | 'light' | 'medium' | 'heavy';
  symptoms: string[];
  mood: number; // Scale 1-5
  energy: number; // Scale 1-10
};

export type CycleData = {
  periods: { from: string; to: string }[];
  cycleLength: number;
  periodLength: number;
};

// --- Constants ---
const DEFAULT_CYCLE_LENGTH = 28;
const DEFAULT_PERIOD_LENGTH = 5;

// --- Helper Functions for localStorage ---
function getLogsFromStorage(): Record<string, LogData> {
  if (typeof window === 'undefined') return {};
  const savedLogs = window.localStorage.getItem('vara-cycle-logs');
  return savedLogs ? JSON.parse(savedLogs) : {};
}

function saveLogsToStorage(logs: Record<string, LogData>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('vara-cycle-logs', JSON.stringify(logs));
}

function getCycleDataFromStorage(): CycleData {
  if (typeof window === 'undefined') {
    return {
      periods: [],
      cycleLength: DEFAULT_CYCLE_LENGTH,
      periodLength: DEFAULT_PERIOD_LENGTH,
    };
  }

  const savedData = window.localStorage.getItem('vara-cycle-data');
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);
      if (
        parsedData.periods &&
        parsedData.cycleLength &&
        parsedData.periodLength &&
        parsedData.periods.length > 0
      ) {
        return parsedData;
      }
    } catch (e) {
      console.error('Failed to parse cycle data from localStorage', e);
    }
  }

  // Create default data only if nothing valid is found
  const today = new Date();
  const defaultStart = addDays(today, -10);
  const defaultEnd = addDays(defaultStart, DEFAULT_PERIOD_LENGTH - 1);
  const defaultCycleData: CycleData = {
    periods: [
      {
        from: format(defaultStart, 'yyyy-MM-dd'),
        to: format(defaultEnd, 'yyyy-MM-dd'),
      },
    ],
    cycleLength: DEFAULT_CYCLE_LENGTH,
    periodLength: DEFAULT_PERIOD_LENGTH,
  };
  window.localStorage.setItem('vara-cycle-data', JSON.stringify(defaultCycleData));
  return defaultCycleData;
}


function saveCycleDataToStorage(data: CycleData) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('vara-cycle-data', JSON.stringify(data));
}

// --- Zustand Store Definition ---
export const useCycleStore = create<CycleState>((set, get) => ({
  logs: {},
  cycleData: {
    periods: [],
    cycleLength: DEFAULT_CYCLE_LENGTH,
    periodLength: DEFAULT_PERIOD_LENGTH,
  },
  isInitialized: false,

  initialize: () => {
    if (get().isInitialized) return;
    set({
      logs: getLogsFromStorage(),
      cycleData: getCycleDataFromStorage(),
      isInitialized: true,
    });
  },

  saveLog: (date, log) => {
    const logKey = format(date, 'yyyy-MM-dd');
    const newLogs = { ...get().logs, [logKey]: log };
    saveLogsToStorage(newLogs);
    set({ logs: newLogs });
  },

  logPeriod: (from, to) => {
    const { cycleData } = get();
    const newPeriod = {
      from: format(startOfDay(from), 'yyyy-MM-dd'),
      to: format(startOfDay(to), 'yyyy-MM-dd'),
    };

    const newPeriods = [...cycleData.periods, newPeriod].sort(
      (a, b) => new Date(a.from).getTime() - new Date(b.from).getTime()
    );

    // Recalculate average cycle length
    let totalCycleDays = 0;
    let cycleCount = 0;
    for (let i = 1; i < newPeriods.length; i++) {
        const cycleLength = differenceInDays(new Date(newPeriods[i].from), new Date(newPeriods[i-1].from));
        if (cycleLength > 10 && cycleLength < 60) {
            totalCycleDays += cycleLength;
            cycleCount++;
        }
    }
    const newCycleLength = cycleCount > 0 ? Math.round(totalCycleDays / cycleCount) : cycleData.cycleLength;

    // Recalculate average period length
    const totalPeriodDays = newPeriods.reduce((sum, period) => {
      const length = differenceInDays(new Date(period.to), new Date(period.from)) + 1;
      return sum + length;
    }, 0);
    const newPeriodLength = Math.round(totalPeriodDays / newPeriods.length);

    const updatedCycleData: CycleData = {
      periods: newPeriods,
      cycleLength: newCycleLength,
      periodLength: newPeriodLength,
    };

    saveCycleDataToStorage(updatedCycleData);
    set({ cycleData: updatedCycleData });
  },
}));
