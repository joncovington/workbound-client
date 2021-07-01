import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import workboundApi from 'api/workboundApi';

const media_root = 'http://localhost:8000'

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

export const updateProfile = createAsyncThunk(
    'user/updateProfile', 
    async (bodyFormData, { rejectWithValue }) => {
        try {
            const response = await workboundApi.patch('user/me/update/', bodyFormData, {
                headers: {
                    'Content-Type' : 'multipart/form-data',
                }
            })
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
        email: '',
        profile: {},
        error: null
    },
    reducers: {
        clearProfile(state) {
            state.status = 'idle'
            state.id = null
            state.email = ''
            state.profile = {}
            state.error = null
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
            state.profile = action.payload.profile
            action.payload.profile.image
            ? state.profile.image = media_root + action.payload.profile.image
            : state.profile.image = null
        },
        [fetchProfile.rejected]: (state, action) => {
            state.status = 'failed'
            state.id = null
            state.email = ''
            state.profile = {}
            state.error = action.payload
        },
        [updateProfile.pending]: (state) => {
            state.status = 'loading'
        },
        [updateProfile.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            state.profile = action.payload.profile
            if (media_root + action.payload.profile.image !== state.profile.image) {
                state.profile.image = media_root + action.payload.profile.image
            }
        },
        [updateProfile.rejected]: (state, action) => {
            state.status = 'failed'
            state.id = null
            state.email = ''
            state.profile = {}
            state.error = action.payload
        }
        
      }
});

const { actions, reducer } = userSlice

export const { clearProfile } = actions

export default reducer;