/** Lets axios 401 handler use in-app navigation when Router is mounted. */
let redirectToLoginImpl = () => {
  window.location.assign(`${window.location.origin}/login`);
};

export const setRedirectToLogin = (fn) => {
  redirectToLoginImpl = fn;
};

export const redirectToLogin = () => redirectToLoginImpl();
