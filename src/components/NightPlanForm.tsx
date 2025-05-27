
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';

interface NightPlanFormProps {
  budget: string;
  setBudget: (value: string) => void;
  time: string;
  setTime: (value: string) => void;
  numPeople: string;
  setNumPeople: (value: string) => void;
  handleGeneratePlan: () => void;
  isLoading: boolean;
  error: string | null;
}

const NightPlanForm: React.FC<NightPlanFormProps> = ({
  budget,
  setBudget,
  time,
  setTime,
  numPeople,
  setNumPeople,
  handleGeneratePlan,
  isLoading,
  error,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budget" className="text-gray-300">Budget</Label>
          <Input
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g., $, $$, $$$ or casual, moderate, fancy"
            className="bg-brand-charcoal border-gray-700 text-white placeholder-gray-500 focus:border-neon-purple"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time" className="text-gray-300">Time of Night</Label>
          <Input
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="e.g., Evening, Late Night"
            className="bg-brand-charcoal border-gray-700 text-white placeholder-gray-500 focus:border-neon-purple"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="numPeople" className="text-gray-300">Number of People</Label>
          <Input
            id="numPeople"
            type="number"
            value={numPeople}
            onChange={(e) => setNumPeople(e.target.value)}
            placeholder="e.g., 2"
            min="1"
            className="bg-brand-charcoal border-gray-700 text-white placeholder-gray-500 focus:border-neon-purple"
            disabled={isLoading}
          />
        </div>
      </div>
      <Button
        onClick={handleGeneratePlan}
        disabled={isLoading}
        className="w-full bg-neon-purple hover:bg-fuchsia-600 text-white font-semibold py-3 text-lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Generating...
          </>
        ) : (
          "Craft My Quest!"
        )}
      </Button>
      {error && <p className="text-neon-red text-center mt-4">{error}</p>}
    </>
  );
};

export default NightPlanForm;
