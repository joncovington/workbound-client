import firebase from "firebase/app";
import "firebase/auth";
import workboundApi from "api/workboundApi";
import { signInFirebase } from "features/auth/authSlice";
import { fetchProfile } from "features/user/userSlice";
import apiConnection from "api/workboundApi";
import store from "app/store";

export const firebaseConfig = {
  apiKey: "AIzaSyCryMvcTRv21VJ8dFF1v8-54n72PmCluhE",
    authDomain: "workbound-api-a432e.firebaseapp.com",
    projectId: "workbound-api-a432e",
    storageBucket: "workbound-api-a432e.appspot.com",
    messagingSenderId: "19561201313",
    appId: "1:19561201313:web:3e992c8558c267ec30fae0",
    measurementId: "G-953N55YDWC"
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
          workboundApi
            .post('user/sync/', {token: res})
              .then(res => console.log('Sync response: ', res.status))
              .catch(error => console.log('Sync error: ', error))
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
