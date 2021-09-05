import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, Menu } from "semantic-ui-react";
import { push } from "connected-react-router";

import UserMenu from "../features/user/UserMenu";

import "./Header.styles.css";

function Header(props) {
  const dispatch = useDispatch()
  const isSignedIn = useSelector((state) => state.auth?.isSignedIn);

  return (
    <Menu>
      <Menu.Item as={NavLink} to="/" className="brand">
        Workbound
      </Menu.Item>
      <Menu.Menu position="right">
        {isSignedIn ? (
          <UserMenu />
        ) : (
          <Menu.Item header>
            <Button onClick={() => dispatch(push('/signIn'))} color="blue">
              Sign In
            </Button>
          </Menu.Item>
        )}
      </Menu.Menu>
    </Menu>
  );
}

export default Header;
