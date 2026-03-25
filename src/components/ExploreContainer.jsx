import "../index.css"
import roseImage from '../assets/rose.png'
import violetImage from '../assets/violet.png'
import blueFlower from '../assets/blueFlower.png'
import tulipImage from '../assets/tulip.png'
import daisyImage from '../assets/daisy.png'


export function ExploreContainer() {
    return (
        <div className="explore-container">
            <button>Explore</button>

            <img id="rose-image" src={roseImage} alt="rose"></img>
            <img id="tulip-image" src={tulipImage} alt="tulip"></img>
            <img id="blue-flower-image" src={blueFlower} alt="blue flower"></img>
            <img id="daisy-image" src={daisyImage} alt="daisy"></img>
            <img id="violet-image" src={violetImage} alt="violet"></img>

            
        </div>
    )
}