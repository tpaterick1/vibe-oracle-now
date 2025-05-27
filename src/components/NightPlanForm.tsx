import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Keep for numPeople
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"; // Import ToggleGroup components
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
  const budgetOptions = [
    { value: "< $50", label: "< $50" },
    { value: "< $100", label: "< $100" },
    { value: "< $200", label: "< $200" },
    { value: "NO BUDGET!", label: "No Budget!" },
  ];

  const timeOptions = [
    { value: "Evening", label: "Evening" }, // e.g., 6 PM - 9 PM
    { value: "Late Night", label: "Late Night" }, // e.g., 9 PM - 12 AM
    { value: "All Night", label: "All Night" }, // e.g., 12 AM+
  ];

  // Common class for toggle group items
  const toggleItemClasses = "flex-1 border-gray-600 bg-brand-charcoal text-gray-300 data-[state=on]:bg-neon-purple data-[state=on]:text-white data-[state=on]:border-neon-purple hover:bg-gray-800/60 hover:border-gray-500 focus-visible:ring-1 focus-visible:ring-neon-purple focus-visible:ring-offset-1 focus-visible:ring-offset-brand-charcoal";

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"> {/* Increased gap and added mb */}
        <div className="space-y-2">
          <Label htmlFor="budget-group" className="text-gray-300">Budget</Label>
          <ToggleGroup
            type="single"
            value={budget}
            onValueChange={(value) => { if (value) setBudget(value); }} // Prevents unselecting all
            className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full" // Updated grid columns
            id="budget-group"
            aria-label="Budget selection"
            disabled={isLoading}
          >
            {budgetOptions.map((option) => (
              <ToggleGroupItem
                key={option.value}
                value={option.value}
                aria-label={option.label}
                className={toggleItemClasses}
                disabled={isLoading}
              >
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="time-group" className="text-gray-300">Time of Night</Label>
          <ToggleGroup
            type="single"
            value={time}
            onValueChange={(value) => { if (value) setTime(value); }} // Prevents unselecting all
            className="grid grid-cols-3 gap-2 w-full"
            id="time-group"
            aria-label="Time of night selection"
            disabled={isLoading}
          >
            {timeOptions.map((option) => (
              <ToggleGroupItem
                key={option.value}
                value={option.value}
                aria-label={option.label}
                className={toggleItemClasses}
                disabled={isLoading}
              >
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
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
