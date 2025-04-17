
import React, { useEffect, useRef, useState } from 'react';
import { useTradingContext } from '@/contexts/TradingContext';
import { formatNumber } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface DataPoint {
  time: string;
  price: number;
}

const TradingChart: React.FC = () => {
  const { assetPrice, selectedAsset, selectedTimeframe } = useTradingContext();
  const [data, setData] = useState<DataPoint[]>([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const maxPoints = 100;

  useEffect(() => {
    // Adicionar um novo ponto a cada X segundos
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    
    setData(prevData => {
      const newData = [...prevData, { time: timeStr, price: assetPrice }];
      
      // Manter apenas os últimos N pontos
      if (newData.length > maxPoints) {
        return newData.slice(newData.length - maxPoints);
      }
      
      return newData;
    });
    
    setLastUpdate(Date.now());
  }, [assetPrice]);

  // Inicializar dados
  useEffect(() => {
    // Reset chart data when asset changes
    const initialData: DataPoint[] = [];
    const now = Date.now();
    
    for (let i = 0; i < 20; i++) {
      const time = new Date(now - (20 - i) * 1000);
      initialData.push({
        time: time.toLocaleTimeString(),
        price: assetPrice * (1 + (Math.random() - 0.5) * 0.01),
      });
    }
    
    setData(initialData);
  }, [selectedAsset]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-trader-card p-2 rounded border border-gray-700 text-xs">
          <p>{`Preço: ${formatNumber(payload[0].value)}`}</p>
          <p>{`Hora: ${payload[0].payload.time}`}</p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="bg-trader-dark border border-gray-800 rounded-lg overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-yellow-500 rounded-full h-6 w-6 flex items-center justify-center mr-2">
            <span className="text-xs text-black font-bold">₿</span>
          </div>
          <div>
            <h3 className="text-white font-bold">{selectedAsset.symbol}</h3>
            <p className="text-xs text-gray-400">{selectedAsset.name} • {selectedAsset.type}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className={`px-3 py-1 text-xs rounded ${selectedTimeframe === '5m' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}>5m</button>
          <button className={`px-3 py-1 text-xs rounded ${selectedTimeframe === '15m' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}>15m</button>
          <button className={`px-3 py-1 text-xs rounded ${selectedTimeframe === '30m' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}>30m</button>
          <button className={`px-3 py-1 text-xs rounded ${selectedTimeframe === '1h' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}>1h</button>
          <button className={`px-3 py-1 text-xs rounded ${selectedTimeframe === '4h' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}>4h</button>
          <button className={`px-3 py-1 text-xs rounded ${selectedTimeframe === '1d' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}>1d</button>
        </div>
      </div>
      
      <div className="flex-1 candlestick-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="time" 
              stroke="#666" 
              tick={{ fill: '#888', fontSize: 10 }} 
              tickLine={{ stroke: '#666' }}
              axisLine={{ stroke: '#666' }}
              minTickGap={30}
            />
            <YAxis 
              domain={['auto', 'auto']}
              stroke="#666" 
              tick={{ fill: '#888', fontSize: 10 }} 
              tickLine={{ stroke: '#666' }}
              axisLine={{ stroke: '#666' }}
              tickFormatter={(value) => `${formatNumber(value)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#0ECB81" 
              strokeWidth={2}
              dot={false}
              animationDuration={300}
            />
            <ReferenceLine y={assetPrice} stroke="#fff" strokeDasharray="3 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="p-4 border-t border-gray-800">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs text-gray-400">Último preço</span>
            <h4 className="text-white font-bold">{formatNumber(assetPrice)}</h4>
          </div>
          
          <div className="flex gap-2">
            <button className="bg-gray-700 px-3 py-1 rounded text-xs text-white">Linhas</button>
            <button className="bg-gray-700 px-3 py-1 rounded text-xs text-white">Velas</button>
            <button className="bg-gray-700 px-3 py-1 rounded text-xs text-white">Indicadores</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingChart;
