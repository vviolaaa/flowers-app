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

            <img id="rose-image" src={roseImage}></img>
            <img id="tulip-image" src={tulipImage}></img>
            <img id="blue-flower-image" src={blueFlower}></img>
            <img id="daisy-image" src={daisyImage}></img>
            <img id="violet-image" src={violetImage}></img>

            
        </div>
    )
}