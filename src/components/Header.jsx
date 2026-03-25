import "../index.css"

export function Header({ username, onLogout, onAuthOpen }) {
    return (
        <div className="header-container">
            <h1>Imagine that smth cool is written here - THE OTHER VER.</h1>

            <div className="header-auth">
                {username ? (
                    <>
                        <span className="header-username">{username}</span>
                        <button className="header-btn logout" onClick={onLogout}>Log out</button>
                    </>
                ) : (
                    <button className="header-btn login" onClick={onAuthOpen}>Login / Sign up</button>
                )}
            </div>
        </div>
    );
}