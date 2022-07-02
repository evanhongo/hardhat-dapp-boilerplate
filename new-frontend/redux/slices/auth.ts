import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import axios from "axios";

import { FRONTEND_URL, IDLE, PENDING, SUCCESS, FAILURE } from "@/config";

export const login = createAsyncThunk(
  "auth/login",
  async (payload, { getState, dispatch, requestId }: any) => {
    const { status } = getState()["auth"];
    if (status !== PENDING /* ||requestId !== currentRequestId */) {
      return;
    }

    try {
      await axios.post(`${FRONTEND_URL}/api/auth/login`, payload, {
        withCredentials: true,
      });

      const res = await axios.get(`${FRONTEND_URL}/api/auth/getProfile`, {
        withCredentials: true,
      });

      return res.data;
    } catch (err: any) {
      throw Error(err);
    }
  }
);

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (payload, { getState, dispatch, requestId }: any) => {
    const { status } = getState()["auth"];
    if (status !== PENDING /* ||requestId !== currentRequestId */) {
      return;
    }

    try {
      const res = await axios.get(`${FRONTEND_URL}/api/auth/getProfile`, {
        withCredentials: true,
      });

      return res.data;
    } catch (err: any) {
      throw Error(err);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (payload, { getState, dispatch, requestId }: any) => {
    const { status } = getState()["auth"];
    if (status !== PENDING /* ||requestId !== currentRequestId */) {
      return;
    }

    try {
      await axios.post(`${FRONTEND_URL}/api/auth/logout`, {
        withCredentials: true,
      });
      return;
    } catch (err: any) {
      throw Error(err);
    }
  }
);

const hydrate = createAction(HYDRATE);

const INITIAL_AUTH_STATE: {
  status: string;
  error: string | undefined;
  profile: any;
} = {
  status: IDLE,
  error: "",
  profile: null,
};

const slice = createSlice({
  name: "auth",
  initialState: INITIAL_AUTH_STATE,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    dismissError: (state, _) => {
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrate, (state, action : any) => {
        state.profile = action.payload.auth.profile;
      })
      .addCase(login.pending, (state, _) => {
        if (state.status !== PENDING) {
          state.status = PENDING;
          // state.currentRequestId = action.meta.requestId
        }
      })
      .addCase(login.fulfilled, (state, action) => {
        if (state.status === PENDING) {
          state.status = SUCCESS;
          state.profile = action.payload;
          // state.currentRequestId = action.meta.requestId
        }
      })
      .addCase(login.rejected, (state, action) => {
        if (state.status === PENDING) {
          state.status = FAILURE;
          state.error = action.error.message;
          // state.currentRequestId = action.meta.requestId
        }
      })
      .addCase(getProfile.pending, (state, _) => {
        if (state.status !== PENDING) {
          state.status = PENDING;
          // state.currentRequestId = action.meta.requestId
        }
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        if (state.status === PENDING) {
          state.status = SUCCESS;
          state.profile = action.payload;
          // state.currentRequestId = action.meta.requestId
        }
      })
      .addCase(getProfile.rejected, (state, action) => {
        if (state.status === PENDING) {
          state.status = FAILURE;
          state.error = action.error.message;
          // state.currentRequestId = action.meta.requestId
        }
      })
      .addCase(logout.pending, (state, _) => {
        if (state.status !== PENDING) {
          state.status = PENDING;
          // state.currentRequestId = action.meta.requestId
        }
      })
      .addCase(logout.fulfilled, (state, _) => {
        if (state.status === PENDING) {
          state.status = SUCCESS;
          state.profile = undefined;
          // state.currentRequestId = action.meta.requestId
        }
      })
      .addCase(logout.rejected, (state, action) => {
        if (state.status === PENDING) {
          state.status = FAILURE;
          state.error = action.error.message;
          // state.currentRequestId = action.meta.requestId
        }
      });
  },
});

export const { setProfile, dismissError } = slice.actions;

export default slice;
