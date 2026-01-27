import React, { useEffect, useState } from 'react';
import { Download, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import { getAllResponses } from '../services/firebase';
import { SurveyResponse } from '../types';
import { GlassCard } from './UIComponents';

interface AdminDashboardProps {
  onBack: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllResponses();
      setResponses(data);
      setError(null);
    } catch (err: any) {
      console.error("Admin Fetch Error:", err);
      setError(`Erro: ${err.message || "Erro desconhecido ao carregar dados."}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate Average NPS
  const averageNPS = responses.length > 0
    ? (responses.reduce((acc, curr) => acc + (curr.npsScore || 0), 0) / responses.length).toFixed(1)
    : '0.0';

  // Export to CSV
  const handleExportCSV = () => {
    if (responses.length === 0) return;

    const headers = [
      "Data", "NPS", "Motivo", "Professores", "Elogios",
      "Música", "Sugestão Musical", "Limpeza", "Serviços Conhecidos"
    ];

    const csvContent = [
      headers.join(","),
      ...responses.map(r => {
        const date = r.submittedAt?.seconds
          ? new Date(r.submittedAt.seconds * 1000).toLocaleString('pt-BR')
          : 'N/A';

        const ecosystem = r.ecosystem ? r.ecosystem.join(" | ") : "";
        const professors = r.evaluations?.map(e => e.professor).join(" | ") || r.professor || "";
        const compliments = r.evaluations?.map(e => `${e.professor}: ${e.compliment || ''}`).join(" | ") || "";

        return [
          `"${date}"`,
          r.npsScore,
          `"${(r.npsReason || '').replace(/"/g, '""')}"`,
          `"${professors}"`,
          `"${compliments.replace(/"/g, '""')}"`,
          `"${r.musicAtmosphere}"`,
          `"${(r.musicSuggestion || '').replace(/"/g, '""')}"`,
          r.cleanliness,
          `"${ecosystem}"`
        ].join(",");
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PLUR_NPS_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-live-green" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-24">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> Voltar
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchData}
            className="p-2 text-gray-400 hover:text-live-green transition-colors"
            title="Recarregar dados"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <h2 className="text-2xl font-serif font-bold text-live-green">Painel Administrativo</h2>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-xl mb-6 backdrop-blur-sm flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={fetchData}
            className="text-xs bg-red-500 px-2 py-1 rounded hover:bg-red-600 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="flex flex-col items-center justify-center py-6">
          <span className="text-gray-400 text-sm uppercase tracking-wider">Total de Respostas</span>
          <span className="text-4xl font-bold text-white mt-2">{responses.length}</span>
        </GlassCard>

        <GlassCard className="flex flex-col items-center justify-center py-6">
          <span className="text-gray-400 text-sm uppercase tracking-wider">NPS Médio</span>
          <span className={`text-4xl font-bold mt-2 ${Number(averageNPS) >= 9 ? 'text-live-green' : Number(averageNPS) >= 7 ? 'text-yellow-400' : 'text-red-500'}`}>
            {averageNPS}
          </span>
        </GlassCard>

        <GlassCard className="flex flex-col items-center justify-center py-6 cursor-pointer hover:bg-white/5 transition-colors" onClick={handleExportCSV}>
          <Download size={32} className="text-live-green mb-2" />
          <span className="text-live-green font-bold">Baixar Excel (CSV)</span>
        </GlassCard>
      </div>

      {/* Main Table */}
      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-black/30 text-xs uppercase font-medium text-gray-400">
              <tr>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Professor(es)</th>
                <th className="px-6 py-4 text-center">NPS</th>
                <th className="px-6 py-4">Motivo</th>
                <th className="px-6 py-4">Elogios</th>
                <th className="px-6 py-4 text-center">Limpeza</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {responses.map((row) => (
                <tr key={row.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {row.submittedAt?.seconds
                      ? new Date(row.submittedAt.seconds * 1000).toLocaleDateString('pt-BR')
                      : '-'}
                  </td>
                  <td className="px-6 py-4 font-medium text-white max-w-[150px] truncate">
                    {row.evaluations?.map(e => e.professor).join(", ") || row.professor || '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${(row.npsScore || 0) >= 9 ? 'bg-green-900/50 text-green-200' :
                        (row.npsScore || 0) >= 7 ? 'bg-yellow-900/50 text-yellow-200' :
                          'bg-red-900/50 text-red-200'}`}>
                      {row.npsScore}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate" title={row.npsReason}>
                    {row.npsReason || <span className="text-gray-600 italic">Sem comentário</span>}
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate" title={row.evaluations?.map(e => `${e.professor}: ${e.compliment}`).join("\n")}>
                    {row.evaluations?.map(e => e.compliment).filter(Boolean).join(" | ") || '-'}
                  </td>
                  <td className="px-6 py-4 text-center">{row.cleanliness}/5</td>
                </tr>
              ))}
              {responses.length === 0 && !error && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Nenhuma resposta coletada ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};