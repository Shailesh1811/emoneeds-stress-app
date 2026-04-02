import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const FUN_FACTS = [
  { icon:"📉", fact:"Toxic workplace culture is 10.4 times more powerful than compensation in predicting employee attrition rates. Paychecks do not fix bad culture.", src:"MIT Sloan School of Management" },
  { icon:"🧠", fact:"Chronic corporate stress physically shrinks the prefrontal cortex—the exact region of your brain responsible for executive control and decision-making.", src:"Harvard Medical School" },
  { icon:"🧘", fact:"Individual wellness perks (like meditation apps) have virtually zero impact on mental health if the company's baseline workload and demands are not addressed.", src:"Oxford University Wellbeing Research" },
  { icon:"🚬", fact:"Workplace stress contributes to $190 billion in healthcare costs annually, making the modern systemic corporate grind statistically as dangerous as secondhand smoke.", src:"Stanford & Harvard Joint Study" },
];

interface FactsScreenProps {
  onNext: () => void;
  onBack: () => void;
}

const FactsScreen = ({ onNext, onBack }: FactsScreenProps) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-background px-16 py-8">
      <div className="w-full max-w-4xl animate-fade-in flex flex-col h-full overflow-y-auto">
        <div className="mb-8 text-center mt-auto">
          <div className="text-primary font-bold tracking-widest uppercase mb-2 text-sm">Before we begin...</div>
          <h2 className="text-4xl font-bold text-foreground">Did You Know? 🤯</h2>
          <p className="mt-2 text-lg text-muted-foreground font-secondary">
            Corporate life impact based on profound research
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto mb-10">
          {FUN_FACTS.map((f, i) => (
            <div key={i} className="flex gap-4 p-6 bg-card border-2 border-border rounded-xl shadow-sm text-left">
              <div className="text-4xl shrink-0">{f.icon}</div>
              <div className="flex flex-col justify-center">
                <p className="text-base font-semibold leading-snug mb-3">{f.fact}</p>
                <p className="text-xs text-muted-foreground font-secondary tracking-wide uppercase">{f.src}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto flex gap-4 w-full justify-center pb-8 border-t border-border pt-6">
          <Button variant="outline" onClick={onBack} className="w-48">
            Back
          </Button>
          <Button onClick={onNext} className="w-48 gap-2">
            Let's Find Out
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FactsScreen;
