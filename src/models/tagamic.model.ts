export type Tagamic = {
    id: string;
    terminal: {
        name: string;
    };
    store: {
        name: string;
    };
    connected: boolean;
    active: boolean;
    price_sets: Array<{
        text: string;
        price: string;
        is_active: boolean;
    }>;
}
