import { useEffect, useRef } from "react";
import "../index.css";

export function Quote() {
    const quoteRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        }, { threshold: 0.2 });

        const timer = setTimeout(() => {
            if (quoteRef.current) observer.observe(quoteRef.current);
        }, 300); // ← longer delay so element starts hidden before observer fires

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, []);

    return (
        <div className="quote-container">
            <div id="quote-field" className="scroll-animate" ref={quoteRef}>
                <h3>ROCKIN', ROLLIN', SWAGGIN', SWAGGER, WRONG</h3>
                <p>(c) BTS</p>
            </div>
        </div>
    );
}