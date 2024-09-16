import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './HomePage';
import Login from './Login'; // Import other components if needed

const ProtectedRoute = ({ element, ...rest }) => {
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        fetch('/user')
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setUser(data);
                }
            });
    }, []);

    return user ? element : <Navigate to="/" />;
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
                {/* Add other routes as needed */}
            </Routes>
        </Router>
    );
};

export default App;
