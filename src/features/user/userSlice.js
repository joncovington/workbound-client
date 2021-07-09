import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import workboundApi from '../../api/workboundApi';

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

export const fetchPermissions = createAsyncThunk(
    'user/fetchPermissions', 
    async (arg, { rejectWithValue }) => {
        try {
            const response = await workboundApi.get('user/perms/')
            return response.data
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data) 
        }   
});

const INITIAL_STATE = {
    status: 'idle',
    id: null,
    email: '',
    profile: {},
    error: null,
    permissions: {
        task: {
            add_task: {
                verbose: "Can add Task",
                status: false
            },
            change_task: {
                verbose: "Can change Task",
                status: false
            },
            delete_task: {
                verbose: "Can delete Task",
                status: false
            },
            view_task: {
                verbose: "Can view Task",
                status: false
            }
        },
        category: {
            add_category: {
                verbose: "Can add Category",
                status: false
            },
            change_category: {
                "verbose": "Can change Category",
                "status": false
            },
            delete_category: {
                verbose: "Can delete Category",
                status: false
            },
            view_category: {
                verbose: "Can view Category",
                status: false
            }
        },
        workitem: {
            add_workitem: {
                verbose: "Can add WorkItem",
                status: false
            },
            change_workitem: {
                verbose: "Can change WorkItem",
                status: false
            },
            delete_workitem: {
                verbose: "Can delete WorkItem",
                status: false
            },
            view_workitem: {
                verbose: "Can view WorkItem",
                status: false
            }
        },
        section: {
            add_section: {
                verbose: "Can add Section",
                status: false
            },
            change_section: {
                verbose: "Can change Section",
                status: false
            },
            delete_section: {
                verbose: "Can delete Section",
                status: false
            },
            view_section: {
                verbose: "Can view Section",
                status: false
            }
        },
        portfolio: {
            add_portfolio: {
                verbose: "Can add Portfolio",
                status: false
            },
            change_portfolio: {
                verbose: "Can change Portfolio",
                status: false
            },
            delete_portfolio: {
                verbose: "Can delete Portfolio",
                status: false
            },
            view_portfolio: {
                verbose: "Can view Portfolio",
                status: false
            }
        }
    }
}

export const userSlice = createSlice({
    name: 'user',
    initialState: INITIAL_STATE,
    reducers: {
        clearProfile(state) {
            state.status = 'idle'
            state.id = null
            state.email = ''
            state.profile = {}
            state.error = null
            state.permissions = INITIAL_STATE.permissions
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
        },
        [fetchPermissions.pending]: (state) => {
            state.status = 'loading'
        },
        [fetchPermissions.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            action.payload.forEach((perm) => {
                Object.keys(perm).forEach(key => {
                    if (Object.keys(perm[key]).length > 0) {
                        state.permissions[key] = perm[key]
                    }
                })
            })
        },
        [fetchPermissions.rejected]: (state, action) => {
            state.status = 'failed'
            console.log('fetch perm failed')
            state.error = action.payload
            state.permissions = INITIAL_STATE.permissions
        },
        
      }
});

const { actions, reducer } = userSlice

export const { clearProfile } = actions

export default reducer;