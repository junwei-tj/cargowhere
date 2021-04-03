import { createSlice } from '@reduxjs/toolkit';

const selectedFavouriteSlice = createSlice({
    name: "selectedFavourite",
    initialState,
    reducers: {
        setSelectedFavourite: (state, action) => {
            state.selected = action.payload;
        },
    },
});

// export action creators
export const { setSelectedFavourite } = selectedFavouriteSlice.actions;

// export reducers
export default selectedFavouriteSlice.reducer;