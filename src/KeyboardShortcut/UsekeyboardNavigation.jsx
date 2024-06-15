import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useKeyboardNavigation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case '1':
          navigate('/home');
          break;
        case '2':
          navigate('/additems');
          break;
        case '3':
          navigate('/items');
          break;
        case '4':
          navigate('/dashboard');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);
};

export default useKeyboardNavigation;
