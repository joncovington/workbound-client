import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import workboundApi from "../../api/workboundApi";
import { addMessage } from "features/messages/messagesSlice";

const media_root = "http://localhost:8000";

export const fetchProfile = createAsyncThunk(
  "user/fetchProfile",
  async (arg, { rejectWithValue }) => {
    try {
      const response = await workboundApi.get("user/me/");
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (bodyFormData, { rejectWithValue, dispatch }) => {
    try {
      const response = await workboundApi.patch(
        "user/me/update/",
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      dispatch(addMessage('Profile Updated', 'positive', 'Success'))
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      dispatch(addMessage('Something went wrong', 'negative', 'Failure'))
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchPermissions = createAsyncThunk(
  "user/fetchPermissions",
  async (arg, { rejectWithValue }) => {
    try {
      const response = await workboundApi.get("user/perms/");
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

const INITIAL_STATE = {
  status: "idle",
  id: null,
  email: "",
  profile: {},
  error: null,
  isPermFetched: false,
  permissions: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState: INITIAL_STATE,
  reducers: {
    clearProfile(state) {
      state.status = "idle";
      state.id = null;
      state.email = "";
      state.profile = {};
      state.error = null;
      state.permissions = INITIAL_STATE.permissions;
    },
  },
  extraReducers: {
    [fetchProfile.pending]: (state) => {
      state.status = "loading";
    },
    [fetchProfile.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.profile = action.payload.profile;

      if (action.payload.profile.image) {
        state.profile.image = media_root + action.payload.profile.image;
        state.profile.thumbnail = media_root + action.payload.profile.thumbnail;
      } else {
        state.profile.image = null;
        state.profile.thumbnail = null;
      }
    },
    [fetchProfile.rejected]: (state, action) => {
      state.status = "failed";
      state.id = null;
      state.email = "";
      state.profile = {};
      state.error = action.payload;
    },
    [updateProfile.pending]: (state) => {
      state.status = "loading";
    },
    [updateProfile.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.profile = action.payload.profile;
      if (action.payload.profile.image) {
        state.profile.image = media_root + action.payload.profile.image;
        state.profile.thumbnail = media_root + action.payload.profile.thumbnail;
      } else {
        state.profile.image = null;
        state.profile.thumbnail = null;
      }
    },
    [updateProfile.rejected]: (state, action) => {
      state.status = "failed";
      state.id = null;
      state.email = "";
      state.profile = {};
      state.error = action.payload;
    },
    [fetchPermissions.pending]: (state) => {
      state.status = "loading";
    },
    [fetchPermissions.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.isPermFetched = true;
      const permissionsObj = {};
      action.payload.forEach((perm) => {
        Object.keys(perm).forEach((key) => {
          permissionsObj[key] = perm[key];
        });
      });
      state.permissions = permissionsObj;
    },
    [fetchPermissions.rejected]: (state, action) => {
      state.status = "failed";
      console.log("fetch perm failed");
      state.error = action.payload;
      state.permissions = INITIAL_STATE.permissions;
    },
  },
});

const { actions, reducer } = userSlice;

export const { clearProfile } = actions;

export default reducer;
