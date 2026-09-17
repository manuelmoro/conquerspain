import { describe, expect, it } from 'vitest';

import { VERSION_CLIENTE } from './index.ts';

describe('cliente', () => {
  it('exporta su version', () => {
    expect(VERSION_CLIENTE).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
