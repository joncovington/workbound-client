import { configureStore } from '@reduxjs/toolkit'
import authSliceReducer from '../features/auth/authSlice'
import userSliceReducer from '../features/user/userSlice'
import { apiSlice } from '../api/apiSlice'

import { createMemoryHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';

export const history = createMemoryHistory();

export default configureStore({
  reducer: {
      auth: authSliceReducer,
      user: userSliceReducer,
      router: connectRouter(history),
      [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(apiSlice.middleware).concat(routerMiddleware(history));
  }
})