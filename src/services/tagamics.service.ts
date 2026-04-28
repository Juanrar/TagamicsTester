import api from './api';
import type { TagamicResponseData } from '@/models/tagamic.model';

export type APIResponse = {
    status: string;
    code: number;
    message: string;
    data: TagamicResponseData;
};

export const getTagamic = async (params: { id: string }) => {
    return api.get<APIResponse>(`tags/tagamics/${params.id}/activate`);
};
