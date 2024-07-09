import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface IUserSingIn {
  username: string;
  password: string;
  email: string;
}

export interface IPostResponse {
  _id: string;
  username: string;
  email: string;
  role: string;
  cv: [];
}
export interface IUserLogin {
  username: string;
  password: string;
}
export interface IAuthUser {
  authorize: boolean;

}

export const CVApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/",
    credentials: "include",
  }),
  reducerPath: "CVApi",

  endpoints: (builder) => ({
    signup: builder.mutation<IUserSingIn, Partial<IPostResponse>>({
      transformResponse: (response, meta, arg) => {
        console.log(response);
        console.log(meta);
        console.log(arg);
        // transform result must return ResultType
        return response as IUserSingIn;
      },
      query: (body) => ({
        url: "users/signup",
        method: "POST",
        body,
      }),
     
    }),
    LogIn: builder.mutation<IUserSingIn, IUserLogin>({
      query: (body) => ({
        url: "users/signin",
        method: "POST",
        body,
      }),
    }),

    authToken: builder.query< IAuthUser,void>({
      query: () => "users/authenticatedToken"
    }),
    addPrime:builder.mutation<string,void>({
      query:()=>({
        url:"users/AddPrime",
        method:"PATCH",
      }),
      async onQueryStarted(args,{queryFulfilled,dispatch}){
        try {
          const {data,meta}=await queryFulfilled
          console.log("data",data);
          console.log("meta",meta);
          console.log("args",args);
          dispatch(CVApi.util.updateQueryData('getUserById',undefined,(user)=>{
            user.role='prime'
          }))            
        } catch (error) {
          console.log(error);
        }
      }
    }),
    getUserById:builder.query<IPostResponse ,void>({
      query:()=>"users/GetByID"
    })
  }),
});




