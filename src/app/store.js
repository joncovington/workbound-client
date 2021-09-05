import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "features/auth/authSlice";
import userSliceReducer from "features/user/userSlice";
import builderSliceReducer from "features/builder/builderSlice";
import messagesReducer from "features/messages/messagesSlice";
import { apiSlice } from "api/apiSlice";

import { createMemoryHistory } from "history";
import { connectRouter, routerMiddleware } from "connected-react-router";

export const history = createMemoryHistory();

export default configureStore({
  reducer: {
    auth: authSliceReducer,
    user: userSliceReducer,
    router: connectRouter(history),
    builder: builderSliceReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    messages: messagesReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(routerMiddleware(history));
  },
});
