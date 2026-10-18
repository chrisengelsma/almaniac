// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';
import { setBodyScrollLocked } from '../nativeOverlay';

describe('setBodyScrollLocked', () => {
  afterEach(() => {
    while (document.documentElement.classList.contains('overlay-present')) {
      setBodyScrollLocked(false);
    }
    document.body.style.overflow = '';
  });

  it('ref-counts overlay-present so nested modals stay blocked until all close', () => {
    setBodyScrollLocked(true);
    setBodyScrollLocked(true);
    expect(document.documentElement.classList.contains('overlay-present')).toBe(true);

    setBodyScrollLocked(false);
    expect(document.documentElement.classList.contains('overlay-present')).toBe(true);

    setBodyScrollLocked(false);
    expect(document.documentElement.classList.contains('overlay-present')).toBe(false);
  });
});
