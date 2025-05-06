import { atom } from 'jotai';
import { AuthState } from '@/types/auth';

export const authAtom = atom<AuthState>({
  user: null,
  loading: true,
  error: null,
}); 