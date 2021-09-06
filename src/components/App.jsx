import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import {
  Grid,
  Header as UiHeader,
} from "semantic-ui-react";
import { loginOnLoad } from "features/auth/authSlice";
import Header from "components/Header";
import SignInForm from "features/auth/SignInForm";
import SignUpForm from "features/auth/SignUpForm";
import Profile from "features/user/Profile";
import Tasks from "features/task/Tasks";
import Categories from "features/category/Categories";
import Builder from "features/builder/Builder";
import Messages from 'features/messages/Messages'
import { onAuthStateChanged } from "../firebase-utils/firebase";
import { fetchPermissions } from "features/user/userSlice";
import { addMessage } from "features/messages/messagesSlice";

// export const history = createMemoryHistory();

function App() {
  const dispatch = useDispatch();
  const { isSignedIn, error } = useSelector((state) => state.auth);
  const messages = useSelector((state) => state.messages);
  const isPermFetched = useSelector((state) => state.user.isPermFetched);
  const userId = useSelector((state) => state.user.id);
  const token = localStorage.getItem("refresh_token");
  const currentPath = useSelector((state) => state.router.location.pathname);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged();
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (token && !isSignedIn) {
      dispatch(loginOnLoad(token));
    }
  }, [dispatch, token, isSignedIn]);

  useEffect(() => {
    if (!isSignedIn && error?.signOut) {
      dispatch(addMessage(error.signOut, 'negative', ''));
    }
  }, [dispatch, isSignedIn, error]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchPermissions());
    }
  }, [dispatch, userId]);

  return (
    <>
      <Header />
      {!isSignedIn && messages.length === 0 
        ? (
        <Grid>
          <Grid.Row style={{ padding: ".5em 1.2em" }}>
            <Grid.Column textAlign="right">
              <UiHeader as="h5">
                Don't have an account? Sign up{" "}
                <span
                  onClick={() => dispatch(push("/signUp"))}
                  style={{ color: "#1b7ec8", cursor: "pointer" }}
                >
                  HERE
                </span>
                .
              </UiHeader>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        ) : null
      }
      
      <SignInForm open={currentPath === "/signIn" && !isSignedIn} />
      <SignUpForm open={currentPath === "/signUp" && !isSignedIn} />

      {isPermFetched ? (
        <>
          <Profile open={ currentPath === "/profile" && isPermFetched } />
          <Builder open={ currentPath === "/build" && isPermFetched } />
        </>
      ) : null}

      <Switch>
        <Route path="/tasks" exact component={Tasks} />
        <Route path="/categories" exact component={Categories} />
      </Switch>
      <Messages />
    </>
  );
}

export default App;
