import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import workboundApi from '../../api/workboundApi';

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
        error: null,
    },
    extraReducers: {
        [fetchToken.pending]: (state) => {
            state.status = 'loading'
            state.error = null
        },
        [fetchToken.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            state.isSignedIn = true
            state.mediaRoot = 'http://localhost:8000/'
            localStorage.setItem('refresh_token', action.payload.refresh)
            workboundApi.defaults.headers['Authorization'] = 'JWT '+ action.payload.access
            localStorage.setItem('wb_media_root', MEDIA_ROOT)
        },
        [fetchToken.rejected]: (state, action) => {
            state.status = 'failed'
            state.error = action.payload
        },
        [loginOnLoad.pending]: (state) => {
            state.status = 'loading'
        },
        [loginOnLoad.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            workboundApi.defaults.headers['Authorization'] = 'JWT '+ action.payload.access
            state.isSignedIn = true
        },
        [loginOnLoad.rejected]: (state, action) => {
            state.status = 'failed'
            state.isSignedIn = false
        },
        [signOut.pending]: (state) => {
            state.status = 'loading'
        },
        [signOut.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            state.isSignedIn = false
            state.error = null
            delete workboundApi.defaults.headers['Authorization']
            localStorage.clear()
        },
        [signOut.rejected]: (state, action) => {
            state.status = 'failed'
            state.isSignedIn = false
            state.error = action.payload
        },
        
      }
});

const { reducer } = authSlice

export default reducer;