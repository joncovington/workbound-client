import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import workboundApi from 'api/workboundApi';

const MEDIA_ROOT = 'http://localhost:8000'

export const fetchToken = createAsyncThunk(
    'auth/fetchToken', 
    async (formData, { rejectWithValue }) => {
        try {
            const response = await workboundApi.post('user/token/', JSON.stringify(formData))
            return response.data
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }   
    }
);

export const loginOnLoad = createAsyncThunk(
    'auth/loginOnLoad', 
    async (token, { rejectWithValue }) => {
        try {
            const response = await workboundApi.post('user/token/refresh/', {refresh: token})
            const data = await response.data
            return data
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }   
    }
);

export const signOut = createAsyncThunk(
    'auth/signOut', 
    async (token, { rejectWithValue }) => {
        try {
            const response = await workboundApi.post('user/logout/', {refresh_token: token})
            const data = await response.data
            return data
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }   
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'idle',
        isSignedIn: false,
        error: {},
    },
    reducers: {
        clearErrors: (state) => {state.error = {}}
    },
    extraReducers: {
        [fetchToken.pending]: (state) => {
            state.status = 'loading'
            state.error = {}
        },
        [fetchToken.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            state.isSignedIn = true
            state.mediaRoot = 'http://localhost:8000/'
            localStorage.setItem('refresh_token', action.payload.refresh)
            workboundApi.defaults.headers['Authorization'] = 'JWT '+ action.payload.access
            localStorage.setItem('wb_media_root', MEDIA_ROOT)
            state.error = {}
        },
        [fetchToken.rejected]: (state, action) => {
            state.status = 'failed'
            if(action.payload.hasOwnProperty('detail')) {
                state.error['signIn'] = action.payload['detail']
            } else {
                state.error = action.payload || {}
            }
            
        },
        [loginOnLoad.pending]: (state) => {
            state.status = 'loading'
            state.error = {}
        },
        [loginOnLoad.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            workboundApi.defaults.headers['Authorization'] = 'JWT '+ action.payload.access
            state.isSignedIn = true
            state.error = {}
        },
        [loginOnLoad.rejected]: (state, action) => {
            state.status = 'failed'
            state.isSignedIn = false
            console.log(action.payload)
            state.error = action.payload || {signOut: 'You have been signed out. Please sign in again.'}
        },
        [signOut.pending]: (state) => {
            state.status = 'loading'
            state.error = {}
        },
        [signOut.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            state.isSignedIn = false
            delete workboundApi.defaults.headers['Authorization']
            localStorage.clear()
            state.error = {signOut: 'You have been successfully signed out.'}
        },
        [signOut.rejected]: (state, action) => {
            state.status = 'failed'
            state.isSignedIn = false
            delete workboundApi.defaults.headers['Authorization']
            localStorage.clear()
            state.error = {signOut: 'You have been signed out. Please sign in again.'}
        },
        
      }
});

export const { clearErrors } = authSlice.actions;
export default authSlice.reducer;