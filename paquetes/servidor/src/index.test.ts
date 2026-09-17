import { describe, expect, it } from 'vitest';

import { VERSION_SERVIDOR } from './index.ts';

describe('servidor', () => {
  it('exporta su version', () => {
    expect(VERSION_SERVIDOR).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
