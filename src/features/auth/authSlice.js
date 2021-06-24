import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import workboundApi from 'api/workboundApi';

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
            const response = await workboundApi.post('user/token/refresh/', JSON.stringify({refresh: token}))
            return response.data
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
        user: {}
    },
    reducers: {
        signOut(state) {
            state.isSignedIn = false
            state.status = 'idle'
            state.error = null
            state.user = {}
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            delete workboundApi.defaults.headers['Authorization']
        }
    },
    extraReducers: {
        [fetchToken.pending]: (state) => {
            state.status = 'loading'
            state.error = null
            localStorage.removeItem('access_token');
        },
        [fetchToken.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            state.isSignedIn = true
            localStorage.setItem('access_token', action.payload.access)
            localStorage.setItem('refresh_token', action.payload.refresh)
            workboundApi.defaults.headers['Authorization'] = 'JWT '+ action.payload.access
        },
        [fetchToken.rejected]: (state, action) => {
            state.status = 'failed'
            state.error = action.payload
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
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
            console.log(action.payload)
        },
        
      }
});

const { actions, reducer } = authSlice

export const { signOut } = actions

export default reducer;