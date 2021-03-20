import { createSlice } from '@reduxjs/toolkit';
import { SORT_BY_DISTANCE } from '../constants/sortCriteriaConstants';

const sortCriteriaSlice = createSlice({
    name: "sortCriteria",
    initialState: {criteria: SORT_BY_DISTANCE},
    reducers: {
        setSortCriteria: (state, action) => {
            state.criteria = action.payload;
        }
    }
})

// export action creators
export const { setSortCriteria } = sortCriteriaSlice.actions;

// export reducers
export default sortCriteriaSlice.reducer;