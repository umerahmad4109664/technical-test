import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
token?: string;

}

interface UsersState {
  user: User | null;
  loading: boolean;
  error: string | null;
  token: string | null;
  success:boolean;
  message:string | null;
  loginSuccess:boolean;
  tasks: [];
  toggle:boolean;
}

const initialState: UsersState = {
  user: null,
  loading: false,
  error: null,
  token: sessionStorage.getItem('token'),
  success:false,
  message:null,
  loginSuccess:false,
  tasks: [],
  toggle:false
};

export const login = createAsyncThunk('users/login', async ({ email, password }: { email: string; password: string }, thunkAPI) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, { email, password });
    console.log(response.data);
    return response.data; 
  } catch (error: any) {
    console.log(error);
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});
export const registerUser = createAsyncThunk('users/register', async ({ name, email, password }: { name: string; email: string; password: string }, thunkAPI) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/createaccount`, { name, email, password });
    console.log(response.data);
    return response.data; 
  } catch (error: any) {
    console.log(error);
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});
export const getUserTasks = createAsyncThunk('users/getUserTasks', async ({ token }: { token: string }, thunkAPI) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/getTasks`, { headers: { authorization: `${token}` } });
    console.log(response.data);
    return response.data; 
  } catch (error: any) {
    console.log(error);
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});
export const toggleSubtask = createAsyncThunk('users/toggleSubtask', async ({ token, subtaskId }: { token: string, subtaskId: number }, thunkAPI) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/toggleSubtask`, { subtaskId }, { headers: { authorization: `${token}` } });
    console.log(response.data);
    return response.data; 
  } catch (error: any) {
    console.log(error);
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const addTask = createAsyncThunk(
  'users/addTask',
  async ({ token, title }: { token: string; title: string }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/createTask`,
        { title },
        { headers: { authorization: `${token}` } }
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add task');
    }
  }
);

export const addSubtask = createAsyncThunk(
  'users/addSubtask',
  async (
    { token, taskId, title }: { token: string; taskId: number; title: string },
    thunkAPI
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/createSubtask`,
        { taskId, text:title },
        { headers: { authorization: `${token}` } }
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add subtask');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.success = false;
    },
    resetmessage: (state) => {
      state.message = null;
    },
    resetLoginSuccess: (state) => {
      state.loginSuccess = false;
    },
    resetToggleSubtask: (state) => {
      state.toggle = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        sessionStorage.setItem('token', action.payload.token);
        state.token = action.payload.token;
        state.loginSuccess = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
      builder.addCase(getUserTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
      })
      .addCase(getUserTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
      builder.addCase(toggleSubtask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleSubtask.fulfilled, (state, action) => {
        state.loading = false;
        state.toggle = true;
      })
      .addCase(toggleSubtask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      builder.addCase(addTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;
        state.toggle = true;
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      builder.addCase(addSubtask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSubtask.fulfilled, (state, action) => {
        state.loading = false;
        state.toggle = true;
      })
      .addCase(addSubtask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetSuccess, resetmessage ,resetLoginSuccess,resetToggleSubtask} = usersSlice.actions;
export default usersSlice.reducer;
