import React from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import store, { history } from "app/store";

const Root = (props) => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>{props.children}</ConnectedRouter>
    </Provider>
  );
};

export default Root;
