/**
 * Toast notification container.
 *
 * Renders react-toastify's ToastContainer with default settings.
 *
 * @module components/feedback/AppToastContainer
 */
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * @returns {JSX.Element}
 */
function AppToastContainer() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme="light"
    />
  );
}

export default AppToastContainer;
