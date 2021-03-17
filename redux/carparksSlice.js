import { createSlice } from '@reduxjs/toolkit';

const carparksSlice = createSlice({
    name: "carparks",
    initialState: {carparksData: []},
    reducers: {
        setCarparks: (state, action) => {
            state.carparksData = action.payload;
        }
    }
})

// export action creators
export const { setCarparks } = carparksSlice.actions;

// export reducers
export default carparksSlice.reducer;