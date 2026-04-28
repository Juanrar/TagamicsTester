import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Scanner as QrScanner } from '@yudiel/react-qr-scanner';
import mpLogo from '@/assets/mp-logo.svg';
import modoLogo from '@/assets/modo-text.svg';
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
import type { TagamicResponseData } from '@/models/tagamic.model';

type ScannerState = 'scanning' | 'success' | 'error';

const Scanner: React.FC = () => {
    const { t } = useTranslation();
    const [state, setState] = useState<ScannerState>('scanning');
    const [qrValue, setQrValue] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [machineData, setMachineData] = useState<TagamicResponseData | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(false);

    const activePriceSets = useMemo(() => {
        return machineData?.tagamic?.price_sets?.filter(ps => ps.is_active) || [];
    }, [machineData]);

    const fetchMachineDetails = async (machineId: string) => {
        setIsLoadingData(true);
        try {
            const response = await getTagamic({ id: machineId });
            setMachineData(response.data.data);
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
                minH="calc(100vh - 80px)"
                px={6}
                py={8}
                w="full"
                maxW="400px"
                mx="auto"
            >
                {/* Header with Terminal Name and Connection Status */}
                <Flex justify="space-between" align="center" w="full" mb={10}>
                    <Box w="12px" /> {/* Spacer for centering */}
                    <Heading color="white" fontSize="4xl" fontWeight="extrabold" textAlign="center" letterSpacing="tight">
                        {machineData?.tagamic?.terminal?.name || 'Máquina'}
                    </Heading>
                    <Flex align="center" justify="flex-end" w="12px">
                        <Box
                            boxSize="8px"
                            borderRadius="full"
                            bg={machineData?.tagamic?.connected ? 'green.400' : 'red.400'}
                            boxShadow={machineData?.tagamic?.connected ? '0 0 10px rgba(74, 222, 128, 0.8)' : '0 0 10px rgba(248, 113, 113, 0.8)'}
                            animation={machineData?.tagamic?.connected ? 'pulse 2s infinite' : undefined}
                            title={machineData?.tagamic?.connected ? 'Online' : 'Offline'}
                        />
                    </Flex>
                </Flex>

                {/* Step 1: Game Mode */}
                {activePriceSets.length > 0 && (
                    <Box w="full" mb={10}>
                        <Text color="cyan.600" fontSize="sm" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" mb={4}>
                            1. CHOOSE A GAME MODE
                        </Text>
                        <VStack gap={4} align="stretch">
                            {activePriceSets.map((ps, index) => (
                                <Flex
                                    key={index}
                                    direction="column"
                                    align="center"
                                    justify="center"
                                    bg="#8b3dff"
                                    p={5}
                                    borderRadius="xl"
                                    boxShadow="0 8px 32px rgba(139, 61, 255, 0.4)"
                                    cursor="pointer"
                                    transition="all 0.2s"
                                    _hover={{ transform: 'scale(1.02)' }}
                                    _active={{ transform: 'scale(0.98)' }}
                                >
                                    <Text color="white" fontSize="3xl" fontWeight="900" fontVariantNumeric="tabular-nums" lineHeight="1">
                                        ${ps.price}
                                    </Text>
                                    <Text color="whiteAlpha.900" fontSize="md" mt={1}>
                                        {ps.text}
                                    </Text>
                                </Flex>
                            ))}
                        </VStack>
                    </Box>
                )}

                {/* Step 2: Payment Methods */}
                {machineData?.payment_methods && machineData.payment_methods.length > 0 && (
                    <Box w="full" mb={8}>
                        <Text color="cyan.600" fontSize="sm" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" mb={4}>
                            2. CHOOSE YOUR PAYMENT METHOD
                        </Text>
                        <VStack gap={4} align="stretch">
                            {machineData.payment_methods.map(pm => {
                                let LogoComponent = null;
                                if (pm.id === 'modo_online') {
                                    LogoComponent = <img src={modoLogo} alt="MODO" style={{ height: '24px' }} />;
                                } else if (pm.id === 'mercadopago_checkout_pro') {
                                    LogoComponent = <img src={mpLogo} alt="Mercado Pago" style={{ height: '24px' }} />;
                                } else {
                                    LogoComponent = <Text color="white" fontWeight="bold">{pm.name}</Text>;
                                }

                                return (
                                    <Flex
                                        key={pm.id}
                                        align="center"
                                        justify="center"
                                        bg="#212833"
                                        p={5}
                                        borderRadius="xl"
                                        borderWidth="1px"
                                        borderColor="whiteAlpha.50"
                                        cursor="pointer"
                                        transition="all 0.2s"
                                        onClick={() => console.log('Iniciando pago con:', pm.id)}
                                        _hover={{ bg: '#2a3341' }}
                                        _active={{ transform: 'scale(0.98)' }}
                                    >
                                        {LogoComponent}
                                    </Flex>
                                );
                            })}
                        </VStack>
                    </Box>
                )}

                <Button
                    id="scanner-scan-again-btn"
                    aria-label="Escanear otro código QR"
                    color="whiteAlpha.600"
                    onClick={handleReset}
                    size="sm"
                    variant="ghost"
                    w="full"
                    mt="auto"
                    _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
                >
                    {t('scanner.scanAgain')}
                </Button>
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
