
import React from 'react';
import { ParsedPlanItem } from '@/utils/planParsingUtils';

interface NightPlanItemCardProps {
  item: ParsedPlanItem;
  index: number;
  totalItems: number;
}

const NightPlanItemCard: React.FC<NightPlanItemCardProps> = ({ item, index, totalItems }) => {
  return (
    <div 
      className="relative pl-16 animate-fade-in-up"
      style={{ animationDelay: `${index * 150 + 300}ms` }}
    >
      {/* Path Connector Line element */}
      {index > 0 && (
        <div className="absolute left-[28px] bottom-[calc(100%_-_4px)] h-10 w-[3px] bg-neon-teal/60 transform -translate-x-1/2 rounded-full"></div>
      )}
      {index < totalItems - 1 && (
          <div className="absolute left-[28px] top-[calc(100%_-_4px)] h-10 w-[3px] bg-neon-teal/60 transform -translate-x-1/2 rounded-full"></div>
      )}

      {/* Step Number/Marker (Circle) */}
      <div 
        className="absolute top-[50%] left-[28px] transform -translate-y-1/2 -translate-x-1/2 z-10 
                    h-14 w-14 bg-neon-teal rounded-full flex items-center justify-center 
                    shadow-lg border-4 border-brand-deep-black ring-2 ring-neon-teal/50"
      >
        <span className="text-white font-bold text-2xl">{index + 1}</span>
      </div>
      
      {/* Step Card Content */}
      <div 
        className="ml-0 p-5 md:p-6 bg-brand-deep-black/80 backdrop-blur-md rounded-xl shadow-xl hover:shadow-neon-purple/70 border border-neon-purple/40 hover:border-neon-purple/80 transition-all duration-300 ease-in-out transform hover:scale-[1.03] min-h-[120px] flex flex-col justify-center"
      >
        <div className="flex items-center mb-2">
          <item.icon className="h-7 w-7 text-neon-teal mr-3 flex-shrink-0" />
          <h5 className="font-semibold text-white text-xl md:text-2xl">{item.title}</h5>
        </div>
        <p className="text-gray-300 leading-relaxed text-sm md:text-base">{item.teaser}</p>
      </div>
    </div>
  );
};

export default NightPlanItemCard;
