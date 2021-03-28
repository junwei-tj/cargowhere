import { createSlice } from '@reduxjs/toolkit';

const maxCarparksSlice = createSlice({
    name: "maxCarparks",
    initialState: {limit: 15},
    reducers: {
        setMaxCarparks: (state, action) => {
            state.limit = action.payload;
        }
    }
})

// export action creators
export const { setMaxCarparks } = maxCarparksSlice.actions;

// export reducers
export default maxCarparksSlice.reducer;