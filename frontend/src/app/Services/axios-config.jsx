// axios-config.js
import axios from 'axios';

const instance = axios.create();

// Создайте отдельный объект для хранения данных о токенах
// const tokenManager = {
//   accessToken: localStorage.,
//   refreshToken: null,
// };

// Добавьте интерцептор для запросов
// instance.interceptors.request.use(
//   config => {
//     // Перед каждым запросом добавляем токен в заголовок Authorization
//     if (tokenManager.accessToken) {
//       config.headers.Authorization = `Bearer ${tokenManager.accessToken}`;
//     }
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   }
// );

// Добавьте интерцептор для ответов

instance.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;
  
      if (originalConfig.url !== "/userauth/login" && originalConfig.url !== "/adminauth/login" && err.response) {
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
  
          try {
            const rs = await instance.post("127.0.0.1:8000/api/token/refresh/", {
              refresh: localStorage.getItem("refreshToken"),
            });
  
            const { access } = rs.data;
            localStorage.setItem('accessToken', access);
  
            return instance(originalConfig);
          } catch (_error) {
            // В случае ошибки обновления токена также сбрасываем флаг _retry
            const role = (localStorage.getItem('role'));
            if (role === "admin") {
                _error.loginUrl = "/adminauth/login";
            } else {
                _error.loginUrl = "/userauth/login";
            }
            _error.message = "refresh failed";
            // console.log(_error);
            return Promise.reject(_error);

          }
        }
      }
  
      return Promise.reject(err);
    }
  );
  
  
  
  

export default instance;
