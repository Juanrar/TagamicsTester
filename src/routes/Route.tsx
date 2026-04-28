import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Flex, Spinner } from '@chakra-ui/react';

// Lazy loading de las vistas
const Login = lazy(() => import('@/pages/Login'));
const Scanner = lazy(() => import('@/pages/Scanner'));
const Result = lazy(() => import('@/pages/Result'));

const CenteredSpinner = () => (
    <Flex align="center" height="100vh" justify="center" width="100vw">
        <Spinner boxSize="50px" color="primary" size="xl" />
    </Flex>
);

// Un componente rápido para proteger rutas
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    // Aquí validarías tu token o estado de sesión (idealmente desde un AuthContext)
    const isAuthenticated = localStorage.getItem('authToken') !== null;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const AppRouter: React.FC = () => (
    <Suspense fallback={<CenteredSpinner />}>
        <Routes>
            {/* Ruta Pública */}
            <Route path="/login" element={<Login />} />

            {/* Rutas Privadas */}
            <Route path="/scanner" element={
                <ProtectedRoute>
                    <Scanner />
                </ProtectedRoute>
            } />
            <Route path="/result" element={
                <ProtectedRoute>
                    <Result />
                </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/scanner" replace />} />
        </Routes>
    </Suspense>
);

export default AppRouter;