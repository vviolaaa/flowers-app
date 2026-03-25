import { useState, useRef } from "react";
import "../index.css";
import { bows } from "../data/flowersData";

export function FlowerModal({ flower, onClose, onSave, savedCount }) {
    const [bowPosition, setBowPosition] = useState(null);
    const [draggingBow, setDraggingBow] = useState(null);
    const previewRef = useRef(null);

    const handleDragStart = (bow) => {
        setDraggingBow(bow);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (!draggingBow || !previewRef.current) return;
        const rect = previewRef.current.getBoundingClientRect();

        const xPct = (e.clientX - rect.left) / rect.width * 100;
        const yPct = (e.clientY - rect.top) / rect.height * 100;

        setBowPosition({ x: xPct, y: yPct, image: draggingBow.image, label: draggingBow.label });
        setDraggingBow(null);
    };

    const handleDragOver = (e) => e.preventDefault();

    const handleSave = () => {
        if (savedCount >= 4) {
            alert("You have already saved 4 flowers!");
            return;
        }
        onSave({
            flower: flower.image,
            flowerName: flower.name,
            bowSrc: bowPosition?.image ?? null,
            bowPosition: bowPosition ? { x: bowPosition.x, y: bowPosition.y } : null,
        });
        onClose();
    };


    return (
        <div className="modal-overlay" data-testid="modal-overlay" onClick={onClose}>
            <div className="modal-content" data-testid="modal-content" onClick={e => e.stopPropagation()}>
                <h4>Decorate your flower!</h4>

                <div
                    className="modal-preview"
                    data-testid="modal-preview"
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
                            style={{
                                left: `${bowPosition.x}%`,
                                top: `${bowPosition.y}%`,
                                transform: "translate(-50%, -50%)"  // ← centers bow on drop point
                            }}
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