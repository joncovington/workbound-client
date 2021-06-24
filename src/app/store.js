import { configureStore } from '@reduxjs/toolkit'
import authSliceReducer from 'features/auth/authSlice'
import userSliceReducer from 'features/user/userSlice'

export default configureStore({
  reducer: {
      auth: authSliceReducer,
      user: userSliceReducer
  },
})