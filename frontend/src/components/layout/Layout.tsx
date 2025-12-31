import { Link, Outlet } from 'react-router';

import useAuth from '@/hooks/useAuth';

import '@/styles/theme.css';
import '@/components/layout/Layout.css';
import '@/components/layout/Navbar.css';
import '@/components/layout/Sidebar.css';

function Layout() {
    const { user, logout } = useAuth();

    return (
        <div className="layout">
            <nav>
                <div className="nav-container">
                    <div className="nav-items">
                        <div className="nav-start">
                            <h2>StarSectorBuilds</h2>
                        </div>
                        <div id="middle"></div>
                        <div className="nav-end">
                            {!user && <Link to="/auth">Login</Link>}{' '}
                            {user && (
                                <>
                                    <span>{user}</span>
                                    <button onClick={() => logout()}>
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <aside>
                <ul className="aside-items">
                    <Link to="/ships">Ships</Link>
                    <Link to="/weapons">Weapons</Link>
                    <Link to="/hullmods">Hullmods</Link>
                </ul>
            </aside>
            <main>
                <Outlet />
            </main>
            <footer>Footer</footer>
        </div>
    );
}

export default Layout;
