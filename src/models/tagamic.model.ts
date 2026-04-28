export type Tagamic = {
    id: string | number;
    terminal: {
        name: string;
    };
    store: {
        name: string;
    };
    player?: {
        name: string;
    };
    connected: boolean;
    active: boolean;
    price_sets: Array<{
        text: string | null;
        price: number | string | null;
        pulse_quantity: number | null;
        is_active: boolean;
    }>;
}

export type PaymentMethod = {
    id: string;
    name: string;
    description: string;
}

export type TagamicResponseData = {
    tagamic: Tagamic;
    payment_methods: PaymentMethod[];
}
