import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import apiConnection from "api/workboundApi";
import workboundApi from "api/workboundApi";
import { auth, firebaseConfig } from "../../firebase-utils/firebase";

const refreshToken = (refresh_token) => {
  axios
    .post(
      `https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.apiKey}`,
      {
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      }
    )
    .then(function (response) {
      localStorage.setItem("refresh_token", response.data.refresh_token);
      apiConnection.defaults.headers.common["Authorization"] =
        response.data.id_token;
      return true;
    })
    .catch((error) => {
      console.log(error)
      return false;
    });
};

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    status: "idle",
    isSignedIn: false,
    error: {},
  },
  reducers: {
    clearErrors: (state) => {
      state.error = {};
    },
    signOut: (state) => {
      state.isSignedIn = false;
      delete workboundApi.defaults.headers.common["Authorization"];
      localStorage.clear();
      auth.signOut();
      state.error["signOut"] = "You have been signed out";
    },
    signInFirebase: (state, action) => {
      state.isSignedIn = action.payload.signIn;
      state.error = { signIn: action.payload.error };
    },
    loginOnLoad: (state, action) => {
      let isRefreshed = refreshToken(action.payload)
      if (isRefreshed) {
        state.isSignedIn = true
        state.error = {}
      } else {
        state.isSignedIn = false
        state.error['signIn'] = 'You have been signed out. Please sign in again.'
      }
    },
  },
});

export const { clearErrors, signOut, loginOnLoad, signInFirebase } =
  authSlice.actions;
export default authSlice.reducer;
