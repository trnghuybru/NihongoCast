import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { login, register as registerUser } from "../services/authService";
import useAuthStore from "../store/authStore";

const AuthPage = () => {
  const { register, handleSubmit } = useForm();
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setError("");
    try {
      const result = isRegistering
        ? await registerUser(data.username, data.email, data.password) // Thêm username vào tham số gọi API
        : await login(data.email, data.password);

      setUser({ username: result.username }); // Lưu `username` thay vì `email`

      // Chuyển hướng sau đăng nhập
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(isRegistering ? "Đăng ký thất bại!" : "Đăng nhập thất bại!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isRegistering ? "Đăng ký" : "Đăng nhập"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {isRegistering && (
            <div className="mb-4">
              <label className="block text-gray-700">Tên đăng nhập</label>
              <input
                type="text"
                {...register("username", { required: true })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Mật khẩu</label>
            <input
              type="password"
              {...register("password", { required: true })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            {isRegistering ? "Đăng ký" : "Đăng nhập"}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        <p className="text-center mt-4">
          {isRegistering ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
          <button
            className="text-blue-500 hover:underline"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Đăng nhập" : "Đăng ký"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
