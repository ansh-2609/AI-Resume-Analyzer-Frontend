
import {createSlice} from '@reduxjs/toolkit';  

const jobMatchedSlice = createSlice({
    name: 'jobMatched',
    initialState: {
        matchedJobs: [],
    },
    reducers: {
        setJobMatched(state, action){
            state.matchedJobs = action.payload || [];
        }
    }
})

export const { setJobMatched } = jobMatchedSlice.actions;
export default jobMatchedSlice;