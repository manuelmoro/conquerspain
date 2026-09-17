import { describe, expect, it } from 'vitest';

import { VERSION_MUNDO } from './index.ts';

describe('datos del mundo', () => {
  it('exporta su version', () => {
    expect(VERSION_MUNDO).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
