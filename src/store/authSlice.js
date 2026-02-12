
import {createSlice} from '@reduxjs/toolkit';  

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isloggedin: false,
        userId: null,
        token: null,
    },
    reducers: {
        login(state, action){
            state.isloggedin = true;
            state.userId = action.payload.userId;
            state.token = action.payload.token;
        },
        logout(state){
            state.isloggedin = false;
            state.userId = null;
            state.token = null;
        }
    }
})

export const { login, logout} = authSlice.actions;
export default authSlice;