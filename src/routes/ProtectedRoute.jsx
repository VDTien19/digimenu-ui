import { Navigate } from "react-router-dom";
import { useSlug } from '~/contexts/SlugContext';
import { useAuth } from '~/contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const { slug } = useSlug();

    if (loading) return null;

    const loginUrl = `/${slug}/login`;
    return isAuthenticated ? children : <Navigate to={loginUrl} replace />;
};

export default ProtectedRoute;
