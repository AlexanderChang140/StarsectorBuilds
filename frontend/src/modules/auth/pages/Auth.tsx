import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';

import useAuth from '@/modules/auth/hooks/useAuth';
import './Auth.css';

type Auth = 'login' | 'signup';

export default function Authentication() {
    const [identifier, setIdentifier] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [auth, setAuth] = useState<Auth>('login');
    const [error, setError] = useState('');

    const { login, signup, isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, isLoading, navigate]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');

        try {
            if (auth === 'login' && identifier && password) {
                await login(identifier, password);
            } else if (auth === 'signup' && username && email) {
                await signup(username, password, email);
            } else {
                throw new Error('All fields are required');
            }
        } catch (err) {
            setError((err as Error).message);
        }
    };

    if (isLoading) {
        return <div className="auth-loading">Loading session...</div>;
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${auth === 'login' ? 'active' : ''}`}
                        onClick={() => {
                            setAuth('login');
                            setError('');
                        }}
                        type="button"
                    >
                        Login
                    </button>
                    <button
                        className={`auth-tab ${auth === 'signup' ? 'active' : ''}`}
                        onClick={() => {
                            setAuth('signup');
                            setError('');
                        }}
                        type="button"
                    >
                        Signup
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {auth === 'login' && (
                        <div className="input-group">
                            <input
                                name="identifier"
                                placeholder="Username or email"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                autoComplete="username"
                            />
                        </div>
                    )}

                    {auth === 'signup' && (
                        <div className="input-group">
                            <input
                                name="username"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                            />
                        </div>
                    )}

                    {auth === 'signup' && (
                        <div className="input-group">
                            <input
                                name="email"
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete={
                                auth === 'login'
                                    ? 'current-password'
                                    : 'new-password'
                            }
                        />
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <button type="submit" className="auth-submit-btn">
                        {auth === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
}
