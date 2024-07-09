
import { useForm } from "react-hook-form";
import { CVApi, IUserLogin,  } from "../store/api";

export default function Login() {
  const { handleSubmit, register } = useForm<IUserLogin>();

  const [attemptAccess, { isLoading, error, data:userData }] = CVApi.useLogInMutation();
  // console.log("data returned");
  // console.log(data);
  // console.log("isLoading");
  // console.log(isLoading);
  // console.log("error");
  // console.log(error);
  const {refetch,data:authData}=CVApi.useGetUserByIdQuery()
  async function handleLogin(formData:IUserLogin) { 
     await attemptAccess(formData)
    refetch()
  }
  return (
    <form
      onSubmit={handleSubmit((data) => handleLogin(data))}
      className="formWrap">
      <h1>Login</h1>
      <button onClick={()=>console.log(userData,authData)}>userData log</button>
      <label style={{ alignItems: "start" }} className="formWrap">
        <span>username</span>
        <input {...register("username")} type="text" />
      </label>
      <label style={{ alignItems: "start" }} className="formWrap">
        <span>password</span>
        <input {...register("password")} type="text" />
      </label>
      <button type="submit">submit</button>
    </form>
  );
}
