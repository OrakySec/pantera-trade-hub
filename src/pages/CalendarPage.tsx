
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Calendar, Clock, ArrowUpRight } from 'lucide-react';

const CalendarPage = () => {
  // Dados simulados para o calendário econômico
  const economicEvents = [
    {
      id: 1,
      date: '2025-04-17T14:30:00Z',
      country: 'EUA',
      event: 'Pedidos de auxílio-desemprego',
      impact: 'medium',
      previous: '236K',
      forecast: '230K',
      actual: '232K',
    },
    {
      id: 2,
      date: '2025-04-17T15:00:00Z',
      country: 'EUR',
      event: 'Índice de Preços ao Consumidor (IPC)',
      impact: 'high',
      previous: '2.4%',
      forecast: '2.5%',
      actual: '2.6%',
    },
    {
      id: 3,
      date: '2025-04-18T12:30:00Z',
      country: 'GBR',
      event: 'Vendas no Varejo',
      impact: 'medium',
      previous: '0.3%',
      forecast: '0.4%',
      actual: '-',
    },
    {
      id: 4,
      date: '2025-04-18T13:45:00Z',
      country: 'USA',
      event: 'Discurso do Presidente do Fed',
      impact: 'high',
      previous: '-',
      forecast: '-',
      actual: '-',
    },
    {
      id: 5,
      date: '2025-04-19T01:30:00Z',
      country: 'JPY',
      event: 'Taxa de Inflação',
      impact: 'high',
      previous: '2.8%',
      forecast: '2.7%',
      actual: '-',
    },
  ];

  const getImpactClass = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-trader-red';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-trader-green';
      default:
        return 'bg-gray-500';
    }
  };

  const formatEventTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="bg-trader-dark border border-gray-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h3 className="text-white font-medium flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Calendário Econômico
            </h3>
            
            <div className="flex gap-4 text-sm">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-trader-red mr-2"></span>
                <span className="text-gray-400">Alto Impacto</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                <span className="text-gray-400">Médio Impacto</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-trader-green mr-2"></span>
                <span className="text-gray-400">Baixo Impacto</span>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-trader-darker">
                  <th className="py-3 px-4 text-left text-xs text-gray-400 font-medium">Horário</th>
                  <th className="py-3 px-4 text-left text-xs text-gray-400 font-medium">País</th>
                  <th className="py-3 px-4 text-left text-xs text-gray-400 font-medium">Evento</th>
                  <th className="py-3 px-4 text-left text-xs text-gray-400 font-medium">Anterior</th>
                  <th className="py-3 px-4 text-left text-xs text-gray-400 font-medium">Previsão</th>
                  <th className="py-3 px-4 text-left text-xs text-gray-400 font-medium">Atual</th>
                </tr>
              </thead>
              <tbody>
                {economicEvents.map((event) => (
                  <tr key={event.id} className="border-t border-gray-800">
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-white text-sm">{formatEventTime(event.date)}</span>
                        <span className="text-gray-400 text-xs">{formatEventDate(event.date)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center">
                        <span className={`w-4 h-4 mr-2 rounded-full ${getImpactClass(event.impact)}`}></span>
                        <span className="text-white">{event.country}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-white flex items-center">
                        {event.event}
                        <ArrowUpRight className="h-4 w-4 ml-1 text-gray-400" />
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{event.previous}</td>
                    <td className="py-3 px-4 text-gray-400">{event.forecast}</td>
                    <td className="py-3 px-4">
                      {event.actual !== '-' ? (
                        <span className="text-trader-green">{event.actual}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CalendarPage;
