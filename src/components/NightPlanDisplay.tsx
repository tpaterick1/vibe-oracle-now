
import React from 'react';
import { ParsedPlanData } from '@/utils/planParsingUtils';
import NightPlanItemCard from './NightPlanItemCard';
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, Compass } from 'lucide-react';

interface NightPlanDisplayProps {
  parsedPlanData: ParsedPlanData;
  generatedPlan: string; // Fallback for raw plan
}

const NightPlanDisplay: React.FC<NightPlanDisplayProps> = ({ parsedPlanData, generatedPlan }) => {
  return (
    <div className="flex-col items-start space-y-4 bg-brand-charcoal/50 p-4 md:p-6 rounded-b-lg">
      <h4 className="text-3xl font-bold text-neon-purple w-full text-center mb-6 tracking-tight animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        {parsedPlanData.mainTitle}
      </h4>
      
      {parsedPlanData.items.length > 0 && (
        <div className="relative w-full px-2 md:px-4 py-4">
          <div className="space-y-10">
            {parsedPlanData.items.map((item, index) => (
              <NightPlanItemCard 
                key={index} 
                item={item}
                index={index}
                totalItems={parsedPlanData.items.length}
              />
            ))}
          </div>
        </div>
      )}
      
      {parsedPlanData.tipsSection && (
          <div className="mt-8 w-full p-5 md:p-6 bg-brand-charcoal/80 backdrop-blur-md rounded-xl shadow-lg border border-neon-teal/40 animate-fade-in-up" style={{ animationDelay: `${(parsedPlanData.items.length) * 150 + 500}ms` }}>
              <h5 className="flex items-center text-xl font-semibold text-neon-teal mb-3">
                  <Lightbulb className="h-6 w-6 mr-2" />
                  Helpful Hints
              </h5>
              <pre className="text-sm md:text-base text-gray-300 whitespace-pre-wrap font-sans">{parsedPlanData.tipsSection.replace(/^###\s*Budget-Friendly Tips:/i, '').trim()}</pre>
          </div>
      )}

      {parsedPlanData.outroText && (
          <div className="mt-6 w-full p-5 md:p-6 bg-brand-charcoal/80 backdrop-blur-md rounded-xl shadow-lg border border-neon-teal/40 animate-fade-in-up" style={{ animationDelay: `${(parsedPlanData.items.length) * 150 + 700}ms` }}>
               <h5 className="flex items-center text-xl font-semibold text-neon-teal mb-3">
                  <Compass className="h-6 w-6 mr-2" />
                  Your Adventure Awaits!
              </h5>
               <p className="text-sm md:text-base text-gray-300 italic">{parsedPlanData.outroText}</p>
          </div>
      )}

      {generatedPlan && parsedPlanData.items.length === 0 && !parsedPlanData.tipsSection && !parsedPlanData.outroText && (
        <Textarea
          value={generatedPlan}
          readOnly
          rows={8}
          className="w-full bg-brand-deep-black border-gray-700 text-gray-200 p-3 rounded-md whitespace-pre-wrap mt-4"
        />
      )}
    </div>
  );
};

export default NightPlanDisplay;
