import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './pages/Home.tsx';
import Layout from './components/Layout.tsx';
import NotFound from './pages/NotFound.tsx';
import HullmodTable from './modules/hullmods/pages/HullmodTable.tsx';
import WeaponDisplay from './modules/weapons/pages/WeaponDisplay.tsx';
import WeaponTable from './modules/weapons/pages/WeaponTable.tsx';
import Auth from './modules/auth/pages/Auth.tsx';
import { AuthProvider } from './modules/auth/AuthProvider.tsx';

const TODO = <div>TODO</div>;

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/weapons" element={<WeaponTable />} />
                        <Route
                            path="/weapons/:id"
                            element={<WeaponDisplay />}
                        />
                        <Route path="/hullmods" element={<HullmodTable />} />
                        <Route path="/hullmods/:id" element={TODO} />
                        <Route path="/user/:id" element={TODO} />
                        <Route path="/settings" element={TODO} />
                        <Route path="/about" element={TODO} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
