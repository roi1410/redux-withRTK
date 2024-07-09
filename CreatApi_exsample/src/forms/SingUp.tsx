import { useForm } from "react-hook-form";
import { CVApi } from "../store/api";
export default function SingUp() {
  interface IFormValue {
    username: string;
    email: string;
    password: string;
  }
  const { handleSubmit, register } = useForm<IFormValue>();
  const [attemptAccess, { data: userData, error, isLoading }] =CVApi.useSignupMutation();

  console.log("singUpData");
  console.log(userData);
  console.log("singUp Error");
  console.log(error);
  console.log("singUp isLoading");
  console.log(isLoading);
  const { refetch:userRefetch } = CVApi.useGetUserByIdQuery();
 async function handleSingUp(data: IFormValue) {
    await attemptAccess(data);
    userRefetch();
  }
  return (
    <form
      onSubmit={handleSubmit((data) => handleSingUp(data))}
      className="formWrap">
      <h1>Sing Up</h1>
      <label style={{ alignItems: "start" }} className="formWrap">
        <span>username</span>
        <input {...register("username")} type="text" />
      </label>
      <label style={{ alignItems: "start" }} className="formWrap">
        <span>email</span>
        <input {...register("email")} type="text" />
      </label>
      <label style={{ alignItems: "start" }} className="formWrap">
        <span>password</span>
        <input {...register("password")} type="text" />
      </label>
      <button type="submit">submit</button>
    </form>
  );
}
