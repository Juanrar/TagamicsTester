import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Flex,
    Heading,
    Input,
    Text,
    VStack,
} from '@chakra-ui/react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { toaster } from '@/components/ui/toaster';
import api from '@/services/api';
import { AxiosError } from 'axios';

interface LoginFormData {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>();

    const onSubmit = async (data: LoginFormData) => {
        try {
            const response = await api.post('/operator-login', data);
            
            // Suponiendo que el token viene en response.data.token o similar
            // Basado en experiencias comunes con Magneticash
            const token = response.data.token || response.data.access_token || 'dummy-token';
            
            localStorage.setItem('authToken', token);
            
            toaster.create({
                title: '¡Bienvenido!',
                description: 'Ingreso exitoso',
                type: 'success',
            });
            
            navigate('/scanner');
        } catch (error) {
            const axiosError = error as AxiosError<{ message?: string }>;
            const message = axiosError.response?.data?.message || 'Credenciales inválidas o error de conexión';
            
            toaster.create({
                title: 'Error al ingresar',
                description: message,
                type: 'error',
            });
        }
    };

    return (
        <Flex
            align="center"
            bgGradient="to-b"
            gradientFrom="gray.900"
            gradientTo="purple.950"
            flex="1"
            justify="center"
            minH="calc(100vh - 80px)"
            px={4}
        >
            <Box
                backdropFilter="blur(12px)"
                bg="whiteAlpha.50"
                borderColor="whiteAlpha.100"
                borderRadius="2xl"
                borderWidth="1px"
                boxShadow="0 25px 50px -12px rgba(168, 85, 247, 0.25)"
                maxW="400px"
                p={8}
                w="full"
            >
                {/* Logo / título */}
                <VStack gap={2} mb={8}>
                    <Box
                        bg="purple.500"
                        borderRadius="xl"
                        mb={2}
                        p={3}
                    >
                        <Text fontSize="2xl">🔐</Text>
                    </Box>
                    <Heading
                        color="white"
                        fontSize="2xl"
                        fontWeight="bold"
                        textAlign="center"
                    >
                        Tagamics Tester
                    </Heading>
                    <Text color="whiteAlpha.600" fontSize="sm" textAlign="center">
                        Ingresá tus credenciales para continuar
                    </Text>
                </VStack>

                <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
                    <VStack gap={5}>
                        <Field
                            errorText={errors.email?.message}
                            invalid={!!errors.email}
                            label="Correo Electrónico"
                        >
                            <Input
                                id="login-email"
                                autoComplete="email"
                                borderColor="whiteAlpha.200"
                                color="white"
                                placeholder="tu@email.com"
                                type="email"
                                _placeholder={{ color: 'whiteAlpha.400' }}
                                _focus={{
                                    borderColor: 'purple.400',
                                    boxShadow: '0 0 0 1px var(--chakra-colors-purple-400)',
                                }}
                                {...register('email', {
                                    required: 'El email es obligatorio',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Email inválido',
                                    },
                                })}
                            />
                        </Field>

                        <Field
                            errorText={errors.password?.message}
                            invalid={!!errors.password}
                            label="Contraseña"
                        >
                            <Input
                                id="login-password"
                                autoComplete="current-password"
                                borderColor="whiteAlpha.200"
                                color="white"
                                placeholder="••••••••"
                                type="password"
                                _placeholder={{ color: 'whiteAlpha.400' }}
                                _focus={{
                                    borderColor: 'purple.400',
                                    boxShadow: '0 0 0 1px var(--chakra-colors-purple-400)',
                                }}
                                {...register('password', {
                                    required: 'La contraseña es obligatoria',
                                    minLength: {
                                        value: 4,
                                        message: 'Mínimo 4 caracteres',
                                    },
                                })}
                            />
                        </Field>

                        <Button
                            id="login-submit"
                            bg="purple.500"
                            color="white"
                            form="login-form"
                            loading={isSubmitting}
                            loadingText="Ingresando..."
                            mt={2}
                            size="lg"
                            type="submit"
                            w="full"
                            _hover={{ bg: 'purple.400', transform: 'translateY(-1px)' }}
                            _active={{ transform: 'translateY(0)' }}
                            transition="all 0.2s"
                        >
                            Ingresar
                        </Button>
                    </VStack>
                </form>
            </Box>
        </Flex>
    );
};

export default Login;
