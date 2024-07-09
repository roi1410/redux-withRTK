import "./App.css";
import SingUp from "./forms/SingUp";
import Login from "./forms/Login";
import { CVApi } from "./store/api";

function App() {
  // const { data:tokenData, isLoading ,isSuccess ,refetch:refetchAuth} = CVApi.useAuthTokenQuery()
  const [addPrime ,{data:primeData}]=CVApi.useAddPrimeMutation()
  const {data:userData,refetch:refachUser, isLoading ,isSuccess }=CVApi.useGetUserByIdQuery()
  function handleAddPrime() {
    // console.log(userData);
    addPrime()
  }
  // console.log("primeData");
  // console.log(primeData);
  return (
    
    <>
      <button onClick={()=>handleAddPrime()}>handleAddPrime</button>
      {isLoading&&<span>loading . . .</span>}
      {isSuccess&&!isLoading&&userData.role==='prime'&&userData?.username&&<span>{userData?.username}  is authorize and </span>}
      {isSuccess&&!isLoading&&<span>{userData.username} is connected </span>}

      <SingUp />
      <Login />
      
    </>
  );
}

export default App;