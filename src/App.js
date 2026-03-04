//import './App.css';
import { Header } from './components/Header'
import { NavigationMenu } from './components/NavigationMenu'
import { ExploreContainer } from './components/ExploreContainer'
import { CheckeredField } from './components/CheckeredField';
import { Quote } from './components/Quote';
import { FlowersContainer } from './components/FlowersContainer';
import { GreenCheckered } from './components/greenCheckered';
import { SavedItems } from './components/SavedItems';

function App() {
  const goHOme = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  };

  const goToQuote = () => {
    document.getElementById("quote-section").scrollIntoView({ behavior: 'smooth' })
  };

  const goToFlowers = () => {
    document.getElementById("flowers-section").scrollIntoView({ behavior: 'smooth' })
  };

  const goToSaved = () => {
    document.getElementById("saved-section").scrollIntoView({ behavior: 'smooth' })
  };

  return (
    <div className="App">
      <Header ></Header>

      <NavigationMenu
        onHomeClick={goHOme}
        onQuoteClick={goToQuote}
        onFlowersClick={goToFlowers}
        onSavedClick={goToSaved}>
        </NavigationMenu>

      <ExploreContainer></ExploreContainer>
      <CheckeredField></CheckeredField>

      <div id="quote-section">
        <Quote />
      </div>
      <div id="flowers-section">
        <FlowersContainer />
      </div>

      <GreenCheckered></GreenCheckered>
    <div id="saved-section">
      <SavedItems></SavedItems>
      </div>

      <GreenCheckered></GreenCheckered>

    </div>
  );
}

export default App;
