import { Capacitor } from '@capacitor/core';
import { InAppReview } from '@capacitor-community/in-app-review';

const USAGE_STORAGE_KEY = 'almaniac.usage.v1';
const MIN_USAGE_DAYS = 4;

export interface AppUsageState {
  usageDays: string[];
  reviewPrompted: boolean;
}

function defaultAppUsageState(): AppUsageState {
  return {
    usageDays: [],
    reviewPrompted: false,
  };
}

function todayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function loadAppUsageState(): AppUsageState {
  try {
    const raw = localStorage.getItem(USAGE_STORAGE_KEY);
    if (!raw) {
      return defaultAppUsageState();
    }

    const parsed = JSON.parse(raw) as Partial<AppUsageState>;
    if (!Array.isArray(parsed.usageDays)) {
      return defaultAppUsageState();
    }

    return {
      usageDays: parsed.usageDays.filter((day): day is string => typeof day === 'string'),
      reviewPrompted: Boolean(parsed.reviewPrompted),
    };
  } catch {
    return defaultAppUsageState();
  }
}

function saveAppUsageState(state: AppUsageState): void {
  localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(state));
}

export function recordTodayUsage(): AppUsageState {
  const state = loadAppUsageState();
  const today = todayKey();

  if (state.usageDays.includes(today)) {
    return state;
  }

  const nextState: AppUsageState = {
    ...state,
    usageDays: [...state.usageDays, today].sort(),
  };
  saveAppUsageState(nextState);
  return nextState;
}

export function shouldRequestAppReview(state: AppUsageState): boolean {
  if (state.reviewPrompted) {
    return false;
  }

  if (!Capacitor.isNativePlatform()) {
    return false;
  }

  return state.usageDays.length >= MIN_USAGE_DAYS;
}

export async function requestNativeAppReview(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    await InAppReview.requestReview();
  } catch {
    // The OS may decline to show the dialog; we still stop auto-prompting.
  }
}

export function markReviewPrompted(): void {
  const state = loadAppUsageState();
  saveAppUsageState({
    ...state,
    reviewPrompted: true,
  });
}
