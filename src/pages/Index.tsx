import { useState, useCallback } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import LeadCaptureScreen from "@/components/LeadCaptureScreen";
import FactsScreen from "@/components/FactsScreen";
import QuestionScreen from "@/components/QuestionScreen";
import ResultsScreen from "@/components/ResultsScreen";
import { calculateStressLevel } from "@/lib/assessment-data";
import { saveAssessmentLead } from "@/lib/save-lead";
 
type Screen = "welcome" | "lead" | "facts" | "questions" | "results";
 
interface LeadData {
  name: string;
  email: string;
  phone?: string;
}
 
const Index = () => {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [totalScore, setTotalScore] = useState(0);
 
  const handleStart = () => setScreen("lead");
 
  const handleLeadSubmit = (data: LeadData) => {
    setLeadData(data);
    setScreen("facts");
  };
 
  const handleAssessmentComplete = useCallback(
    async (answers: number[]) => {
      const score = answers.reduce((sum, a) => sum + a, 0);
      setTotalScore(score);
      setScreen("results");
 
      if (leadData) {
        try {
          await saveAssessmentLead({
            name: leadData.name,
            email: leadData.email,
            phone: leadData.phone,
            stress_score: score,
            stress_level: calculateStressLevel(score),
          });
        } catch (err) {
          console.error("Failed to save lead:", err);
        }
      }
    },
    [leadData]
  );
 
  const handleRestart = useCallback(() => {
    setScreen("welcome");
    setLeadData(null);
    setTotalScore(0);
  }, []);
 
  return (
    <div className="h-screen w-screen overflow-hidden">
      {screen === "welcome" && <WelcomeScreen onStart={handleStart} />}
      {screen === "lead" && (
        <LeadCaptureScreen
          onSubmit={handleLeadSubmit}
          onBack={() => setScreen("welcome")}
        />
      )}
      {screen === "facts" && (
        <FactsScreen
          onNext={() => setScreen("questions")}
          onBack={() => setScreen("lead")}
        />
      )}
      {screen === "questions" && (
        <QuestionScreen
          onComplete={handleAssessmentComplete}
          onBack={() => setScreen("facts")}
        />
      )}
      {screen === "results" && (
        <ResultsScreen score={totalScore} onRestart={handleRestart} />
      )}
    </div>
  );
};
 
export default Index;
 

