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

// --- Store State ---
type CycleState = {
  logs: Record<string, LogData>;
  cycleData: CycleData;
  isInitialized: boolean;
  initialize: () => void;
  saveLog: (date: Date, log: LogData) => void;
  logPeriod: (from: Date, to: Date) => void;
};

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
    const today = new Date();
    const defaultStart = addDays(today, -10);
    const defaultEnd = addDays(defaultStart, DEFAULT_PERIOD_LENGTH - 1);
    return {
      periods: [
        {
          from: format(defaultStart, 'yyyy-MM-dd'),
          to: format(defaultEnd, 'yyyy-MM-dd'),
        },
      ],
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
        parsedData.periodLength
      ) {
        return parsedData;
      }
    } catch (e) {
      console.error('Failed to parse cycle data from localStorage', e);
    }
  }

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

    let newCycleLength = cycleData.cycleLength;
    let newPeriodLength = cycleData.periodLength;

    if (cycleData.periods.length > 0) {
      const lastPeriod = cycleData.periods[cycleData.periods.length - 1];
      const lastCycleLength = differenceInDays(
        new Date(newPeriod.from),
        new Date(lastPeriod.from)
      );
      if (lastCycleLength > 10 && lastCycleLength < 60) {
        newCycleLength = Math.round(
          (cycleData.cycleLength + lastCycleLength) / 2
        );
      }
    }

    const currentPeriodLength =
      differenceInDays(new Date(newPeriod.to), new Date(newPeriod.from)) + 1;
    if (currentPeriodLength > 0 && currentPeriodLength < 15) {
      newPeriodLength = Math.round(
        (cycleData.periodLength + currentPeriodLength) / 2
      );
    }

    const updatedCycleData: CycleData = {
      periods: [...cycleData.periods, newPeriod].sort(
        (a, b) => new Date(a.from).getTime() - new Date(b.from).getTime()
      ),
      cycleLength: newCycleLength,
      periodLength: newPeriodLength,
    };

    saveCycleDataToStorage(updatedCycleData);
    set({ cycleData: updatedCycleData });
  },
}));
