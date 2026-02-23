import { useDispatch, useSelector } from "react-redux";
import { apiClient } from "../../../services/apiClient";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setErrorRegister,
  updateUser,
} from "../redux/authSlice";
import type { AppDispatch, RootState } from "../../../store/store";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  //Login
  const login = async (username: string, password: string) => {
    try {
      dispatch(loginStart());

      const response = await apiClient.post("/auth/login", {
        username,
        password,
      });

      const { access_token, name: nameData, username: usernameData, id, role, email } = response.data;

      //convertimos para el slice
      const user = { id: id, username: usernameData, name: nameData, role: role, email: email };

      //Tiempo para el loading
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Guardar en Redux + localStorage
      dispatch(loginSuccess({ user, token: access_token }));
      localStorage.setItem("token", access_token);
    } catch (err: any) {
      console.error("Error en login:", err);
      dispatch(loginFailure("Credenciales inválidas o error del servidor"));
    }
  };

  const logoutUser = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  //Register
  const register = async (
    username: string,
    email: string,
    password: string,
    name: string
  ) => {
    try {
      const res = await apiClient.post("/auth/register", {
        username,
        name,
        email,
        password,
      });

      login(res.data.username, password);
    } catch (err: any) {
      console.error(err);

      dispatch(setErrorRegister(err.message || "Error al registrarse"));
    }
  };

  const updateUserState = async (updatedUserData: any) => {
    try {
      dispatch(loginStart())

      const response = await apiClient.patch("/auth/me", {
        ...updatedUserData
      });


      // Guardar en Redux + localStorage;
      dispatch(updateUser(updatedUserData));

    } catch (err: any) {
      console.error(err)

      dispatch(setErrorRegister(err.message || "Error a actualizar usuario"))
    }
  };

  return {
    user,
    token,
    loading,
    error,
    login,
    logoutUser,
    isAuthenticated: Boolean(token),
    register,
    updateUserState,
  };
};
