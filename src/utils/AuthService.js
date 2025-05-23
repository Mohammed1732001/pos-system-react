import { jwtDecode } from "jwt-decode";


const getRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const user = jwtDecode(token);
    
    return user.role || null;
  } catch {
    return null;
  }
};

const isAdmin = () => getRole() === "admin";

export default { getRole, isAdmin };
