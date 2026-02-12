import authSlice from "./authSlice";
import { configureStore } from "@reduxjs/toolkit";
import jobMatchedSlice from "./jobMatched";
import resumeSlice from "./resumeSlice";
import themeSlice from "./themeSlice";
import interviewQuestionsSlice from "./interviewQuestionsSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        resume: resumeSlice.reducer,
        jobMatched: jobMatchedSlice.reducer,
        theme: themeSlice.reducer,
        interviewQuestions: interviewQuestionsSlice.reducer
    },
});