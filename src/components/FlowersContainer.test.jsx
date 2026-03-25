import { render, screen, fireEvent } from '@testing-library/react';
import { FlowersContainer } from './FlowersContainer';

beforeEach(() => {
    jest.clearAllMocks();
});

test('renders flowers title', () => {
    render(<FlowersContainer onSave={() => {}} savedCount={0} />);
    expect(screen.getByText('FLOWERS')).toBeInTheDocument();
});

test('renders forward and back buttons', () => {
   
    render(<FlowersContainer onSave={() => {}} savedCount={0} />);
    expect(screen.getByTestId('back-button')).toBeInTheDocument();
    expect(screen.getByTestId('forward-button')).toBeInTheDocument();
});

test('renders first flower image', () => {
    render(<FlowersContainer onSave={() => {}} savedCount={0} />);
    const firstFlowerImg = screen.getByRole('img');
    expect(firstFlowerImg).toHaveAttribute('src', '/flowersPngs/flower1.png');
});

test('clicking forward button changes flower', () => {
    render(<FlowersContainer onSave={() => {}} savedCount={0} />);
    const nextImg = screen.getByRole('img');
    expect(nextImg).toHaveAttribute('src', '/flowersPngs/flower1.png');
    fireEvent.click(screen.getByTestId('forward-button'));
    expect(nextImg).toHaveAttribute('src', '/flowersPngs/flower2.png')
});

test('clicking back button wraps to last flower', () => {
    render(<FlowersContainer onSave={() => {}} savedCount={0} />);
    fireEvent.click(screen.getByTestId('back-button'));
    const lastImg = screen.getByRole('img');
    expect(lastImg).toHaveAttribute('src', '/flowersPngs/flower10.png');
});

test('clicking flower box opens modal and it closes with cancel button', () => {
    render(<FlowersContainer onSave={() => {}} savedCount={0} />);
    fireEvent.click(screen.getByRole('img'));
    expect(screen.getByText('Decorate your flower!')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Decorate your flower!')).not.toBeInTheDocument();
});