import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// สร้าง instance ของ axios สำหรับเรียกใช้ API
const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// เพิ่ม interceptor เพื่อแนบ token กับทุก request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// เพิ่ม interceptor สำหรับจัดการ response
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // ถ้าเกิด 401 error และยังไม่ได้ลอง refresh token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // ลองใช้ refresh token เพื่อขอ token ใหม่
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const res = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
            refresh_token: refreshToken
          });
          
          if (res.data.access_token) {
            localStorage.setItem('token', res.data.access_token);
            api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/Auth';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;