import { useNavigate, Outlet } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';
import { useEffect } from 'react';

const ProtectedRoutes = ({ roleName }: { roleName: string[] }) => {
    const navigate = useNavigate();
    const { userData } = useUserContext();

    useEffect(() => {
        if (!userData) {
            // Redirect to login if no user info is found
            navigate('/login');
        } else if (!roleName.includes(userData.role)) {
            // Redirect to login if role does not match
            navigate('/notAuthorized');
        }
    }, [userData, roleName, navigate]);

    return <Outlet />;
};

export default ProtectedRoutes;
