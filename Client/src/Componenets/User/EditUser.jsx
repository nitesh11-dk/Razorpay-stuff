import React, { useContext } from "react";
import AppContext from "../../context/AppContext";
import UserForm from "./Form";

const EditUser = () => {
  const { updateProfile , user } = useContext(AppContext); 

  const initialData = { name: user?.name, email: user?.email, password: "" }; 

  const handleEdit = async (formData) => {
    return await updateProfile(formData);
  };

  return <UserForm initialData={initialData} onSubmit={handleEdit} buttonText="Update" />;
};

export default EditUser;
