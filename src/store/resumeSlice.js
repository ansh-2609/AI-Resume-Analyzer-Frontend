
import {createSlice} from '@reduxjs/toolkit';  

const resumeSlice = createSlice({
    name: 'resume',
    initialState: {
        resumes:[],
        score: 0,
        strengths: [],
        weaknesses: [],
        improvements: []
    },
    reducers: {
        setResumes(state, action) {
            state.resumes = action.payload;
        },
        setScore(state, action) {
            state.score = action.payload;
        },
        setStrengths(state, action) {
            state.strengths = action.payload;
        },
        setWeaknesses(state, action) {
            state.weaknesses = action.payload;
        },
        setImprovements(state, action) {
            state.improvements = action.payload;
        },
    }
})

export const { setResumes, setScore, setStrengths, setWeaknesses, setImprovements } = resumeSlice.actions;
export default resumeSlice;