import { Navigate } from "react-router-dom";
import { useSlug } from '~/contexts/SlugContext';
import { useAuth } from '~/contexts/AuthContext';

const ProtectedRoute = ({ children, roleRequired }) => {
    const { isAuthenticated, userData, loading } = useAuth();
    const { slug } = useSlug();

    if (loading) return null;

    if (!isAuthenticated) {
        return <Navigate to={`/${slug}/login`} replace />;
    }

    if (roleRequired && userData?.role !== roleRequired) {
        const redirectTo = userData.role === 'admin' ? `/${slug}/admin` : `/${slug}/service`;
        return <Navigate to={redirectTo} replace />;
    }

    return children;
};

export default ProtectedRoute;
