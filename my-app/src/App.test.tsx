import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import App from './App';

test('renders Blog Post 1', () => {
  render(<App />);
  expect(screen.getByText(/Blog Post 1/i)).toBeInTheDocument();
});
