// Manual mock for axios
const mockAxiosInstance = {
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
};

export default {
  create: jest.fn(() => mockAxiosInstance),
  mockAxiosInstance, // Export for test access
}; 