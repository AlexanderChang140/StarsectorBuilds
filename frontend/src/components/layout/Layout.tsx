import { Link, Outlet } from 'react-router';

import useAuth from '@/hooks/useAuth';

import layoutStyles from './Layout.module.css';
import navbarStyles from './Navbar.module.css';

export default function Layout() {
    const { user, logout } = useAuth();

    return (
        <div className={layoutStyles.layout}>
            <nav>
                <div className={navbarStyles.container}>
                    <div className={navbarStyles.items}>
                        <div className={navbarStyles.start}>
                            <h2>StarSectorBuilds</h2>
                            <Link to="/ships">Ships</Link>
                            <Link to="/weapons">Weapons</Link>
                            <Link to="/hullmods">Hullmods</Link>
                        </div>
                        <div id="middle"></div>
                        <div className={navbarStyles.end}>
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
            <main>
                <Outlet />
            </main>
            <footer>Footer</footer>
        </div>
    );
}
