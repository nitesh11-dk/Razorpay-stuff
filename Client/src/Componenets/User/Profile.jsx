import { useContext, useEffect } from 'react'
import AppContext from '../../context/AppContext'
import { Link, useNavigate } from 'react-router-dom';


const Profile = () => {
    let  {user,fetchUserProfile,deleteUser ,logoutUser} = useContext(AppContext);
    const navigate = useNavigate();
   useEffect(()=>{
    fetchUserProfile();
   },[])
    
   if(!user){
    return <div>Loading...</div>
   }
  return (
    <div className="flex justify-center items-center h-[92vh]">
    <div className="w-80 bg-gray-800 text-white rounded-lg shadow-md p-6">
      <div className="flex flex-col items-center">
        <div className="bg-blue-500 h-16 w-16 rounded-full flex justify-center items-center text-xl font-bold uppercase">
          {user.name.slice(0, 2)}
        </div>
        <h1 className="mt-4 text-xl font-semibold">{user.name}</h1>
        <p className="text-gray-400">{user.email}</p>
      </div>
      <div className="mt-4">
        <p className="text-sm">
          <span className="font-bold text-gray-300">User ID:</span> {user._id}
        </p>
        <p className="text-sm mt-2">
          <span className="font-bold text-gray-300">Created At:</span> {new Date(user.createdAt).toLocaleString()}
        </p>
      </div>
      <Link to="/edituser">
        <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
          Edit Profile
        </button>
      </Link>
      {/* <button onClick={()=>{deleteUser(user._id) ;
      }} className="mt-4 bg-red-500 hover:bg-red-600 mx-2 text-white font-semibold py-2 px-4 rounded">
          Delete Profile
        </button> */}
    </div>
  </div>
  )
}

export default Profile