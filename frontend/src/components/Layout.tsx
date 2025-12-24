import { Link, Outlet } from 'react-router';
import './Layout.css';
import { useAuth } from '../hooks/useAuth';

function Layout() {
    const { user, logout } = useAuth();

    return (
        <div className="layout">
            <nav>
                <div className="nav-items">
                    <div id="start"></div>
                    <div id="middle"></div>
                    <div className="nav-end">
                        {!user && <Link to="/auth">Login</Link>}{' '}
                        {user && (
                            <>
                                <div>{user}</div>
                                <button onClick={() => logout()}>Logout</button>
                            </>
                        )}
                    </div>
                </div>
            </nav>
            <aside>
                <h2>StarSectorBuilds</h2>
                <div className="aside-items">
                    <Link to="/ships">Ships</Link>
                    <Link to="/weapons">Weapons</Link>
                    <Link to="/hullmods">Hullmods</Link>
                </div>
            </aside>
            <main>
                <Outlet />
            </main>
            <footer>Footer</footer>
        </div>
    );
}

export default Layout;
