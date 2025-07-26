import React, { useContext } from "react";
import AppContext from "../../context/AppContext";
import UserForm from "./Form";

const Register = () => {
  const { registerUser } = useContext(AppContext);

  const initialData = { name: "", email: "", password: "" };

  const handleRegister = async (formData) => {
    return await registerUser(formData);
  };

  return <UserForm initialData={initialData} onSubmit={handleRegister} buttonText="Register" />;
};

export default Register;
