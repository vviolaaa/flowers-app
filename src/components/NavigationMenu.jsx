import "../index.css"
import { BsFlower1 } from "react-icons/bs";

export function NavigationMenu(
    { 
    onHomeClick, 
    onQuoteClick, 
    onFlowersClick, 
    onSavedClick 
}) {
    return (
        <div className="navigation-menu">
            <div className="nav-left">
                <button className="navigation-button" onClick={onHomeClick}>Home</button>
                <button className="navigation-button" onClick={onQuoteClick}>Quote</button>
            </div>

            <div className="nav-logo">
                <h2>WILD<BsFlower1></BsFlower1>FLOWER</h2>

            </div>

            <div className="nav-right">
                <button className="navigation-button" onClick={onFlowersClick}>Flowers</button>
                <button className="navigation-button" onClick={onSavedClick}>Saved</button>
            </div>
            
        </div>
    )
}