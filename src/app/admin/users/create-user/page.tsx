"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormDropDown from "@/components/ui/inputs/FormDropDown";
import FormInput from "@/components/ui/inputs/FormInput";
import PhoneInput from "@/components/ui/inputs/PhoneInput";
import {
  notifyError,
  notifySuccess,
} from "@/components/ui/toast-notifications";
import { useAdminAllRoles } from "@/hooks/admin/queries/useAdminData";
import { createUser } from "@/services/admin-users";
import { useMutation } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { suggestEmail } from "@/utils/emailSuggestion";
import { useDebounce } from "@/hooks/useDebounce";
import SpinnerSvg from "@/components/svg/SpinnerSvg";

const generateRandomPassword = (length = 8): string => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export default function CreateUser() {
  const { register, handleSubmit, control, setValue, watch } = useForm<ICreateUser>();
  const router = useRouter();
  const { getCookie } = useReactiveCookiesNext();

  const token = getCookie("token");

  // obtenemos todos los roles
  const { roles } = useAdminAllRoles({ token });

  React.useEffect(() => {
    setValue("password", generateRandomPassword());
  }, [setValue]);

  const emailValue = watch("email", "");
  const debouncedEmail = useDebounce(emailValue ?? "", 600);
  const [emailSuggestion, setEmailSuggestion] = React.useState<string | null>(null);

  React.useEffect(() => {
    setEmailSuggestion(suggestEmail(debouncedEmail));
  }, [debouncedEmail]);

  const applySuggestion = () => {
    if (!emailSuggestion) return;
    setValue("email", emailSuggestion, { shouldValidate: true });
    setEmailSuggestion(null);
  };

  // creamos el usuario
  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      const decoded: IUserLogin = jwtDecode(`${token}`);

      if (decoded.role !== "ADMIN") {
        notifyError("No tienes permiso para crear un usuario.");
        return;
      }
      notifySuccess("Usuario creado correctamente");
      router.back();
    },
    onError: (error) => {
      notifyError("Campos invalidos o error al crear usuario.");
      console.log(error);
    },
  });

  const onSubmit = (data: Partial<ICreateUser>) => {
    const password =
      data.password && data.password.trim() !== ""
        ? data.password
        : generateRandomPassword();

    mutate({
      token,
      formData: {
        name: data.name,
        password,
        email: data.email,
        phone: data.phone,
        roleId: data.roleId,
        isActive: true,
      },
    });
  };

  return (
    <DefaultForm
      autocomplete="off"
      handleSubmit={handleSubmit(onSubmit)}
      title="Crear usuario"
    >
      <FormInput
        title="Nombre completo*"
        inputName="name"
        register={register("name", { required: true })}
        autoComplete="off"
      />
      <FormInput
        title="Contraseña"
        inputName="password"
        register={register("password", { required: false })}
        autoComplete="new-password"
      />
      <PhoneInput
        title="Número de celular*"
        name="phone"
        control={control}
        rules={{ required: true }}
        autoComplete="off"
      />
      <FormInput
        type="email"
        title="Email*"
        inputName="email"
        register={register("email", { required: true })}
        autoComplete="off"
      />
      {emailSuggestion && (
        <button
          type="button"
          onClick={applySuggestion}
          className="-mt-1 flex items-center gap-1.5 w-fit text-xs text-primary-white/60 hover:text-primary-white transition-colors group"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary flex-shrink-0">
            <polyline points="9 11 12 14 22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          <span>
            ¿Quisiste decir{" "}
            <span className="text-primary font-medium group-hover:underline underline-offset-2">
              {emailSuggestion}
            </span>
            ?
          </span>
        </button>
      )}

      <FormDropDown
        title="Rol*"
        register={register("roleId", {
          required: true,
          setValueAs: (v) => (v === "" ? undefined : Number(v)),
        })}
      >
        {roles?.map((role: IRole) => (
          <option key={role.roleId} value={role.roleId}>
            {role.name}
          </option>
        ))}
      </FormDropDown>
      {/* <FormInput
        type="number"
        title="Comisión (%)*"
        inputName="commission"
        register={register("commission", { required: true })}
      /> */}

      <button
        type="submit"
        className="bg-primary text-primary-white input-button flex items-center justify-center gap-x-2 disabled:opacity-70 disabled:pointer-events-none"
        disabled={isPending}
      >
        {isPending && <SpinnerSvg className="fill-primary-white text-inactive w-5 h-5" />}
        {isPending ? "Creando usuario..." : "Crear usuario"}
      </button>
    </DefaultForm>
  );
}
