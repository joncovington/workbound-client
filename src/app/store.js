import { configureStore } from '@reduxjs/toolkit'
import authSliceReducer from '../features/auth/authSlice'
import userSliceReducer from '../features/user/userSlice'
import { apiSlice } from '../api/apiSlice'

export default configureStore({
  reducer: {
      auth: authSliceReducer,
      user: userSliceReducer,
      [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(apiSlice.middleware);
  }
})