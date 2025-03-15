import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock environment variables
vi.mock('./env', () => ({
  VITE_STRIPE_PUBLIC_KEY: 'pk_test_mock',
  VITE_STRIPE_PRICE_ID: 'price_mock'
}));

// Mock sessionStorage
const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0
};

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage
});

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
});