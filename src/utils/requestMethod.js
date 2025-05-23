
import axios from "axios";

// لو عندك token في اللوكل ستورج
const token = localStorage.getItem("token");
// // const BASE_URL = "http://192.168.1.8:5000";
const BASE_URL = "https://pos-system-back-end.vercel.app"; // غيره حسب مشروعك

// إنشاء instance
export const PuplicRequest = axios.create({
  baseURL: BASE_URL,
  headers: {
    token: `${token}`,
  },
});

// Interceptor للاستجابة (response)
PuplicRequest.interceptors.response.use(
  (response) => {
    // لو كل حاجة تمام
    return response;
  },
  (error) => {
    const message = error.response?.data?.message;

    if (message === "TokenExpiredError: jwt expired") {
      // امسح البيانات من localStorage
      localStorage.clear();

      // إعادة التوجيه لصفحة تسجيل الدخول
      window.location.href = "/login"; // أو "/signin" حسب مسارك
    }

    // رجّع الخطأ عشان اللي بينادي يقدر يتعامل معاه كمان
    return Promise.reject(error);
  }
);
