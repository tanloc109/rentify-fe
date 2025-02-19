import { useNavigate } from 'react-router-dom';
import { notFoundLogo } from '../assets/index.tsx';
import CustomButton from '../components/common/CustomButton.tsx';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const notFoundAreaStyle = {
    position: 'absolute' as 'absolute',
    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    height: 'auto',
    textAlign: 'center' as 'center',
  };

  const backToHomeButtonStyle = {
    display: 'grid',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const notFoundLogoStyle = {
    maxWidth: '100%',
    height: 'auto',
    width: window.innerWidth >= 1920 ? '600px' : window.innerWidth <= 1366 ? '300px' : 'auto',
  };

  return (
    <div style={notFoundAreaStyle}>
      <img style={notFoundLogoStyle} src={notFoundLogo} alt="Not Found" />
      <h1>Requested page cannot be found</h1>
      <div style={backToHomeButtonStyle}>
        <CustomButton styling="primary" label="Back to home page" size="l" onClick={() => navigate('/')} />
      </div>
    </div>
  );
};

export default NotFoundPage;