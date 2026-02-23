import React, { useState } from "react";
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, Input, Switch, Divider
} from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { FaUser, FaEnvelope, FaLock, FaKey } from "react-icons/fa6";


const profileSchema = z.object({
  name: z.string().min(3, "El nombre es muy corto"),
  email: z.string().email("Correo inválido"),
  username: z.string().min(3, "Usuario muy corto"),
  changePassword: z.boolean(),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.changePassword) {
    if (!data.password || data.password.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mínimo 6 caracteres",
        path: ["password"],
      });
    }
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "No coinciden",
        path: ["confirmPassword"],
      });
    }
  }
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen, onClose, user, onSubmit, isLoading
}) => {
  // Estado local para animación visual del switch
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // Helper de validación manual (Igual que en ProductForm)
  const validate = (field: keyof ProfileFormValues, value: any, allValues: ProfileFormValues) => {
    // Para validaciones complejas
    const result = profileSchema.safeParse({ ...allValues, [field]: value });

    if (!result.success) {
      // Buscamos el error específico de este campo
      const error = result.error.errors.find(e => e.path[0] === field);
      return error ? error.message : undefined;
    }
    return undefined;
  };

  const form = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      username: user?.username || "",
      changePassword: false,
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }: { value: ProfileFormValues }) => {
      const payload: any = {
        name: value.name,
        email: value.email,
        username: value.username,
      };
      if (value.changePassword && value.password) {
        payload.password = value.password;
      }
      await onSubmit(payload);
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col gap-4"
          >
            <ModalHeader className="flex flex-col gap-1">Editar Perfil</ModalHeader>

            <ModalBody className="gap-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Información Pública
              </p>

              <form.Field
                name="name"
                validators={{ onChange: ({ value, fieldApi }) => validate("name", value, fieldApi.form.state.values) }}
                children={(field) => (
                  <Input
                    label="Nombre Completo"
                    startContent={<FaUser className="text-default-400" />}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onValueChange={field.handleChange}
                    isInvalid={!!field.state.meta.errors.length}
                    errorMessage={field.state.meta.errors.join(", ")}
                    variant="bordered"
                  />
                )}
              />

              <div className="flex gap-4">
                <form.Field
                  name="username"
                  validators={{ onChange: ({ value, fieldApi }) => validate("username", value, fieldApi.form.state.values) }}
                  children={(field) => (
                    <Input
                      label="Usuario"
                      startContent={<span className="text-default-400 text-sm">@</span>}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onValueChange={field.handleChange}
                      isInvalid={!!field.state.meta.errors.length}
                      errorMessage={field.state.meta.errors.join(", ")}
                      variant="bordered"
                      className="flex-1"
                    />
                  )}
                />
                <form.Field
                  name="email"
                  validators={{ onChange: ({ value, fieldApi }) => validate("email", value, fieldApi.form.state.values) }}
                  children={(field) => (
                    <Input
                      label="Correo"
                      startContent={<FaEnvelope className="text-default-400" />}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onValueChange={field.handleChange}
                      isInvalid={!!field.state.meta.errors.length}
                      errorMessage={field.state.meta.errors.join(", ")}
                      variant="bordered"
                      className="flex-1"
                    />
                  )}
                />
              </div>

              <Divider className="my-2" />

              {/* Sección Seguridad */}
              <div className="flex justify-between items-center bg-gray-50 dark:bg-neutral-800 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-warning-100 text-warning-600 rounded-full"><FaLock /></div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">Seguridad</span>
                    <span className="text-xs text-gray-500">¿Cambiar contraseña?</span>
                  </div>
                </div>

                <form.Field
                  name="changePassword"
                  children={(field) => (
                    <Switch
                      size="sm"
                      color="warning"
                      isSelected={field.state.value}
                      onValueChange={(val) => {
                        field.handleChange(val);
                        setShowPasswordFields(val);
                        if (!val) {
                          form.setFieldValue("password", "");
                          form.setFieldValue("confirmPassword", "");
                        }
                      }}
                    />
                  )}
                />
              </div>

              {/* Campos Condicionales */}
              {showPasswordFields && (
                <div className="space-y-4 animate-appearance-in">
                  <form.Field
                    name="password"
                    validators={{ onChange: ({ value, fieldApi }) => validate("password", value, fieldApi.form.state.values) }}
                    children={(field) => (
                      <Input
                        type="password"
                        label="Nueva Contraseña"
                        startContent={<FaKey className="text-default-400" />}
                        value={field.state.value || ""}
                        onBlur={field.handleBlur}
                        onValueChange={field.handleChange}
                        isInvalid={!!field.state.meta.errors.length}
                        errorMessage={field.state.meta.errors.join(", ")}
                        variant="flat"
                        color="warning"
                      />
                    )}
                  />
                  <form.Field
                    name="confirmPassword"
                    validators={{ onChange: ({ value, fieldApi }) => validate("confirmPassword", value, fieldApi.form.state.values) }}
                    children={(field) => (
                      <Input
                        type="password"
                        label="Confirmar"
                        startContent={<FaKey className="text-default-400" />}
                        value={field.state.value || ""}
                        onBlur={field.handleBlur}
                        onValueChange={field.handleChange}
                        isInvalid={!!field.state.meta.errors.length}
                        errorMessage={field.state.meta.errors.join(", ")}
                        variant="flat"
                        color="warning"
                      />
                    )}
                  />
                </div>
              )}

            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>Cancelar</Button>
              <Button color="primary" type="submit" isLoading={isLoading}>Guardar Cambios</Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};