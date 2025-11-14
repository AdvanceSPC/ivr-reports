import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { IVRRecord } from '../lib/types';

interface DataTableProps {
    data: IVRRecord[];
    isLoading: boolean;
}

export function DataTable({ data, isLoading }: DataTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const rowsPerPage = 25;

    const filteredData = useMemo(() => {
        if (!searchQuery.trim()) return data;
        const query = searchQuery.toLowerCase();
        return data.filter((record) =>
            [
                record.ivrCanal,
                record.ivrUserId,
                record.ivrIdentificacion,
                record.ivrMenu,
                record.ivrSubMenu,
                record.ivrSubMenu3,
                record.ivrInteractionId,
            ]
                .filter(Boolean)
                .some((field) => String(field).toLowerCase().includes(query))
        );
    }, [data, searchQuery]);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const currentData = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return filteredData.slice(start, start + rowsPerPage);
    }, [filteredData, currentPage]);

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-slate-900"></div>
                <p className="mt-4 text-slate-600">Cargando datos...</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-600 text-lg">No se encontraron registros</p>
                <p className="text-slate-500 text-sm mt-2">Intenta ajustar los filtros de búsqueda</p>
            </div>
        );
    }

    return (
        <div>
            {/* Barra de búsqueda */}
            <div className="flex items-center gap-3 mb-6 bg-white border border-slate-200 rounded-lg px-4 py-2 shadow-sm">
                <Search className="w-5 h-5 text-slate-500" />
                <input
                    type="text"
                    placeholder="Buscar por canal, cliente, menú o ID..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder-slate-400"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            {[
                                'Fecha/Hora Inicio',
                                'Fecha/Hora Fin',
                                'Identificador Canal',
                                'Identificación Cliente',
                                'Menú Principal',
                                'Sub Menú',
                                'Sub Menú 2',
                                'Canal',
                                'Id Interacción',
                            ].map((header) => (
                                <th
                                    key={header}
                                    className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {currentData.map((record) => (
                            <tr key={record.id} className="hover:bg-slate-50 transition">
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900">
                                    {formatDateTime(record.ivrDateStart)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900">
                                    {record.ivrDateEnd ? formatDateTime(record.ivrDateEnd) : '-'}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900">
                                    {record.ivrUserId || '-'}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900">
                                    {record.ivrIdentificacion || '-'}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900">
                                    {record.ivrMenu || '-'}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900">
                                    {record.ivrSubMenu || '-'}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900">
                                    {record.ivrSubMenu3 || '-'}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <CanalBadge canal={record.ivrCanal} />
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <StatusBadge status={record.ivrInteractionId} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginador */}
            <div className="flex items-center justify-between mt-6 px-4">
                <p className="text-sm text-slate-600">
                    Mostrando {currentData.length} de {filteredData.length} registros (total: {data.length})
                </p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-lg border border-slate-300 text-slate-700 text-sm disabled:opacity-50 hover:bg-slate-100 transition"
                    >
                        Anterior
                    </button>
                    <span className="text-sm text-slate-600">
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-lg border border-slate-300 text-slate-700 text-sm disabled:opacity-50 hover:bg-slate-100 transition"
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
}

function CanalBadge({ canal }: { canal?: string | null }) {
    const canalLower = canal?.toLowerCase() || '';
    let color = 'bg-slate-400';
    let label = canal || 'Desconocido';

    if (canalLower.includes('call')) {
        color = 'bg-blue-500';
        label = 'Llamadas';
    } else if (canalLower.includes('whatsapp')) {
        color = 'bg-green-500';
        label = 'WhatsApp';
    } else if (canalLower.includes('facebook')) {
        color = 'bg-purple-500';
        label = 'Facebook';
    }

    return (
        <span className={`inline-block px-2 py-1 text-xs font-medium text-white rounded ${color}`}>
            {label}
        </span>
    );
}

function StatusBadge({ status }: { status: string | null }) {
    if (!status) return <span className="text-sm text-slate-400">-</span>;

    const colors: Record<string, string> = {
        completado: 'bg-green-100 text-green-800',
        pendiente: 'bg-yellow-100 text-yellow-800',
        fallido: 'bg-red-100 text-red-800',
        default: 'bg-slate-100 text-slate-800',
    };

    const statusLower = status.toLowerCase();
    const colorClass = colors[statusLower] || colors.default;

    return (
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            {status}
        </span>
    );
}

function formatDateTime(dateStr: string | null): string {
    if (!dateStr || typeof dateStr !== "string") return "-";

    if (dateStr.startsWith("0000") || dateStr.includes("null")) return "-";

    const parts = dateStr.split(" ");

    if (parts.length < 2) return "-";

    const [datePart, timePart] = parts;

    const [year, month, day] = datePart.split("-");
    const [hour, minute, second] = timePart.split(":");

    if (!year || !month || !day || !hour || !minute || !second) {
        return "-";
    }

    const date = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second)
    );

    return date.toLocaleString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}

