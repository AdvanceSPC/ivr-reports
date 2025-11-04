import type { IVRRecord } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface IVRFilters {
    startDate?: string;
    endDate?: string;
    canal?: string;
}

export async function fetchIVRData(filters: IVRFilters = {}): Promise<IVRRecord[]> {
    const params = new URLSearchParams();
    
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.canal) params.append('canal', filters.canal);

    const response = await fetch(`${API_URL}/api/ivr/data?${params.toString()}`);

    if (!response.ok) {
        throw new Error('Error al cargar datos');
    }

    return response.json();
}