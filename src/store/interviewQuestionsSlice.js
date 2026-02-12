
import {createSlice} from '@reduxjs/toolkit';  

const interviewQuestionsSlice = createSlice({
    name: 'interviewQuestions',
    initialState: {
        questions: [],
        jobId:'',
        jobTitle: '',   
    },
    reducers: {
        setQuestions: (state, action) => {
            state.questions = action.payload;
        },
        setJobId: (state, action) => {
            state.jobId = action.payload;
        },
        setJobTitle: (state, action) => {
            state.jobTitle = action.payload;
        },
    }
})

export const { setQuestions, setJobId, setJobTitle} = interviewQuestionsSlice.actions;
export default interviewQuestionsSlice;