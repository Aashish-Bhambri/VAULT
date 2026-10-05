import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import useGames from '../hooks/useGames';
import backendApi from '../services/backendApi';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router';
import { setCredentials } from '../app/features/authSlice';

const LoginPage = () => {
    const { games } = useGames();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 1. Form state
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 2. Stable random background image (prevent flickering on typing)
    const [bgImage, setBgImage] = useState('');
    useEffect(() => {
        if (games.length > 0 && !bgImage) {
            const randomIndex = Math.floor(Math.random() * games.length);
            setBgImage(games[randomIndex]?.background_image || '');
        }
    }, [games, bgImage]);

    // 3. Input change handler
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // 4. Form submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await backendApi.post('/user/login', {
                email: formData.email,
                password: formData.password,
            });

            // Store credentials in Redux & localStorage
            dispatch(setCredentials(response.data));

            // Navigate to home page
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className='w-full h-screen overflow-hidden flex flex-col bg-[#151515] bg-cover bg-center'
            style={{
                backgroundImage: bgImage
                    ? `linear-gradient(to bottom, rgba(21, 21, 21, 0.4) 0%, rgba(21, 21, 21, 0.7) 60%, #151515 100%),
                       linear-gradient(to right, rgba(21, 21, 21, 0.85) 0%, rgba(21, 21, 21, 0.2) 50%, rgba(21, 21, 21, 0.7) 100%),
                       url(${bgImage})`
                    : undefined,
            }}
        >
            <Navbar />
            <div className="flex h-full items-center justify-center font-sans text-white p-4 -mt-14">
                <div className="w-full max-w-sm space-y-8">
                    <h1 className="text-4xl font-semibold tracking-tight">Log in</h1>

                    {/* Error message */}
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-300 text-sm px-4 py-2.5 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                required
                                className="w-full bg-[#0d0d0d] px-4 py-3.5 text-base text-gray-200 placeholder-gray-500 border border-transparent outline-none focus:border-gray-700 transition rounded-sm"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                                className="w-full bg-[#0d0d0d] px-4 py-3.5 text-base text-gray-200 placeholder-gray-500 border border-transparent outline-none focus:border-gray-700 transition rounded-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-sm bg-white py-3 text-center text-base font-normal text-black hover:bg-gray-100 transition shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer disabled:opacity-50"
                        >
                            {loading ? 'Logging in...' : 'Log in'}
                        </button>
                    </form>

                    <div className="flex flex-col items-center space-y-3 text-sm text-gray-300">
                        <Link to="/signup" className="underline decoration-gray-400 hover:text-white transition">
                            Don't have an account? Sign up.
                        </Link>
                        <a href="#" className="underline decoration-gray-400 hover:text-white transition">
                            Forgot your password?
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;