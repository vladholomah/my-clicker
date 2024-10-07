import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

jest.mock('./hooks/useTelegram', () => ({
  useTelegram: () => ({
    user: { id: 12345, first_name: 'Test', last_name: 'User', username: 'testuser' },
    tg: {}
  })
}));

describe('App Component', () => {
  test('renders App component', () => {
    render(<App />);
    const appElement = screen.getByTestId('app-container');
    expect(appElement).toBeInTheDocument();
  });
});