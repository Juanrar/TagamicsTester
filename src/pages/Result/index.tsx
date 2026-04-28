import React from 'react';
import { Flex, Heading, Text, VStack } from '@chakra-ui/react';

const Result: React.FC = () => {
    return (
        <Flex
            align="center"
            direction="column"
            flex="1"
            justify="center"
            minH="calc(100vh - 80px)"
            px={4}
        >
            <VStack gap={3} textAlign="center">
                <Heading color="white" fontSize="2xl">
                    Resultado
                </Heading>
                <Text color="whiteAlpha.600" fontSize="sm">
                    Aquí se mostrará la respuesta JSON de Mercado Pago.
                </Text>
            </VStack>
        </Flex>
    );
};

export default Result;
