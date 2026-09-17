import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const RunningTicker: React.FC = () => {
  const { data } = usePortfolio();
  const items = data.ticker.length ? data.ticker : ['SOFTWARE ENGINEERING', 'F1 TELEMETRY'];
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <section className="overflow-hidden bg-[#101015] border-y border-white/10 py-3 select-none">
      <div className="flex w-max items-center gap-8 animate-marquee whitespace-nowrap">
        {repeated.map((item, idx) => (
          <React.Fragment key={idx}>
            <span className="font-f1 font-bold text-xs tracking-[0.2em] text-f1-gray hover:text-white transition">
              {item}
            </span>
            <span className="text-f1-red font-black text-sm">✦</span>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};
