import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Flex, Spinner } from '@chakra-ui/react';
import Header from '@/components/Header';
import ProtectedRoute from '@/routes/ProtectedRoute';

// Lazy-loaded pages
const Login = lazy(() => import('@/pages/Login'));
const Scanner = lazy(() => import('@/pages/Scanner'));
const Result = lazy(() => import('@/pages/Result'));

const CenteredSpinner: React.FC = () => (
    <Flex align="center" height="100vh" justify="center" width="100vw">
        <Spinner boxSize="50px" color="primary" size="xl" />
    </Flex>
);

const AppRouter: React.FC = () => (
    <Flex direction="column" minH="100vh">
        <Header />
        <Flex as="main" direction="column" flex="1">
            <Suspense fallback={<CenteredSpinner />}>
                <Routes>
                    {/* Public */}
                    <Route element={<Login />} path="/login" />

                    {/* Protected */}
                    <Route
                        element={
                            <ProtectedRoute>
                                <Scanner />
                            </ProtectedRoute>
                        }
                        path="/scanner"
                    />
                    <Route
                        element={
                            <ProtectedRoute>
                                <Result />
                            </ProtectedRoute>
                        }
                        path="/result"
                    />

                    {/* Fallback */}
                    <Route element={<Navigate replace to="/scanner" />} path="*" />
                </Routes>
            </Suspense>
        </Flex>
    </Flex>
);

export default AppRouter;