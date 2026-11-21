import { BrowserRouter, Routes, Route } from 'react-router';

import Layout from '@/components/layout/Layout.tsx';
import { AuthProvider } from '@/modules/auth/AuthProvider.tsx';
import Auth from '@/modules/auth/pages/Auth.tsx';
import { NewBuild } from '@/modules/builds/pages/NewBuild.tsx';
import HullmodTable from '@/modules/hullmods/pages/HullmodTable.tsx';
import ShipDisplay from '@/modules/ships/pages/ShipDisplay.tsx';
import ShipTable from '@/modules/ships/pages/ShipTable.tsx';
import WeaponDisplay from '@/modules/weapons/pages/WeaponDisplay.tsx';
import { WeaponTable } from '@/modules/weapons/pages/WeaponTable.tsx';
import { Home } from '@/pages/Home.tsx';
import NotFound from '@/pages/NotFound.tsx';

import { Builds } from './modules/builds/pages/Builds';
import { ViewBuild } from './modules/builds/pages/ViewBuild';

const TODO = <div>TODO</div>;

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/auth" element={<Auth />} />

                        {/* Weapons */}
                        <Route path="/weapons" element={<WeaponTable />} />
                        <Route
                            path="/weapons/:weaponId"
                            element={<WeaponDisplay />}
                        />
                        <Route
                            path="/weapons/:weaponId/version/:versionId"
                            element={<WeaponDisplay />}
                        />

                        <Route path="/hullmods" element={<HullmodTable />} />
                        <Route path="/hullmods/:id" element={TODO} />

                        {/* Ships */}
                        <Route path="/ships" element={<ShipTable />} />
                        <Route
                            path="/ships/:shipId"
                            element={<ShipDisplay />}
                        />
                        <Route
                            path="/ships/:shipId/:versionId"
                            element={<ShipDisplay />}
                        />

                        {/* Builds */}
                        <Route path="/builds" element={<Builds />} />
                        <Route
                            path="/builds/new/:shipId/:shipVersionId"
                            element={<NewBuild />}
                        />
                        <Route
                            path="/builds/:buildId"
                            element={<ViewBuild />}
                        />

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
