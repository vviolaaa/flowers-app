import "../index.css"
import { MdArrowForwardIos } from "react-icons/md";
import { MdArrowBackIos } from "react-icons/md";
import colorfulRose from '../assets/colorfulRose.png'
import { useState } from "react";
import { flowers } from '../data/flowersData';

import { FlowerModal } from './FlowerModal';

export function FlowersContainer() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const goBack = () => {
        setCurrentIndex(prev => (prev - 1 + flowers.length) % flowers.length);
    };

    const goForward = () => {
        setCurrentIndex(prev => (prev + 1) % flowers.length);
    };

    const currentFlower = flowers[currentIndex];

    return (
        <div className="flowers-container">
            <div className="flowers-title"><p>FLOWERS</p></div>
            <button id="back-button" onClick={goBack}><MdArrowBackIos /></button>
            <button id="forward-button" onClick={goForward}><MdArrowForwardIos /></button>
            <div className="flower-choosing-box" onClick={() => setIsModalOpen(true)}>
                <img src={currentFlower.image} alt={currentFlower.name} />
            </div>

            {isModalOpen && (
                <FlowerModal
                    flower={currentFlower}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}