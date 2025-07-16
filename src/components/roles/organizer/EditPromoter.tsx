"use client"

import React from 'react';
// import { users } from '@/template-data';
// import DefaultForm from '@/components/ui/forms/DefaultForm';
// import FormInput from '@/components/ui/inputs/FormInput';
// import { redirect } from 'next/navigation';

const EditPromoter = ({ userId } : { userId: number }) => {
  console.log(userId)
  // const selectedUser = users.find(user => user.userId === userId);
  
  // if (!selectedUser) {
  //   alert("No se encontró el usuario")
  //   redirect("/")
  // }

  // const [formData, setFormData] = useState({
  //   name: "",
  //   email: "",
  //   telephone: "",
  // });
  
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log("Form submitted:", formData);
  // };

  return (
    // <DefaultForm handleSubmit={handleSubmit} title={`${selectedUser?.name} - ${selectedUser?.role}`}>
    //   <FormInput
    //     handleFunc={handleChange}
    //     title="Nombre completo*"
    //     formName={formData.name}
    //     inputName="name"
    //   />
    //   <FormInput
    //     type="email"
    //     handleFunc={handleChange}
    //     title="Mail*"
    //     formName={formData.email}
    //     inputName="email"
    //   />
    //   <FormInput
    //     type="number"
    //     handleFunc={handleChange}
    //     title="Número de celular*"
    //     formName={formData.telephone}
    //     inputName="telephone"
    //   />

    //   <button
    //     type="submit"
    //     className="bg-red-500/20 mt-8 mb-0 text-primary-white input-button"
    //   >
    //     Eliminar
    //   </button>
    //   <button
    //     type="submit"
    //     className="bg-primary text-black input-button"
    //   >
    //     Editar
    //   </button>
    // </DefaultForm>
    <></>
  );
}

export default EditPromoter;