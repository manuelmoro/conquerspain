import { describe, expect, it } from 'vitest';

import { VERSION_ATLAS } from './index.ts';

describe('herramienta atlas', () => {
  it('exporta su version', () => {
    expect(VERSION_ATLAS).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
