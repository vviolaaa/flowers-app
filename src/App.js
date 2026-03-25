import { useState, useEffect } from 'react';
import { Header } from './components/Header'
import { NavigationMenu } from './components/NavigationMenu'
import { ExploreContainer } from './components/ExploreContainer'
import { CheckeredField } from './components/CheckeredField';
import { Quote } from './components/Quote';
import { FlowersContainer } from './components/FlowersContainer';
import { GreenCheckered } from './components/greenCheckered';
import { SavedItems } from './components/SavedItems';
import { Footer } from './components/Footer';
import { Authentication } from './components/Authentication';
import { api } from './api.js';

function App() {
    const [savedFlowers, setSavedFlowers] = useState([]);
    const [user, setUser] = useState(null);
    const [showAuth, setShowAuth] = useState(false);
    const [pendingFlower, setPendingFlower] = useState(null);

    // restore session on refresh
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.getFlowers().then(res => {
                if (res.error) {
                    localStorage.removeItem('token');
                    return;
                }
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser({ username: payload.username, email: payload.email });
                setSavedFlowers(res.flowers || []); // ← restore flowers on refresh
            });
        }
    }, []);

    const handleLogin = (loggedInUser, flowers = []) => {
        setUser(loggedInUser);
        setSavedFlowers(flowers); // ← load this user's flowers on login
        setShowAuth(false);
        if (pendingFlower) {
            api.saveFlower(pendingFlower).then(res => {
                if (!res.error) setSavedFlowers(res.flowers);
            });
            setPendingFlower(null);
        }
    };

    const handleSave = (item) => {
        if (!user) {
            setPendingFlower(item);
            setShowAuth(true);
            return;
        }
        api.saveFlower(item).then(res => { // ← save to backend
            if (!res.error) setSavedFlowers(res.flowers);
        });
    };

    const handleRemove = (index) => {
        api.deleteFlower(index).then(res => { // ← delete from backend
            if (!res.error) setSavedFlowers(res.flowers);
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setSavedFlowers([]); // ← clear flowers on logout
    };

    const goHome = () => window.scrollTo({ top: 0, behavior: "smooth" });
    const goToQuote = () => document.getElementById("quote-section").scrollIntoView({ behavior: 'smooth' });
    const goToFlowers = () => document.getElementById("flowers-section").scrollIntoView({ behavior: 'smooth' });
    const goToSaved = () => document.getElementById("saved-section").scrollIntoView({ behavior: 'smooth' });

    return (
        <div className="App">
            <Header
                username={user?.username}
                onLogout={handleLogout}
                onAuthOpen={() => setShowAuth(true)}
            />

            <NavigationMenu
                onHomeClick={goHome}
                onQuoteClick={goToQuote}
                onFlowersClick={goToFlowers}
                onSavedClick={goToSaved}
            />

            <ExploreContainer />
            <CheckeredField />

            <div id="quote-section"><Quote /></div>
            <div id="flowers-section">
                <FlowersContainer onSave={handleSave} savedCount={savedFlowers.length} />
            </div>

            <GreenCheckered />
            <div id="saved-section">
                <SavedItems items={savedFlowers} onRemove={handleRemove} />
            </div>
            <GreenCheckered />
            <Footer></Footer>

            {showAuth && (
                <Authentication
                    onLogin={handleLogin}
                    onClose={() => {
                        setShowAuth(false);
                        setPendingFlower(null);
                    }}
                />
            )}
        </div>
    );
}

export default App;