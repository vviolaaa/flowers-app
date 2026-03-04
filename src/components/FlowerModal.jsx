import { useState, useRef } from "react";
import "../index.css";

const bows = [
    { id: 1, image: "/bowsPngs/bow1.png", label: "Bow 1" },
    { id: 2, image: "/bowsPngs/bow2.png", label: "Bow 2" },
    { id: 3, image: "/bowsPngs/bow3.png", label: "Bow 3" }
];

export function FlowerModal({ flower, onClose }) {
    const [bowPosition, setBowPosition] = useState(null);
    const [draggingBow, setDraggingBow] = useState(null);
    const previewRef = useRef(null);

    const handleDragStart = (bow) => {
        setDraggingBow(bow);
    };

    const handleDrop = (e) => {
        e.preventDefault();

        if (!draggingBow || !previewRef.current) {
            return;
        }

        const rect = previewRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - 40;
        const y = e.clientY - rect.top - 40;

        setBowPosition({ x, y, image: draggingBow.image, label: draggingBow.label });
        setDraggingBow(null);
    };

    const handleDragOver = (e) => e.preventDefault();
    const handleSave = () => {
        alert(`Saved ${flower.name} with ${bowPosition?.label} || "no bow"!`);
        onClose();
    };

   return (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h4>Decorate your flower!</h4>

            <div
                className="modal-preview"
                ref={previewRef}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <img src={flower.image} alt={flower.name} className="modal-flower-img" />
                {bowPosition && (
                    <img
                        src={bowPosition.image}
                        alt="bow"
                        className="placed-bow"
                        style={{ left: bowPosition.x, top: bowPosition.y }}
                    />
                )}
            </div>

            <div className="bow-options">
                {bows.map(bow => (
                    <img
                        key={bow.id}
                        src={bow.image}
                        alt={bow.label}
                        className="bow-choice"
                        draggable
                        onDragStart={() => handleDragStart(bow)}
                    />
                ))}
            </div>

            <div className="modal-actions">
                {bowPosition && (
                    <button className="remove-btn" onClick={() => setBowPosition(null)}>Remove Bow</button>
                )}
                <button className="save-btn" onClick={handleSave}>Save</button>
                <button className="close-btn" onClick={onClose}>Cancel</button>
            </div>
        </div>
    </div>
);
}