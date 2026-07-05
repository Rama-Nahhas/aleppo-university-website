import { describe, expect, it } from 'vitest';
import { resolveRoleName } from './roleUtils.ts';

describe('resolveRoleName', () => {
  it('returns student when the user has role_id 6', () => {
    expect(resolveRoleName({ role_id: 6 } as any)).toBe('student');
  });

  it('returns student when the user has role.name', () => {
    expect(resolveRoleName({ role: { name: 'student' } } as any)).toBe('student');
  });

  it('returns student when the user has role_name', () => {
    expect(resolveRoleName({ role_name: 'student' } as any)).toBe('student');
  });
});
