import React from 'react';

const LoginPage = () => {
    const handleLogin = () => {
        window.location.href = 'http://localhost:5000/auth/google';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-700 via-indigo-800 to-purple-700 p-4">
            <div className="bg-white shadow-2xl rounded-lg p-8 md:p-12 max-w-lg w-full text-center">
                <h1 className="text-4xl font-bold text-indigo-800 mb-6">Login</h1>
                <p className="text-gray-600 mb-8">Sign in with Google to continue</p>
                <button
                    onClick={handleLogin}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 px-6 rounded-lg text-lg font-semibold transition duration-300 transform hover:scale-105"
                >
                    Login with Google
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
