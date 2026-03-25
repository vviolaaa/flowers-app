import { render, screen } from '@testing-library/react';
import { Header } from './Header';

beforeEach(() => {
    jest.clearAllMocks();
});

test('renders header', () => {
    render(<Header />);
    const header = screen.getByRole('heading');   //find element by its role
    expect(header).toBeInTheDocument();           //assertion
});

test('shows login button when not logged in', ()=> {
    render(<Header />);
    expect(screen.getByText('Login / Sign up')).toBeInTheDocument();
});

test('shows username when logged in', () => {
    render(<Header username="Charles Leclerc" onLogout={() => {}}/>);
    expect(screen.getByText('Charles Leclerc')).toBeInTheDocument();
});

test('shows logout button when logged in', () => {
    render(<Header username="Charles Leclerc" onLogout={() => {}}/>);
    expect(screen.getByText('Log out')).toBeInTheDocument();
})