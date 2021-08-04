import axios from "axios";
import { push } from "connected-react-router";
import store from "app/store";
import { signOut } from "features/auth/authSlice";
import { clearProfile } from "features/user/userSlice";
import { firebaseConfig } from "firebase-utils/firebase";

const baseURL = "http://localhost:8000/api/v1/";

const apiConnection = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiConnection.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (typeof error.response === "undefined") {
      alert(
        "A server/network error occurred. " +
          "Looks like CORS might be the problem. " +
          "Sorry about this - we will get it fixed shortly."
      );
      store.dispatch(push("/"));
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      const refresh = localStorage.getItem("refresh_token");
      axios
        .post(
          `https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.apiKey}`,
          {
            grant_type: "refresh_token",
            refresh_token: refresh,
          }
        )
        .then(function (response) {
          localStorage.setItem("refresh_token", response.data.refresh_token);
          apiConnection.defaults.headers.common["Authorization"] =
            response.data.id_token;
          originalRequest.headers["Authorization"] = response.data.id_token;
          return axios(originalRequest);
        })
        .catch((error) => {
          store.dispatch(clearProfile());
          store.dispatch(signOut());
          store.dispatch(push("/"));
          return Promise.reject(error);
        });
    }

    // specific error handling done elsewhere
    return Promise.reject(error);
  }
);

export default apiConnection;
