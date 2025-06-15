import { Navigate } from "react-router-dom";
import { useSlug } from '~/contexts/SlugContext';
import { useAuth } from '~/contexts/AuthContext';

const GuestRoute = ({ children }) => {
    const { isAuthenticated, userData, loading } = useAuth();
    const { slug } = useSlug();

    if (loading) return null;

    if (isAuthenticated && userData?.role === 'staff') {
        return <Navigate to={`/${slug}/service`} replace />;
    }
    if (isAuthenticated && userData?.role === 'admin') {
        return <Navigate to={`/${slug}/admin`} replace />;
    }

    return children; // chưa login => vào được login page
};

export default GuestRoute;
