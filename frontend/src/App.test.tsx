import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock axios
jest.mock('axios');

test('renders toy robot simulator', () => {
  render(<App />);
  const titleElement = screen.getByText(/click to place the robot/i);
  expect(titleElement).toBeInTheDocument();
});
