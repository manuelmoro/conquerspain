import { describe, expect, it } from 'vitest';

import { VERSION_BANCO } from './index.ts';

describe('banco de pruebas', () => {
  it('exporta su version', () => {
    expect(VERSION_BANCO).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
