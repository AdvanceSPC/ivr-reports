import { Download, Filter, LogOut, MessageCircle, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { exportToCSV } from '../lib/exportService';
import { fetchIVRData, type IVRFilters } from '../lib/ivrService';
import type { IVRRecord } from '../lib/types';
import { DataTable } from './DataTable';
import { FilterPanel } from './FilterPanel';

export function Dashboard() {
    const { user, logout } = useAuth();
    const [data, setData] = useState<IVRRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState<IVRFilters>({});

    useEffect(() => {
        loadData();
    }, [filters]);

    const loadData = async () => {
        setIsLoading(true);
        setError('');
        try {
            const records = await fetchIVRData(filters);
            setData(records);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar datos');
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = () => {
        const timestamp = new Date().toISOString().split('T')[0];
        exportToCSV(data, `reporte_ivr_${timestamp}.csv`);
    };

    const getChannelStats = () => {
        const stats = {
            llamadas: 0,
            whatsapp: 0,
            messenger: 0
        };

        data.forEach(record => {
            if (!record.ivrCanal) return;

            const canal = record.ivrCanal.toLowerCase().trim();

            if (canal.includes('call') || canal.includes('llamadas')){ 
                stats.llamadas++;
            } else if (canal.includes('whatsapp')) {
                stats.whatsapp++;
            } else if (canal.includes('facebook')) {
                stats.messenger++;
            }
        });

        return stats;
    };

    const stats = getChannelStats();

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Sistema de Reportes IVR</h1>
                            <p className="text-sm text-slate-600 mt-1">Bienvenido, {user?.usrName}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium"
                        >
                            <LogOut className="w-4 h-4" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        title="Llamadas"
                        value={stats.llamadas}
                        icon={<Phone className="w-6 h-6" />}
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="WhatsApp"
                        value={stats.whatsapp}
                        icon={<MessageCircle className="w-6 h-6" />}
                        color="bg-green-500"
                    />
                    <StatCard
                        title="Messenger"
                        value={stats.messenger}
                        icon={<MessageCircle className="w-6 h-6" />}
                        color="bg-slate-500"
                    />
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="p-6 border-b border-slate-200">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-3">
                                <Filter className="w-5 h-5 text-slate-600" />
                                <h2 className="text-lg font-semibold text-slate-900">Filtros y Exportación</h2>
                            </div>
                            <button
                                onClick={handleExport}
                                disabled={data.length === 0}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                            >
                                <Download className="w-4 h-4" />
                                Exportar CSV ({data.length})
                            </button>
                        </div>

                        <FilterPanel filters={filters} onFiltersChange={setFilters} />
                    </div>

                    <div className="p-6">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                                {error}
                            </div>
                        )}

                        <DataTable data={data} isLoading={isLoading} />
                    </div>
                </div>
            </main>
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-slate-900">{value.toLocaleString()}</p>
                </div>
                <div className={`${color} text-white p-3 rounded-lg`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
