import request from './request';
// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  return atob(localStorage.getItem('_a'));
}

export function setAuthority(authority, expiresIn) {
  if(!authority) {
    localStorage.removeItem('_a');
  } else {
    localStorage.setItem('_a', btoa(authority));
  }
  if(!expiresIn) {
    localStorage.removeItem('_e');
  } else {
    localStorage.setItem('_e', `${new Date().getTime() + ((expiresIn / 2) * 1000)}`);
  }
}

let refreshInterval;

export function refreshAuthority(appId, authority) {
  localStorage.setItem('_t', btoa(appId));
  localStorage.setItem('_t2', btoa(authority));
  refreshInterval = setInterval(()=>{
    const a = atob(localStorage.getItem('_t'));
    if(!checkAuthority() && a) {
      const id = atob(localStorage.getItem('_t'));
      request(`/refresh/token`, {
        headers: {
          appId: id,
          refreshToken: a,
        },
      }).then((response)=> {
        setAuthority(response.data.accessToken, response.data.expiresIn);
      });
    }
  }, 3 * 1000);
}

export function clearRefreshAuthority() {
  clearInterval(refreshInterval);
}

export function checkAuthority() {
  return !!getAuthority() && new Date().getTime() < localStorage.getItem('_e') - 10 * 1000;
}
