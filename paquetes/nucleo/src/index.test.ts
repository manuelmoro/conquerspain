import { describe, expect, it } from 'vitest';

import { VERSION_NUCLEO } from './index.ts';

describe('motor de reglas', () => {
  it('exporta su version', () => {
    expect(VERSION_NUCLEO).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
