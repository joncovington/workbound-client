import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import { useDispatch, useSelector } from "react-redux";
import {
  Message,
  Transition,
  Grid,
  Header as UiHeader,
} from "semantic-ui-react";
import { loginOnLoad } from "features/auth/authSlice";
import Header from "components/Header";
import SignInForm from "features/auth/SignInForm";
import Profile from "features/user/Profile";
import Tasks from "features/task/Tasks";
import Categories from "features/category/Categories";
import Builder from "features/builder/Builder";
import { onAuthStateChanged } from "../firebase-utils/firebase";
import { fetchPermissions } from "features/user/userSlice";

export const history = createMemoryHistory();

function App() {
  const dispatch = useDispatch();
  const { isSignedIn, error, status } = useSelector((state) => state.auth);
  const isPermFetched = useSelector((state) => state.user.isPermFetched);
  const userId = useSelector((state) => state.user.id);
  const token = localStorage.getItem("refresh_token");
  const [errorMsg, setErrorMsg] = useState("");
  const [showErrorMsg, setShowErrorMessage] = useState(false);
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
      setErrorMsg(error.signOut);
      setShowErrorMessage(true);
    } else if (isSignedIn) {
      setErrorMsg("");
      setShowErrorMessage(false);
    }
  }, [isSignedIn, error, status]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchPermissions());
    }
  }, [dispatch, userId]);

  useEffect(() => {
    currentPath === "/build" && isPermFetched
      ? setBuilderOpen(true)
      : setBuilderOpen(false);

    currentPath === "/profile" ? setProfileOpen(true) : setProfileOpen(false);
  }, [currentPath, isPermFetched]);

  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <Header signInOpen={setSignInModalOpen} />
      {isSignedIn ? null : (
        <Grid>
          <Grid.Row style={{ padding: ".5em 1.2em" }}>
            <Grid.Column textAlign="right">
              <UiHeader as="h5">
                Don't have an account? Sign up{" "}
                <span
                  onClick={() => console.log("sign up")}
                  style={{ color: "#1b7ec8", cursor: "pointer" }}
                >
                  HERE
                </span>
                .
              </UiHeader>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )}
      <Transition visible={showErrorMsg} animation="fade up" duration={500}>
        <Message
          negative
          onDismiss={() => {
            setShowErrorMessage(false);
          }}
        >
          <Message.Header></Message.Header>
          <Message.Content>{errorMsg}</Message.Content>
        </Message>
      </Transition>
      <SignInForm open={signInModalOpen} setOpen={setSignInModalOpen} />

      {isPermFetched ? (
        <>
          <Profile open={profileOpen} setOpen={setProfileOpen} />
          <Builder open={builderOpen} setOpen={setBuilderOpen} />
        </>
      ) : null}

      <Switch>
        <Route
          path="/signin"
          render={() => {
            setSignInModalOpen(true);
          }}
        />
        <Route path="/tasks" exact component={Tasks} />
        <Route path="/categories" exact component={Categories} />
      </Switch>
    </>
  );
}

export default App;
