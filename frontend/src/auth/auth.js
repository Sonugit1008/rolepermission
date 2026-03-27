export const setAuth = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("role_id", data.role_id);
  localStorage.setItem("role_name", data.role_name || "");
  localStorage.setItem("user_type", data.user_type || "");
};

export const getRoleName = () => localStorage.getItem("role_name");

export const getRole = () => localStorage.getItem("role_id");
export const getUserType = () => localStorage.getItem("user_type");

export const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
};