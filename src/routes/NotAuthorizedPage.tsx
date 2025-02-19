import { useNavigate } from "react-router-dom";
import CustomButton from "../components/common/CustomButton.tsx";
import { notAuthorizedLogo } from "../assets/index.tsx";

const NotAuthorized = () => {
  const navigate = useNavigate();

  const notAuthorizedAreaStyle = {
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

  const notAuthorizedLogoStyle = {
    maxWidth: '100%',
    height: 'auto',
    width: window.innerWidth >= 1920 ? '600px' : window.innerWidth <= 1366 ? '300px' : 'auto',
  };

  return (
    <div style={notAuthorizedAreaStyle}>
      <img style={notAuthorizedLogoStyle} src={notAuthorizedLogo} alt="Not Authorized" />
      <h1>Forbidden access</h1>
      <div style={backToHomeButtonStyle}>
        <CustomButton styling="primary" label="Back to home page" size="l" onClick={() => navigate('/')} />
      </div>
    </div>
  );
};

export default NotAuthorized;