import { Calendar } from 'lucide-react';
import type { IVRFilters } from '../lib/ivrService';

interface FilterPanelProps {
    filters: IVRFilters;
    onFiltersChange: (filters: IVRFilters) => void;
}

export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
    const handleStartDateChange = (value: string) => {
        const updatedFilters = { ...filters, startDate: value || undefined };
        onFiltersChange(updatedFilters);
    };

    const handleEndDateChange = (value: string) => {
        const updatedFilters = { ...filters, endDate: value || undefined };
        onFiltersChange(updatedFilters);
    };



    const handleCanalChange = (value: string) => {
        onFiltersChange({ ...filters, canal: value });
    };

    const clearFilters = () => {
        onFiltersChange({});
    };

    const hasActiveFilters = filters.startDate || filters.endDate || (filters.canal && filters.canal !== 'todos');

    return (
        <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Fecha Inicio
                    </label>
                    <input
                        type="date"
                        id="startDate"
                        value={filters.startDate || ''}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                    />
                </div>

                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Fecha Fin
                    </label>
                    <input
                        type="date"
                        id="endDate"
                        value={filters.endDate || ''}
                        onChange={(e) => handleEndDateChange(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                    />
                </div>

                <div>
                    <label htmlFor="canal" className="block text-sm font-medium text-slate-700 mb-2">
                        Canal
                    </label>
                    <select
                        id="canal"
                        value={filters.canal || 'todos'}
                        onChange={(e) => handleCanalChange(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none bg-white"
                    >
                        <option value="todos">Todos los canales</option>
                        <option value="llamadas">Llamadas</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="messenger">Messenger</option>
                    </select>
                </div>
            </div>

            {hasActiveFilters && (
                <div className="flex justify-end">
                    <button
                        onClick={clearFilters}
                        className="text-sm text-slate-600 hover:text-slate-900 font-medium"
                    >
                        Limpiar filtros
                    </button>
                </div>
            )}
        </div>
    );
}
