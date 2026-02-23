import React, { useState } from "react";
import {
    Card,
    CardBody,
    Avatar,
    Button,
    Input,
    Divider,
    Chip
} from "@heroui/react";
import {
    FaUserPen,
    FaArrowRightFromBracket,
    FaBagShopping,
    FaEnvelope,
    FaUserShield
} from "react-icons/fa6";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router";
import { EditProfileModal } from "../components/EditProfileModal";

export const ProfilePage = () => {
    const { user, logoutUser, updateUserState, loading } = useAuth();

    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleEditSubmit = async (data: any) => {
        try {
            updateUserState(data);
            console.log(data);

            setIsEditOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    if (!user) return null;


    const isAdmin = user.role === "admin";

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">

            {/* 1. Tarjeta Principal de Perfil */}
            <Card className="mb-6 overflow-visible">
                {/* Banner Decorativo */}
                <div className="h-40 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-xl relative">
                    {/* Avatar Flotante */}
                    <div className="absolute -bottom-12 left-8 p-1 bg-white dark:bg-neutral-900 rounded-full">
                        <Avatar
                            src="https://i.pravatar.cc/150?u=a042581f4e29026024d" // Placeholder o user.avatar si tuvieras
                            className="w-24 h-24"
                            isBordered
                            color={isAdmin ? "secondary" : "primary"}
                        />
                    </div>
                </div>

                <CardBody className="pt-16 pb-8 px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                {user.name}
                                {isAdmin && (
                                    <Chip startContent={<FaUserShield />} size="sm" color="secondary" variant="flat">
                                        Administrador
                                    </Chip>
                                )}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
                        </div>

                        <div className="flex gap-3">
                            <Button color="danger" variant="flat" startContent={<FaArrowRightFromBracket />} onPress={logoutUser}>
                                Cerrar Sesión
                            </Button>
                            <Button color="primary" variant="solid" startContent={<FaUserPen />}
                                onPress={() => setIsEditOpen(true)}
                            >
                                Editar Perfil
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* 2. Grid de Detalles y Accesos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Columna Izquierda: Información Personal */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="p-4">
                        <h3 className="text-lg font-bold mb-4 px-2">Información Personal</h3>
                        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Nombre Completo"
                                defaultValue={user.name}
                                isReadOnly
                                variant="bordered"
                                labelPlacement="outside"
                            />
                            <Input
                                label="Nombre de Usuario"
                                defaultValue={user.username}
                                isReadOnly
                                variant="bordered"
                                labelPlacement="outside"
                                startContent={<span className="text-default-400 text-small">@</span>}
                            />
                            <Input
                                label="Correo Electrónico"
                                defaultValue={user.email}
                                isReadOnly
                                variant="bordered"
                                labelPlacement="outside"
                                startContent={<FaEnvelope className="text-default-400" />}
                                className="md:col-span-2"
                            />
                            <Input
                                label="Rol del Sistema"
                                defaultValue={user.role}
                                isReadOnly
                                variant="bordered"
                                labelPlacement="outside"
                                color={isAdmin ? "secondary" : "default"}
                            />
                        </CardBody>
                    </Card>
                </div>

                {/* Columna Derecha: Accesos Rápidos */}
                <div className="space-y-6">
                    <Card className="p-4">
                        <h3 className="text-lg font-bold mb-4 px-2">Accesos Rápidos</h3>
                        <CardBody className="gap-4">
                            <Button
                                as={Link}
                                to="/my-orders"
                                color="primary"
                                variant="flat"
                                className="w-full justify-start h-14"
                                startContent={<div className="p-2 bg-primary/20 rounded-full"><FaBagShopping /></div>}
                            >
                                <div className="flex flex-col items-start ml-2">
                                    <span className="font-semibold">Mis Órdenes</span>
                                    <span className="text-xs text-default-500">Ver historial de compras</span>
                                </div>
                            </Button>

                            {isAdmin && (
                                <Button
                                    as={Link}
                                    to="/admin/dashboard"
                                    color="secondary"
                                    variant="flat"
                                    className="w-full justify-start h-14"
                                    startContent={<div className="p-2 bg-secondary/20 rounded-full"><FaUserShield /></div>}
                                >
                                    <div className="flex flex-col items-start ml-2">
                                        <span className="font-semibold">Panel Admin</span>
                                        <span className="text-xs text-default-500">Gestionar tienda</span>
                                    </div>
                                </Button>
                            )}
                        </CardBody>
                    </Card>
                </div>

            </div>
            <EditProfileModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                user={user}
                onSubmit={handleEditSubmit}
                isLoading={loading}
            />
        </div>
    );
};