import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import workboundApi from 'api/workboundApi';

export const getToken = createAsyncThunk(
    'auth/getToken', 
    async (formData, { dispatch, rejectWithValue }) => {
        try {
            const response = await workboundApi.post('user/token/', JSON.stringify(formData))
            return response.data
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }   
    })

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
        [getToken.pending]: (state) => {
            state.status = 'loading'
            state.error = null
            localStorage.removeItem('access_token');
        },
        [getToken.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            state.isSignedIn = true
            localStorage.setItem('access_token', action.payload.access)
            localStorage.setItem('refresh_token', action.payload.refresh)
            workboundApi.defaults.headers['Authorization'] = 'JWT '+ action.payload.access
        },
        [getToken.rejected]: (state, action) => {
            state.status = 'failed'
            state.error = action.payload
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        },
        
      }
});

const { actions, reducer } = authSlice

export const { signOut } = actions

export default reducer;