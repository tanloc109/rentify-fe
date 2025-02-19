import { ToastContainer, toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaRegCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { BsInfoCircle } from 'react-icons/bs';
import { PiWarningCircleLight } from 'react-icons/pi';
import './Toast.css';

export enum TimeDisplayed {
  SHORT = 2000,
  MEDIUM = 4000,
  LONG = 6000
}

interface ToastProps {
  type: 'success' | 'error' | 'info' | 'warning';
  info: 'Success!' | 'Error!' | 'Info!' | 'Warning!';
  message: string;
  timeDisplayed: TimeDisplayed;
  minWidth?: string;
  
}

export const showToast = ({ type, message, timeDisplayed, minWidth }: ToastProps) => {
  const options: ToastOptions = {
    autoClose: timeDisplayed,
    position: 'top-right',
    className: `custom-toast custom-toast-${type}`, 
    style: { minWidth: minWidth || '250px'}
  };

  switch (type) {
    case 'success':
      toast.success(<div>Success!<br /><span className="toast-message">{message}</span></div>, { ...options, icon: <FaRegCheckCircle /> });
      break;
    case 'error':
      toast.error(<div>Error!<br /><span className="toast-message">{message}</span></div>, { ...options, icon: <FaTimesCircle /> });
      break;
    case 'info':
      toast.info(<div>Info!<br /><span className="toast-message">{message}</span></div>, { ...options, icon: <BsInfoCircle /> });
      break;
    case 'warning':
      toast.warning(<div>Warning!<br /><span className="toast-message">{message}</span></div>, { ...options, icon: <PiWarningCircleLight /> });
      break;
  }
};

const Toast = () => <ToastContainer />;

export default Toast;