import api from './api';
import type { Tagamic } from '@/models/tagamic.model';

export const getTagamic = async (params: { id: string }) => {
    return api.get<{ tagamic: Tagamic }>(`tags/tagamics/${params.id}/activate`);
};
