import axios from "axios";

// Đăng nhập với email
export async function login(email, password) {
  const response = await axios.post("http://localhost:8000/auth/login", {
    email,
    password,
  });
  const data = response.data;
  localStorage.setItem("accessToken", data.access_token);
  return data;
}

// Đăng ký với email
export async function register(username, email, password) {
  const response = await axios.post("http://localhost:8000/auth/register", {
    username,
    email,
    password,
  });

  console.log("Đăng ký trả về:", response.data);

  if (response.data.access_token) {
    localStorage.setItem("accessToken", response.data.access_token);
  }

  return response.data;
}

// Đăng xuất
export function logout() {
  localStorage.removeItem("accessToken");
}
