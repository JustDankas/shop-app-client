import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user:{
        email:'',
        isAdmin:false,
        username:'',
    },
    isLogged:false
}

export const userSlice = createSlice({
    name:'user',
    initialState,
    reducers: {
        login: (state,action)=>{
            console.log(action.payload)
            state.user = action.payload.user
            state.isLogged = true
        },
        logout: (state)=>{
            state = initialState
        }
    }
})

export const {login,logout} = userSlice.actions;
export default userSlice.reducer;