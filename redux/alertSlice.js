import {createSlice} from '@reduxjs/toolkit';

const alertSlice = createSlice({
  name: 'alert',
  initialState: {
      alertData: false,
      alertMessage: '',
  },
  reducers: {
    setAlert: (state, action) => {
      state.alertData = action.payload;
    },
    setMessage: (state, action) => {
      state.alertMessage = action.payload;  
    },
  },
});

// export action creators
export const {setAlert, setMessage} = alertSlice.actions;

// export reducers
export default alertSlice.reducer;