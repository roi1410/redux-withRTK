import {configureStore}from "@reduxjs/toolkit"
import { CVApi } from "./api"

 export const store= configureStore({
    reducer:{
        [CVApi.reducerPath]:CVApi.reducer
    },
    middleware:(middleware)=>middleware().concat(CVApi.middleware) 
})

export type RootState=ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch

