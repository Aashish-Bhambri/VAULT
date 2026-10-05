import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import useGames from '../hooks/useGames';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router';
import { setCredentials } from '../app/features/authSlice';

const SignupPage = () => {
    const { games } = useGames();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 1. Form state
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 2. Stable random background image (doesn't flicker on typing)
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
            const response = await axios.post('http://localhost:8080/user/signup', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });

            // Save token and user to Redux & localStorage
            dispatch(setCredentials(response.data));

            // Redirect to home page
            navigate('/');
        } catch (err) {
            // Display error from backend (e.g., "User already exists")
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="w-full h-screen overflow-hidden flex flex-col bg-[#151515] bg-cover bg-center"
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
                <div className="w-full max-w-sm space-y-6">
                    <h1 className="text-4xl font-semibold tracking-tight">Sign up</h1>

                    {/* Error Alert */}
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-300 text-sm px-4 py-2.5 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Username"
                                required
                                className="w-full rounded bg-[#0d0d0d] px-4 py-3 text-sm text-gray-200 placeholder-gray-500 outline-none focus:ring-1 focus:ring-gray-600 transition"
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                required
                                className="w-full rounded bg-[#0d0d0d] px-4 py-3 text-sm text-gray-200 placeholder-gray-500 outline-none focus:ring-1 focus:ring-gray-600 transition"
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                required
                                className="w-full rounded bg-[#0d0d0d] px-4 py-3 text-sm text-gray-200 placeholder-gray-500 outline-none focus:ring-1 focus:ring-gray-600 transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded bg-white py-3 text-center text-sm font-medium text-black hover:bg-gray-100 transition cursor-pointer disabled:opacity-50"
                        >
                            {loading ? 'Signing up...' : 'Sign up'}
                        </button>
                    </form>

                    <div className="text-center text-xs text-gray-400">
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="underline hover:text-white transition cursor-pointer"
                        >
                            Log in.
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
