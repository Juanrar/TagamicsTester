import { Flex, Image } from '@chakra-ui/react';
import React from 'react';

const { height } = window.screen;

const Header: React.FC = () => {
    return (
        <Flex
            alignItems={'center'}
            bgColor={'primaryDark'}
            height={height > 900 ? '80px' : '60px'}
            justifyContent={'center'}
            padding={3}
            w="full"
        >
            <Image alt="Tagamics" height={'100%'} src="/logo.png" />
        </Flex>
    );
};

export default Header;
