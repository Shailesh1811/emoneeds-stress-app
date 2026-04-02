import { emonedsLogo } from "@/assets/emoneeds-logo";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain } from "lucide-react";
 
interface WelcomeScreenProps {
  onStart: () => void;
}
 
const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-background px-16">
      <div className="flex flex-col items-center gap-10 animate-fade-in">
        <img
          src={emonedsLogo}
          alt="Emoneeds"
          width={512}
          height={512}
          className="h-24 w-auto"
        />
 
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-3">
            <Brain className="h-10 w-10 text-primary" />
            <h1 className="text-5xl font-bold text-foreground tracking-tight">
              Stress Check-In
            </h1>
          </div>
          <p className="max-w-lg text-xl text-muted-foreground font-secondary">
            Take 2 minutes to understand your stress levels and get personalized wellness insights.
          </p>
        </div>
 
        <Button size="lg" onClick={onStart} className="mt-4 gap-3">
          Get Started
          <ArrowRight />
        </Button>
 
        <p className="text-sm text-muted-foreground font-secondary">
          Your responses are confidential and used only for your personal assessment.
        </p>
      </div>
    </div>
  );
};
 
export default WelcomeScreen;
 

