import { useEffect, useState, type FormEvent } from 'react';
import './Auth.css';
import { useNavigate } from 'react-router';
import { useAuth } from '../AuthProvider';

type Auth = 'login' | 'signup';

export default function Authentication() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [auth, setAuth] = useState<Auth>('login');
    const [error, setError] = useState('');

    const { login, signup, isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate('/');
            return;
        }
    }, [isAuthenticated, isLoading, navigate]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            if (username === '' || password === '') {
                throw new Error('Username and password required');
            }

            if (auth === 'login') {
                await login(username, password);
            } else {
                await signup(username, password);
            }
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const buttonName = auth === 'login' ? 'Login' : 'Signup';

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="auth">
            <div>
                <button
                    onClick={() => {
                        setAuth('login');
                        setError('');
                    }}
                    disabled={isLoading}
                >
                    Login
                </button>
                <button
                    onClick={() => {
                        setAuth('signup');
                        setError('');
                    }}
                    disabled={isLoading}
                >
                    Signup
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        name="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error !== '' && (
                    <div style={{ color: 'red', fontSize: 12 }}>{error}</div>
                )}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Loading...' : buttonName}
                </button>
            </form>
        </div>
    );
}
