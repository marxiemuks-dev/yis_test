import API_URL from "../API/API_URL";
import axiosInstance from "../API/AXIOS_INSTANCE"

const login = (username, password) => {
  return axiosInstance.post(API_URL + 'login', {
    username,
    password,
  }).then((response) => {
    // Store the user object without the token, as the token is in the cookie
    localStorage.setItem('yis_user', JSON.stringify(response.data.user));
    console.log(response)
    return {data: response.data};
  }).catch((error)=>{
    console.log(error)
    if(error.code === "ERR_NETWORK"){
      return {data:{message:"ERR_NETWORK", status:false}}
    }
    return {data: error.response.data}
  });
};

const logout = (userId) => {
  axiosInstance.post(API_URL+ 'logout',{
    userId
  }).then((response) => {
    localStorage.removeItem('user');
    window.location.reload()
  }).catch((error)=>{
    localStorage.removeItem('user');
    console.error(error)
  })
};

export default {
  login,
  logout,
};
