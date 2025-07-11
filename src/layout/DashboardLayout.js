import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersistentDrawerLeft from '../components/DrawerResponsive';
import PersistentDrawerUser from '../components/DrawerResponsiveUser'; // Make sure this exists

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('yis_user');

    if (!storedUser) {
      navigate('/login');
    } else {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error('Failed to parse user:', err);
        navigate('/login')
      }
    }
  }, [navigate]);

  if (!user) return null; // Or return a loading spinner if you prefer

  return user.role === 2 ? <PersistentDrawerUser /> : <PersistentDrawerLeft />;
};

export default DashboardLayout;
