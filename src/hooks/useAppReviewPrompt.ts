import { useEffect } from 'react';
import {
  markReviewPrompted,
  recordTodayUsage,
  requestNativeAppReview,
  shouldRequestAppReview,
} from '../lib/appReview';

const PROMPT_DELAY_MS = 3000;

export function useAppReviewPrompt(): void {
  useEffect(() => {
    const state = recordTodayUsage();
    if (!shouldRequestAppReview(state)) {
      return;
    }

    const timer = window.setTimeout(() => {
      void requestNativeAppReview().finally(() => {
        markReviewPrompted();
      });
    }, PROMPT_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);
}
