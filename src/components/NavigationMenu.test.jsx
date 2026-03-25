import { render, screen, fireEvent } from '@testing-library/react'
import { NavigationMenu } from './NavigationMenu'

beforeEach(() => {
    jest.clearAllMocks();
});

test('renders all navigation buttons', () => {
    render(<NavigationMenu />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Quote')).toBeInTheDocument();
    expect(screen.getByText('Flowers')).toBeInTheDocument();
    expect(screen.getByText('Saved')).toBeInTheDocument();
});

test('renders logo text', () => {
    render(<NavigationMenu />);
    const logo = screen.getByRole('heading', { level: 2 })
    expect(logo).toHaveTextContent('WILD');
    expect(logo).toHaveTextContent('FLOWER');
});

test('calls onHomeClick when Home button is clicked', () => {
    const mockHomeClick = jest.fn();  //fake function to record calls
    render(<NavigationMenu onHomeClick={mockHomeClick} />);
    fireEvent.click(screen.getByText('Home'));
    expect(mockHomeClick).toHaveBeenCalledTimes(1);
});

test('calls onQuoteClick when Quote button is clicked', () => {
    const mockQuoteClick = jest.fn();  //fake function to record calls
    render(<NavigationMenu onQuoteClick={mockQuoteClick} />);
    fireEvent.click(screen.getByText('Quote'));
    expect(mockQuoteClick).toHaveBeenCalledTimes(1);
});

test('calls onFlowersClick when Flowers button is clicked', () => {
    const mockFlowersClick = jest.fn();  //fake function to record calls
    render(<NavigationMenu onFlowersClick={mockFlowersClick} />);
    fireEvent.click(screen.getByText('Flowers'));
    expect(mockFlowersClick).toHaveBeenCalledTimes(1);
});

test('calls onSavedClick when Saved button is clicked', () => {
    const mockSavedClick = jest.fn();  //fake function to record calls
    render(<NavigationMenu onSavedClick={mockSavedClick} />);
    fireEvent.click(screen.getByText('Saved'));
    expect(mockSavedClick).toHaveBeenCalledTimes(1);
});