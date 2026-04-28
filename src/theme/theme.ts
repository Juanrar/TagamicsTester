import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
    globalCss: {
        'html, body': {
            boxSizing: 'border-box',
            margin: 0,
            padding: 0,
        },
    },
    theme: {
        tokens: {
            fonts: {
                body: { value: 'Nunito, sans-serif' },
            },
        },
        semanticTokens: {
            colors: {
                primary: {
                    value: '#9f7aea',
                    description: 'Main color for the theme',
                },
                primaryDark: {
                    value: '#581c87',
                    description: 'Darker main color for the theme',
                },
                primaryActive: {
                    value: '#9333ea',
                    description: 'Main color for active elements',
                },
                primaryShadow: {
                    value: '#a855f780',
                    description: 'Main color for shadows',
                },

                btnPrimary: {
                    value: '#2d3748',
                    description: 'Main color for primary buttons',
                },
                btnPrimaryHover: {
                    value: '#4a5568',
                    description: 'Hover color for primary buttons',
                },

                // Payment Methods Button
                btnPayment: {
                    value: '#1f2937',
                    description: 'Main color for payment method buttons',
                },
                btnPaymentHover: {
                    value: '#374151',
                    description: 'Hover color for payment method buttons',
                },
                btnPaymentBorder: {
                    value: '#374151',
                    description: 'Border color for payment method buttons',
                },

                // Pay Button
                btnSubmit: {
                    value: '#65e87b',
                    description: 'Main color for submit buttons',
                },
                btnSubmitHover: {
                    value: '#8cf2a2',
                    description: 'Hover color for submit buttons',
                },
                btnSubmitShadow: {
                    value: '#4ade804d',
                    description: 'Border color for submit buttons',
                },

                text: { value: 'white' },
                subText: { value: '#94a3b8' },
            },
        },
    },
});

export const system = createSystem(defaultConfig, config);
