import { render, screen, fireEvent } from '@testing-library/react';
import { FlowerModal } from './FlowerModal';

const mockFlower = {
    image: '/flowersPngs/flower1.png',
    name: 'Rose',
};

jest.mock('../data/flowersData', () => ({
    bows: [
        { id: 1, image: '/bows/bow1.png', label: 'Red Bow' },
        { id: 2, image: '/bows/bow2.png', label: 'Blue Bow' },
    ],
}));

const defaultProps = {
    flower: mockFlower,
    onClose: jest.fn(),
    onSave: jest.fn(),
    savedCount: 0,
};

beforeEach(() => {
    jest.clearAllMocks();
});

test('renders the modal with title', () => {
    render(<FlowerModal {...defaultProps} />);
    expect(screen.getByText('Decorate your flower!')).toBeInTheDocument();
});

test('renders the flower image', () => {
    render(<FlowerModal {...defaultProps} />);
    const flowerImg = screen.getByAltText('Rose');
    expect(flowerImg).toBeInTheDocument();
    expect(flowerImg).toHaveAttribute('src', '/flowersPngs/flower1.png');
});

test('renders all bow options', () => {
    render(<FlowerModal {...defaultProps} />);
    expect(screen.getByAltText('Red Bow')).toBeInTheDocument();
    expect(screen.getByAltText('Blue Bow')).toBeInTheDocument();
});

test('renders Save and Cancel buttons', () => {
    render(<FlowerModal {...defaultProps} />);
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
});

test('does not show Remove Bow button initially', () => {
    render(<FlowerModal {...defaultProps} />);
    expect(screen.queryByText('Remove Bow')).not.toBeInTheDocument();
});

test('calls onClose when Cancel is clicked', () => {
    render(<FlowerModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
});

test('calls onClose when overlay is clicked', () => {
    render(<FlowerModal {...defaultProps} />);
    const overlay = screen.getByTestId('modal-overlay');
    fireEvent.click(overlay);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
});

test('does not call onClose when modal content is clicked', () => {
    render(<FlowerModal {...defaultProps} />);
    const content = screen.getByTestId('modal-content');
    fireEvent.click(content);
    expect(defaultProps.onClose).not.toHaveBeenCalled();
});

test('places a bow on drop and shows Remove Bow button', () => {
    render(<FlowerModal {...defaultProps} />);

    const bowImg = screen.getByAltText('Red Bow');
    fireEvent.dragStart(bowImg);

    const preview = screen.getByTestId('modal-preview');

    // Mock getBoundingClientRect so drop coordinates are calculable
    preview.getBoundingClientRect = () => ({
        left: 0, top: 0, width: 200, height: 200,
    });

    fireEvent.dragOver(preview);
    fireEvent.drop(preview, {
        clientX: 100,
        clientY: 100,
    });

    expect(screen.getByText('Remove Bow')).toBeInTheDocument();
});

test('removes the bow when Remove Bow is clicked', () => {
    render(<FlowerModal {...defaultProps} />);

    const bowImg = screen.getByAltText('Red Bow');
    fireEvent.dragStart(bowImg);

    const preview = screen.getByTestId('modal-preview');
    preview.getBoundingClientRect = () => ({
        left: 0, top: 0, width: 200, height: 200,
    });

    fireEvent.dragOver(preview);
    fireEvent.drop(preview, { clientX: 100, clientY: 100 });

    fireEvent.click(screen.getByText('Remove Bow'));
    expect(screen.queryByText('Remove Bow')).not.toBeInTheDocument();
});

test('calls onSave and onClose with correct data when saving without a bow', () => {
    render(<FlowerModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Save'));

    expect(defaultProps.onSave).toHaveBeenCalledWith({
        flower: '/flowersPngs/flower1.png',
        flowerName: 'Rose',
        bowSrc: null,
        bowPosition: null,
    });
    expect(defaultProps.onClose).toHaveBeenCalled();
});


test('shows alert and does not save when savedCount is 4', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => { });
    render(<FlowerModal {...defaultProps} savedCount={4} />);
    fireEvent.click(screen.getByText('Save'));

    expect(window.alert).toHaveBeenCalledWith('You have already saved 4 flowers!');
    expect(defaultProps.onSave).not.toHaveBeenCalled();
    expect(defaultProps.onClose).not.toHaveBeenCalled();
});




