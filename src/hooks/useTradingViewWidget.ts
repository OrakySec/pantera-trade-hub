
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

declare global {
  interface Window {
    TradingView: any;
  }
}

interface TradingViewConfig {
  container_id: string;
  symbol: string;
  interval: string;
  onReady?: () => void;
}

export const useTradingViewWidget = ({
  container_id,
  symbol,
  interval,
  onReady
}: TradingViewConfig) => {
  const widgetRef = useRef<any>(null);

  const initializeWidget = () => {
    if (!window.TradingView) {
      console.error('TradingView library not loaded');
      return;
    }

    try {
      widgetRef.current = new window.TradingView.widget({
        container_id,
        symbol: symbol.replace('/', ':'),
        interval,
        timezone: "America/Sao_Paulo",
        theme: "dark",
        style: "1",
        locale: "br",
        toolbar_bg: "#111827",
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_legend: true,
        save_image: false,
        show_popup_button: true,
        withdateranges: true,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        studies: ["MASimple@tv-basicstudies"],
        overrides: {
          "mainSeriesProperties.candleStyle.upColor": "#0ECB81",
          "mainSeriesProperties.candleStyle.downColor": "#f23645",
          "mainSeriesProperties.candleStyle.borderUpColor": "#0ECB81",
          "mainSeriesProperties.candleStyle.borderDownColor": "#f23645",
          "mainSeriesProperties.candleStyle.wickUpColor": "#0ECB81",
          "mainSeriesProperties.candleStyle.wickDownColor": "#f23645",
          "paneProperties.background": "#111827",
          "paneProperties.vertGridProperties.color": "rgba(255, 255, 255, 0.05)",
          "paneProperties.horzGridProperties.color": "rgba(255, 255, 255, 0.05)",
        },
        onReady: () => {
          console.log('TradingView widget ready');
          if (onReady) onReady();
        }
      });
    } catch (error) {
      console.error('Error initializing TradingView widget:', error);
      toast.error('Erro ao carregar o gráfico. Tente recarregar a página.');
    }
  };

  useEffect(() => {
    if (!document.getElementById('tradingview-widget-script')) {
      const script = document.createElement('script');
      script.id = 'tradingview-widget-script';
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = initializeWidget;
      document.head.appendChild(script);
    } else {
      initializeWidget();
    }

    return () => {
      if (widgetRef.current) {
        try {
          const container = document.getElementById(container_id);
          if (container) {
            container.innerHTML = '';
          }
          widgetRef.current = null;
        } catch (error) {
          console.error('Error cleaning up TradingView widget:', error);
        }
      }
    };
  }, [container_id]);

  useEffect(() => {
    if (widgetRef.current) {
      widgetRef.current.setSymbol(symbol.replace('/', ':'), interval);
    }
  }, [symbol, interval]);

  const addMarker = (
    time: number,
    price: number,
    direction: 'BUY' | 'SELL',
    text?: string
  ) => {
    if (!widgetRef.current?.chart) return;

    try {
      const color = direction === 'BUY' ? '#0ECB81' : '#f23645';
      const shape = direction === 'BUY' ? 'arrow_up' : 'arrow_down';

      widgetRef.current.chart().createShape(
        { time, price },
        {
          shape,
          text: text || `${direction} @ ${price}`,
          overrides: {
            color,
            backgroundColor: color,
            textColor: '#ffffff',
            fontsize: 12,
            bold: true,
            locked: true,
          }
        }
      );
    } catch (error) {
      console.error('Error adding marker:', error);
    }
  };

  return {
    widget: widgetRef.current,
    addMarker
  };
};
