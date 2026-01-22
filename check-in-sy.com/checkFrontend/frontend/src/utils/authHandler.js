// authHandler.js
export const logout = () => {
  localStorage.clear();
  sessionStorage.clear();


  window.history.pushState(null, "", window.location.href);
  window.addEventListener("popstate", () => {
    window.history.pushState(null, "", window.location.href);
  });

  window.location.href = "/login";
};


export const getRedirectByRole = (role) => {
  switch (role) {
    case "admin": return "/admin-dashboard";
    case "hotel": return "/hotel-dashboard";
    case "delivery": return "/dashboard/drivers";
    default: return "/login";
  }
};
