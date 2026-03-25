import { useEffect, useRef } from "react";
import "../index.css"

export function SavedItems({ items = [], onRemove }) {
    const slots = [0, 1, 2, 3];
    const cardRefs = useRef([]);

    useEffect(() => {
        cardRefs.current.forEach(card => {
            if (card) card.classList.remove('visible');
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        }, { 
            threshold: 0.2,
            rootMargin: "0px 0px -50px 0px"
        });

        const timer = setTimeout(() => {
            cardRefs.current.forEach(card => {
                if (card) observer.observe(card);
            });
        }, 300);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, [items]);

    return (
        <div className="saved-items-container">
            {slots.map(i => (
                <div
                    className="saved-items-card scroll-animate"
                    key={i}
                    ref={el => cardRefs.current[i] = el}
                >
                    {items[i] ? (
                        <div className="saved-items-card-inner">
                            <img
                                src={items[i].flower}
                                alt={items[i].flowerName}
                                className="saved-items-card-flower"
                            />
                            {items[i].bowSrc && (
                                <img
                                    src={items[i].bowSrc}
                                    alt="bow"
                                    className="saved-items-card-bow"
                                    style={{
                                        left: `${items[i].bowPosition?.x ?? 0}%`,
                                        top: `${items[i].bowPosition?.y ?? 0}%`,
                                        transform: "translate(-50%, -50%)"
                                    }}
                                />
                            )}
                            <button className="saved-items-card-remove" onClick={() => onRemove(i)}>×</button>
                        </div>
                    ) : (
                        <div className="saved-items-card-empty">empty</div>
                    )}
                </div>
            ))}
        </div>
    );
}