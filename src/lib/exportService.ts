import type { IVRRecord } from './types';

export function exportToCSV(data: IVRRecord[], filename: string = 'reporte_ivr.csv') {
    if (data.length === 0) {
        alert('No hay datos para exportar');
        return;
    }

    const headers = [
        'No.',
        'Fecha/Hora Inicio',
        'Fecha/Hora Fin',
        'Identificador Canal',
        'Identificación Cliente',
        'Menú Principal',
        'SubMenu',
        'Submenu 2',
        'Canal',
        'Id Interacción'
    ];

    const csvRows = [
        headers.join(','),
        ...data.map(row => [ row.id,
            formatDateTime(row.ivrDateStart),
            formatDateTime(row.ivrDateEnd),
            escapeCSV(String(row.ivrUserId)),
            escapeCSV(String(row.ivrIdentificacion)),
            escapeCSV(row.ivrMenu || " "),
            escapeCSV(row.ivrSubMenu || " "),
            escapeCSV(row.ivrSubMenu3 || " "),
            escapeCSV(String(row.ivrCanal)),
            escapeCSV(String(row.ivrInteractionId))
        ].join(',')) ];

    const csvContent = csvRows.join('\n');
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

function escapeCSV(str: string): string {
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

function formatDateTime(dateStr: string | null | undefined): string {
    if (!dateStr) return '-';

    try {
        const dateStrLocal = dateStr.replace('Z', '');
        const date = new Date(dateStrLocal);

        if (isNaN(date.getTime())) return '-';

        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    } catch (error) {
        return '-';
    }
}
