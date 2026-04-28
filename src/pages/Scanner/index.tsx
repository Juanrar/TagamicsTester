import React, { useState } from 'react';
import { Scanner as QrScanner } from '@yudiel/react-qr-scanner';
import {
    Box,
    Flex,
    Heading,
    Icon,
    Text,
    VStack,
} from '@chakra-ui/react';
import { Button } from '@/components/ui/button';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

type ScannerState = 'scanning' | 'success' | 'error';

const Scanner: React.FC = () => {
    const [state, setState] = useState<ScannerState>('scanning');
    const [qrValue, setQrValue] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleDecode = (result: string) => {
        setQrValue(result);
        setState('success');
    };

    const handleError = (error: unknown) => {
        const message =
            error instanceof Error
                ? error.message
                : 'No se pudo acceder a la cámara.';

        const isCameraPermission =
            message.toLowerCase().includes('permission') ||
            message.toLowerCase().includes('notallowed') ||
            message.toLowerCase().includes('denied');

        setErrorMessage(
            isCameraPermission
                ? 'Permiso de cámara denegado. Por favor, habilitá el acceso a la cámara en la configuración de tu navegador.'
                : `Error de cámara: ${message}`
        );
        setState('error');
    };

    const handleReset = () => {
        setQrValue('');
        setErrorMessage('');
        setState('scanning');
    };

    // ── Error state ──────────────────────────────────────────────────────────
    if (state === 'error') {
        return (
            <Flex
                align="center"
                direction="column"
                flex="1"
                justify="center"
                minH="calc(100vh - 80px)"
                px={4}
            >
                <Box
                    backdropFilter="blur(12px)"
                    bg="red.900"
                    borderColor="red.700"
                    borderRadius="2xl"
                    borderWidth="1px"
                    boxShadow="0 25px 50px -12px rgba(239, 68, 68, 0.3)"
                    maxW="420px"
                    p={8}
                    textAlign="center"
                    w="full"
                >
                    <VStack gap={4}>
                        <Icon as={ExclamationTriangleIcon} boxSize={14} color="red.300" />
                        <Heading color="red.200" fontSize="xl">
                            Error de cámara
                        </Heading>
                        <Text color="red.300" fontSize="sm">
                            {errorMessage}
                        </Text>
                        <Button
                            id="scanner-retry-btn"
                            bg="red.600"
                            color="white"
                            mt={2}
                            onClick={handleReset}
                            w="full"
                            _hover={{ bg: 'red.500' }}
                        >
                            Reintentar
                        </Button>
                    </VStack>
                </Box>
            </Flex>
        );
    }

    // ── Success state ────────────────────────────────────────────────────────
    if (state === 'success') {
        return (
            <Flex
                align="center"
                direction="column"
                flex="1"
                justify="center"
                minH="calc(100vh - 80px)"
                px={4}
            >
                <Box
                    backdropFilter="blur(12px)"
                    bg="whiteAlpha.50"
                    borderColor="green.500"
                    borderRadius="2xl"
                    borderWidth="1px"
                    boxShadow="0 25px 50px -12px rgba(74, 222, 128, 0.2)"
                    maxW="420px"
                    p={8}
                    textAlign="center"
                    w="full"
                >
                    <VStack gap={5}>
                        <Box
                            animation="pulse 2s infinite"
                            bg="green.900"
                            borderRadius="full"
                            p={4}
                        >
                            <Icon as={CheckCircleIcon} boxSize={12} color="green.400" />
                        </Box>

                        <VStack gap={1}>
                            <Heading color="white" fontSize="2xl">
                                ¡QR Leído!
                            </Heading>
                            <Text color="whiteAlpha.600" fontSize="sm">
                                Máquina identificada correctamente
                            </Text>
                        </VStack>

                        <Box
                            bg="whiteAlpha.100"
                            borderColor="whiteAlpha.200"
                            borderRadius="lg"
                            borderWidth="1px"
                            p={4}
                            w="full"
                        >
                            <Text color="whiteAlpha.500" fontSize="xs" mb={1}>
                                ID de máquina
                            </Text>
                            <Text
                                color="green.300"
                                fontFamily="mono"
                                fontSize="sm"
                                fontWeight="bold"
                                wordBreak="break-all"
                            >
                                {qrValue}
                            </Text>
                        </Box>

                        <Button
                            id="scanner-test-btn"
                            bg="green.500"
                            color="white"
                            disabled
                            size="lg"
                            title="Próximamente: integración con Mercado Pago"
                            w="full"
                            _disabled={{
                                opacity: 0.6,
                                cursor: 'not-allowed',
                            }}
                            _hover={{ bg: 'green.400' }}
                        >
                            🧪 Prueba de funcionamiento
                        </Button>

                        <Button
                            id="scanner-scan-again-btn"
                            color="whiteAlpha.700"
                            onClick={handleReset}
                            size="sm"
                            variant="ghost"
                            _hover={{ color: 'white' }}
                        >
                            Escanear otra máquina
                        </Button>
                    </VStack>
                </Box>
            </Flex>
        );
    }

    // ── Scanning state ───────────────────────────────────────────────────────
    return (
        <Flex
            align="center"
            direction="column"
            flex="1"
            gap={6}
            justify="center"
            minH="calc(100vh - 80px)"
            px={4}
            py={8}
        >
            <VStack gap={2} textAlign="center">
                <Heading color="white" fontSize="2xl">
                    Escanear máquina
                </Heading>
                <Text color="whiteAlpha.600" fontSize="sm">
                    Apuntá la cámara al código QR de la Tagamics
                </Text>
            </VStack>

            <Box
                borderColor="purple.500"
                borderRadius="2xl"
                borderWidth="3px"
                boxShadow="0 0 40px rgba(168, 85, 247, 0.4)"
                maxW="340px"
                overflow="hidden"
                position="relative"
                w="full"
            >
                {/* Animated corner decorators */}
                <Box
                    borderColor="purple.400"
                    borderLeftWidth="4px"
                    borderTopWidth="4px"
                    borderRadius="sm"
                    h="24px"
                    left="8px"
                    position="absolute"
                    top="8px"
                    w="24px"
                    zIndex={2}
                />
                <Box
                    borderColor="purple.400"
                    borderRightWidth="4px"
                    borderTopWidth="4px"
                    borderRadius="sm"
                    h="24px"
                    position="absolute"
                    right="8px"
                    top="8px"
                    w="24px"
                    zIndex={2}
                />
                <Box
                    borderBottomWidth="4px"
                    borderColor="purple.400"
                    borderLeftWidth="4px"
                    borderRadius="sm"
                    bottom="8px"
                    h="24px"
                    left="8px"
                    position="absolute"
                    w="24px"
                    zIndex={2}
                />
                <Box
                    borderBottomWidth="4px"
                    borderColor="purple.400"
                    borderRadius="sm"
                    borderRightWidth="4px"
                    bottom="8px"
                    h="24px"
                    position="absolute"
                    right="8px"
                    w="24px"
                    zIndex={2}
                />

                <QrScanner
                    onDecode={handleDecode}
                    onError={handleError}
                    scanDelay={500}
                    styles={{
                        container: { borderRadius: 0 },
                        video: { borderRadius: 0 },
                    }}
                />
            </Box>

            <Text color="whiteAlpha.400" fontSize="xs">
                Asegurate de tener buena iluminación y mantener el QR estable
            </Text>
        </Flex>
    );
};

export default Scanner;
