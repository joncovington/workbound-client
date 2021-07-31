import firebase from "firebase/app";
import "firebase/auth";

import { signInFirebase } from "features/auth/authSlice";
import { fetchProfile } from "features/user/userSlice";
import apiConnection from "api/workboundApi";
import store from "app/store";

export const firebaseConfig = {
  apiKey: "AIzaSyAEpG1FBewc_-D2c4CTPXJ-4saz3F5Vd8Q",
  authDomain: "workbound-api.firebaseapp.com",
  projectId: "workbound-api",
  storageBucket: "workbound-api.appspot.com",
  messagingSenderId: "962624929816",
  appId: "1:962624929816:web:68f0d0c1f9bd8796d5436d",
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();

export const onAuthStateChanged = () => {
  return auth.onAuthStateChanged((authUser) => {
    if (authUser) {
      auth.currentUser
        .getIdToken()
        .then((res) => {
          apiConnection.defaults.headers.common["Authorization"] = res;
          localStorage.setItem("refresh_token", auth.currentUser.refreshToken);
          store.dispatch(signInFirebase({ signIn: true, error: null }));
          store.dispatch(fetchProfile());
        })
        .catch((error) => {
          console.log("Fetch Token Error", error);
          localStorage.removeItem("refresh_token");
          apiConnection.defaults.headers.common["Authorization"] = null;
        });
      // store.dispatch(signInFirebase())
    } else {
      console.log("No current user");
      localStorage.removeItem("refresh_token");
      apiConnection.defaults.headers.common["Authorization"] = null;
    }
  });
};

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export const signInWithGoogle = () => {
  auth
    .signInWithPopup(provider)
    .then((res) => {
      console.log(res.user.email + " signed in through Google.");
    })
    .catch((err) => console.log(err));
};
export const signInWithEmailAndPassword = ({ email, password }) => {
  auth
    .signInWithEmailAndPassword(email, password)
    .then((res) => {
      console.log(res.user.email + " signed in.");
    })
    .catch((err) => {
      console.log(err);
    });
};
export default firebase;
