import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Scanner as QrScanner } from '@yudiel/react-qr-scanner';
import {
    Badge,
    Box,
    Flex,
    Heading,
    Icon,
    Spinner,
    Text,
    VStack,
} from '@chakra-ui/react';
import { Button } from '@/components/ui/button';
import { toaster } from '@/components/ui/toaster';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { getTagamic } from '@/services/tagamics.service';
import type { Tagamic } from '@/models/tagamic.model';

type ScannerState = 'scanning' | 'success' | 'error';

const Scanner: React.FC = () => {
    const { t } = useTranslation();
    const [state, setState] = useState<ScannerState>('scanning');
    const [qrValue, setQrValue] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [machineData, setMachineData] = useState<Tagamic | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(false);

    const activePriceSets = useMemo(() => {
        return machineData?.price_sets?.filter(ps => ps.is_active) || [];
    }, [machineData]);

    const fetchMachineDetails = async (machineId: string) => {
        setIsLoadingData(true);
        try {
            const response = await getTagamic({ id: machineId });
            setMachineData(response.data.tagamic);
            setState('success');
        } catch (error) {
            toaster.create({
                title: 'Error',
                description: 'No se pudo cargar la información de la máquina',
                type: 'error',
            });
            setErrorMessage('No se pudo cargar la información de la máquina');
            setState('error');
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleDecode = (result: string) => {
        try {
            let machineId: string | null = null;

            if (result.startsWith('http')) {
                const scannedUrl = new URL(result);
                machineId = scannedUrl.searchParams.get('id');
            } else {
                // Si no es URL, asumimos que el resultado es el ID directo
                machineId = result;
            }

            if (machineId) {
                console.log('ID Extraído:', machineId);
                setQrValue(machineId);
                fetchMachineDetails(machineId);
            } else {
                throw new Error('QR sin ID');
            }
        } catch (error) {
            console.error('Error al decodificar QR:', error);
            setErrorMessage(t('scanner.errorTitle') + ': QR inválido');
            setState('error');
        }
    };

    const handleError = (error: unknown) => {
        const message =
            error instanceof Error
                ? error.message
                : t('scanner.errorTitle');

        const isCameraPermission =
            message.toLowerCase().includes('permission') ||
            message.toLowerCase().includes('notallowed') ||
            message.toLowerCase().includes('denied');

        setErrorMessage(
            isCameraPermission
                ? t('scanner.permissionError')
                : `${t('scanner.errorTitle')}: ${message}`
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
                            {t('scanner.errorTitle')}
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
                            {t('scanner.retry')}
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
                    backdropFilter="blur(16px)"
                    bg="whiteAlpha.100"
                    borderColor="whiteAlpha.200"
                    borderRadius="2xl"
                    borderWidth="1px"
                    boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                    maxW="420px"
                    p={8}
                    w="full"
                >
                    <VStack gap={6} align="stretch">
                        <Flex justify="space-between" align="center">
                            <Box
                                animation="pulse 2s infinite"
                                bg="green.900"
                                borderRadius="full"
                                p={3}
                            >
                                <Icon as={CheckCircleIcon} boxSize={8} color="green.400" />
                            </Box>
                            <Badge colorPalette={machineData?.connected ? 'green' : 'red'} variant="subtle" size="lg">
                                {machineData?.connected ? 'Conectado' : 'Desconectado'}
                            </Badge>
                        </Flex>

                        <VStack gap={1} align="flex-start">
                            <Heading color="white" fontSize="2xl" truncate w="full">
                                {machineData?.terminal?.name || 'Máquina desconocida'}
                            </Heading>
                            <Text color="whiteAlpha.600" fontSize="sm" truncate w="full">
                                {machineData?.store?.name || 'Ubicación no registrada'}
                            </Text>
                        </VStack>

                        <Flex justify="space-between" align="center" bg="whiteAlpha.50" p={3} borderRadius="md" borderWidth="1px" borderColor="whiteAlpha.100">
                            <Text color="whiteAlpha.700" fontSize="sm">Estado de Activación</Text>
                            <Badge colorPalette={machineData?.active ? 'green' : 'red'} size="sm">
                                {machineData?.active ? 'Activo' : 'Inactivo'}
                            </Badge>
                        </Flex>

                        {activePriceSets.length > 0 && (
                            <VStack align="stretch" gap={3}>
                                <Text color="whiteAlpha.500" fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider">
                                    Precios Configurados
                                </Text>
                                <VStack gap={2} align="stretch">
                                    {activePriceSets.map((ps, index) => (
                                        <Flex key={index} justify="space-between" align="center" bg="whiteAlpha.50" p={3} borderRadius="lg" borderWidth="1px" borderColor="whiteAlpha.100" transition="all 0.2s" _hover={{ bg: 'whiteAlpha.100' }}>
                                            <Text color="whiteAlpha.900" fontSize="sm" fontWeight="medium">{ps.text}</Text>
                                            <Text color="purple.300" fontWeight="bold" fontVariantNumeric="tabular-nums">{ps.price}</Text>
                                        </Flex>
                                    ))}
                                </VStack>
                            </VStack>
                        )}

                        <VStack gap={3} pt={2}>
                            <Button
                                id="scanner-test-btn"
                                aria-label="Iniciar prueba de funcionamiento"
                                bg="purple.500"
                                color="white"
                                size="lg"
                                w="full"
                                onClick={() => console.log('Iniciando prueba de MP para:', qrValue)}
                                _hover={{ bg: 'purple.400', transform: 'translateY(-1px)' }}
                                _active={{ bg: 'purple.600', transform: 'translateY(0)' }}
                                transition="all 0.2s"
                            >
                                Prueba de funcionamiento
                            </Button>

                            <Button
                                id="scanner-scan-again-btn"
                                aria-label="Escanear otro código QR"
                                color="whiteAlpha.700"
                                onClick={handleReset}
                                size="sm"
                                variant="ghost"
                                w="full"
                                _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
                            >
                                {t('scanner.scanAgain')}
                            </Button>
                        </VStack>
                    </VStack>
                </Box>
            </Flex>
        );
    }

    // ── Scanning state ───────────────────────────────────────────────────────
    if (isLoadingData) {
        return (
            <Flex
                align="center"
                direction="column"
                flex="1"
                justify="center"
                minH="calc(100vh - 80px)"
                px={4}
            >
                <VStack gap={4}>
                    <Spinner size="xl" color="purple.400" />
                    <Text color="whiteAlpha.800">Obteniendo datos de la máquina...</Text>
                </VStack>
            </Flex>
        );
    }

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
                    {t('scanner.title')}
                </Heading>
                <Text color="whiteAlpha.600" fontSize="sm">
                    {t('scanner.subtitle')}
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
                    onScan={(result) => {
                        if (result.length > 0) {
                            handleDecode(result[0].rawValue);
                        }
                    }}
                    onError={handleError}
                    constraints={{
                        facingMode: 'environment'
                    }}
                />
            </Box>



            <Text color="whiteAlpha.400" fontSize="xs">
                {t('scanner.footer')}
            </Text>
        </Flex>
    );
};

export default Scanner;
