import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import workboundApi from 'api/workboundApi';

export const fetchProfile = createAsyncThunk(
    'user/fetchProfile', 
    async (arg, { rejectWithValue }) => {
        try {
            const response = await workboundApi.get('user/me/')
            return response.data
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data) 
        }   
});

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        status: 'idle',
        id: null,
        email: ''
    },
    reducers: {
        clearProfile(state) {
            state.status = 'idle'
            state.id = null
            state.email = ''
        }
    },
    extraReducers: {
        [fetchProfile.pending]: (state) => {
            state.status = 'loading'
        },
        [fetchProfile.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            state.id = action.payload.id
            state.email = action.payload.email
        },
        [fetchProfile.rejected]: (state, action) => {
            state.status = 'failed'
            state.id = null
            state.email = ''
            state.error = action.payload
        }
        
      }
});

const { actions, reducer } = userSlice

export const { clearProfile } = actions

export default reducer;