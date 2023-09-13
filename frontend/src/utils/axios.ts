import axios from 'axios';
import { navigate } from 'src/hacks/navigate';
import { snackbarMessage } from 'src/hacks/snackbarMessage';

const axiosServices = axios.create();

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      console.warn('登录状态过期', 'error');
      location.href = '/login';
    } else {
      console.error('接口访问错误', error);
    }
    return Promise.reject(
      (error.response && error.response.data) || 'Wrong Services'
    );
  }
);

export default axiosServices;
