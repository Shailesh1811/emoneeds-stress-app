Emoneeds Stress Assessment — Complete Source Code
Generated on 4/2/2026

index.html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- TODO: Set the document title to the name of your application -->
    <title>Emoneeds Stress Assessment</title>
    <meta name="description" content="Take a quick stress check-in and get personalized wellness insights from Emoneeds." />
    <meta name="author" content="Lovable" />
 
    <!-- TODO: Update og:title to match your application name -->
    <meta property="og:title" content="Lovable App" />
    <meta property="og:description" content="Lovable Generated Project" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
 
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@Lovable" />
    <meta name="twitter:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
  </head>
 
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
 

src/main.tsx
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
 
createRoot(document.getElementById("root")!).render(<App />);
 

src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
 
const queryClient = new QueryClient();
 
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
 
export default App;
 

src/index.css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Inter:wght@400;500;600;700;800&display=swap');
 
@tailwind base;
@tailwind components;
@tailwind utilities;
 
@layer base {
  :root {
    --background: 170 30% 97%;
    --foreground: 220 20% 10%;
 
    --card: 0 0% 100%;
    --card-foreground: 220 20% 10%;
 
    --popover: 0 0% 100%;
    --popover-foreground: 220 20% 10%;
 
    --primary: 174 62% 38%;
    --primary-foreground: 0 0% 100%;
 
    --primary-light: 174 50% 92%;
    --primary-dark: 174 65% 28%;
 
    --secondary: 174 30% 90%;
    --secondary-foreground: 174 62% 28%;
 
    --muted: 220 14% 96%;
    --muted-foreground: 220 10% 46%;
 
    --accent: 174 40% 94%;
    --accent-foreground: 174 62% 28%;
 
    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 100%;
 
    --border: 220 13% 91%;
    --input: 220 13% 91%;
    --ring: 174 62% 38%;
 
    --radius: 0.5rem;
 
    --stress-low: 152 60% 42%;
    --stress-moderate: 38 92% 50%;
    --stress-high: 0 72% 51%;
 
    --shadow-1: 0 2px 8px -2px hsl(220 20% 10% / 0.06), 0 4px 16px -4px hsl(220 20% 10% / 0.08);
    --shadow-2: 0 4px 16px -4px hsl(220 20% 10% / 0.08), 0 8px 32px -8px hsl(220 20% 10% / 0.1);
 
    --transition-default: 400ms cubic-bezier(0.4, 0, 0.2, 1);
 
    --font-primary: 'Inter', system-ui, sans-serif;
    --font-secondary: 'DM Sans', system-ui, sans-serif;
  }
}
 
@layer base {
  * {
    @apply border-border;
  }
 
  body {
    @apply bg-background text-foreground;
    font-family: var(--font-primary);
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow: hidden;
  }
 
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-primary);
    font-weight: 700;
  }
}
 
@layer utilities {
  .font-secondary {
    font-family: var(--font-secondary);
  }
 
  .text-stress-low {
    color: hsl(var(--stress-low));
  }
  .text-stress-moderate {
    color: hsl(var(--stress-moderate));
  }
  .text-stress-high {
    color: hsl(var(--stress-high));
  }
  .bg-stress-low {
    background-color: hsl(var(--stress-low));
  }
  .bg-stress-moderate {
    background-color: hsl(var(--stress-moderate));
  }
  .bg-stress-high {
    background-color: hsl(var(--stress-high));
  }
}
 

src/pages/Index.tsx
import { useState, useCallback } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import LeadCaptureScreen from "@/components/LeadCaptureScreen";
import QuestionScreen from "@/components/QuestionScreen";
import ResultsScreen from "@/components/ResultsScreen";
import { calculateStressLevel } from "@/lib/assessment-data";
import { saveAssessmentLead } from "@/lib/save-lead";
 
type Screen = "welcome" | "lead" | "questions" | "results";
 
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
    setScreen("questions");
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
      {screen === "questions" && (
        <QuestionScreen
          onComplete={handleAssessmentComplete}
          onBack={() => setScreen("lead")}
        />
      )}
      {screen === "results" && (
        <ResultsScreen score={totalScore} onRestart={handleRestart} />
      )}
    </div>
  );
};
 
export default Index;
 

src/components/WelcomeScreen.tsx
import emonedsLogo from "@/assets/emoneeds-logo.png";
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
 

src/components/LeadCaptureScreen.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, User, Mail, Phone } from "lucide-react";
 
interface LeadCaptureScreenProps {
  onSubmit: (data: { name: string; email: string; phone?: string }) => void;
  onBack: () => void;
}
 
const LeadCaptureScreen = ({ onSubmit, onBack }: LeadCaptureScreenProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
 
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Please enter your name";
    if (!email.trim()) newErrors.email = "Please enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Please enter a valid email";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleSubmit = () => {
    if (validate()) {
      onSubmit({ name: name.trim(), email: email.trim(), phone: phone.trim() || undefined });
    }
  };
 
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-background px-16">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-foreground">Before We Begin</h2>
          <p className="mt-3 text-lg text-muted-foreground font-secondary">
            Tell us a bit about yourself so we can share your results.
          </p>
        </div>
 
        <div className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Full Name <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="h-[60px] w-full rounded-lg border border-input bg-card pl-12 pr-4 text-lg text-foreground outline-none transition-all duration-[400ms] placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20"
              />
            </div>
            {errors.name && <p className="mt-1.5 text-sm text-destructive">{errors.name}</p>}
          </div>
 
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Email <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-[60px] w-full rounded-lg border border-input bg-card pl-12 pr-4 text-lg text-foreground outline-none transition-all duration-[400ms] placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20"
              />
            </div>
            {errors.email && <p className="mt-1.5 text-sm text-destructive">{errors.email}</p>}
          </div>
 
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Phone <span className="text-muted-foreground text-xs font-normal">(optional)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="h-[60px] w-full rounded-lg border border-input bg-card pl-12 pr-4 text-lg text-foreground outline-none transition-all duration-[400ms] placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20"
              />
            </div>
          </div>
        </div>
 
        <div className="mt-8 flex gap-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button onClick={handleSubmit} className="flex-1 gap-2">
            Start Assessment
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
};
 
export default LeadCaptureScreen;
 

src/components/QuestionScreen.tsx
import { useState } from "react";
import { questions, answerOptions } from "@/lib/assessment-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
 
interface QuestionScreenProps {
  onComplete: (answers: number[]) => void;
  onBack: () => void;
}
 
const QuestionScreen = ({ onComplete, onBack }: QuestionScreenProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
 
  const question = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const selectedAnswer = answers[currentIndex];
  const isLast = currentIndex === questions.length - 1;
 
  const handleSelect = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = value;
    setAnswers(newAnswers);
  };
 
  const handleNext = () => {
    if (selectedAnswer === null) return;
    if (isLast) {
      onComplete(answers as number[]);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };
 
  const handlePrev = () => {
    if (currentIndex === 0) {
      onBack();
    } else {
      setCurrentIndex((i) => i - 1);
    }
  };
 
  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Progress bar */}
      <div className="px-16 pt-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-muted-foreground font-secondary">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary-dark font-secondary">
            {question.category}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-[400ms] ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
 
      {/* Question content */}
      <div className="flex flex-1 flex-col items-center justify-center px-16" key={currentIndex}>
        <div className="w-full max-w-2xl animate-fade-in">
          <h2 className="mb-10 text-center text-3xl font-bold text-foreground leading-tight">
            {question.text}
          </h2>
 
          <div className="flex flex-col gap-3">
            {answerOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`flex h-[64px] w-full items-center rounded-xl border-2 px-6 text-lg font-medium transition-all duration-[400ms] ${
                  selectedAnswer === option.value
                    ? "border-primary bg-primary-light text-primary-dark shadow-card"
                    : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent"
                }`}
              >
                <span
                  className={`mr-4 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    selectedAnswer === option.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {option.value + 1}
                </span>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
 
      {/* Navigation */}
      <div className="flex items-center justify-between px-16 pb-8">
        <Button variant="outline" size="sm" onClick={handlePrev} className="gap-2">
          <ArrowLeft />
          Back
        </Button>
        <Button
          size="default"
          onClick={handleNext}
          disabled={selectedAnswer === null}
          className="gap-2"
        >
          {isLast ? "See Results" : "Next"}
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
};
 
export default QuestionScreen;
 

src/components/ResultsScreen.tsx
import { useEffect, useState, useRef } from "react";
import { calculateStressLevel, stressLevelConfig, questions, StressLevel } from "@/lib/assessment-data";
import emonedsLogo from "@/assets/emoneeds-logo.png";
import { Button } from "@/components/ui/button";
import { RotateCcw, CheckCircle, AlertTriangle, AlertCircle, Lightbulb } from "lucide-react";
 
const stressColorMap: Record<StressLevel, string> = {
  low: "hsl(152, 60%, 42%)",
  moderate: "hsl(38, 92%, 50%)",
  high: "hsl(0, 72%, 51%)",
};
 
interface ResultsScreenProps {
  score: number;
  onRestart: () => void;
}
 
const AUTO_RESET_SECONDS = 15;
 
const ResultsScreen = ({ score, onRestart }: ResultsScreenProps) => {
  const level = calculateStressLevel(score);
  const config = stressLevelConfig[level];
  const maxScore = questions.length * 4;
  const percentage = Math.round((score / maxScore) * 100);
  const [countdown, setCountdown] = useState(AUTO_RESET_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const activityRef = useRef<ReturnType<typeof setTimeout>>();
 
  const resetTimer = () => {
    setCountdown(AUTO_RESET_SECONDS);
  };
 
  useEffect(() => {
    const handleActivity = () => resetTimer();
    window.addEventListener("touchstart", handleActivity);
    window.addEventListener("mousemove", handleActivity);
 
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onRestart();
          return AUTO_RESET_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
 
    return () => {
      window.removeEventListener("touchstart", handleActivity);
      window.removeEventListener("mousemove", handleActivity);
      if (timerRef.current) clearInterval(timerRef.current);
      if (activityRef.current) clearTimeout(activityRef.current);
    };
  }, [onRestart]);
 
  const stressColor = stressColorMap[level];
  const StressIcon = level === "low" ? CheckCircle : level === "moderate" ? AlertTriangle : AlertCircle;
 
  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="flex flex-1 items-center justify-center px-12">
        <div className="grid w-full max-w-5xl grid-cols-2 gap-12 animate-fade-in">
          {/* Left: Score */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative mb-6">
              <svg className="h-48 w-48 -rotate-90" viewBox="0 0 200 200">
                <circle
                  cx="100" cy="100" r="85"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="12"
                />
                <circle
                  cx="100" cy="100" r="85"
                  fill="none"
                  stroke={stressColor}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${(percentage / 100) * 534} 534`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold animate-count-up" style={{ color: stressColor }}>
                  {score}
                </span>
                <span className="text-sm text-muted-foreground font-secondary">
                  out of {maxScore}
                </span>
              </div>
            </div>
 
            <div className="flex items-center gap-2 mb-2">
              <StressIcon className="h-6 w-6" style={{ color: stressColor }} />
              <h2 className="text-2xl font-bold" style={{ color: stressColor }}>
                {config.label}
              </h2>
            </div>
            <p className="text-center text-base text-muted-foreground font-secondary max-w-sm">
              {config.description}
            </p>
          </div>
 
          {/* Right: Tips */}
          <div className="flex flex-col justify-center">
            <div className="rounded-xl bg-card p-8 shadow-card">
              <div className="flex items-center gap-2 mb-5">
                <Lightbulb className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-bold text-foreground">Recommended Next Steps</h3>
              </div>
              <ul className="flex flex-col gap-3">
                {config.tips.map((tip, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-base text-foreground font-secondary animate-fade-in"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary-dark">
                      {i + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
 
            <div className="mt-6 flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={onRestart} className="gap-2">
                <RotateCcw />
                Take Again
              </Button>
              <span className="text-sm text-muted-foreground font-secondary">
                Auto-reset in {countdown}s
              </span>
            </div>
          </div>
        </div>
      </div>
 
      {/* Footer */}
      <div className="flex items-center justify-center gap-3 pb-6">
        <img src={emonedsLogo} alt="Emoneeds" className="h-8 w-auto" loading="lazy" width={512} height={512} />
        <span className="text-sm text-muted-foreground font-secondary">
          Powered by Emoneeds — Your Mental Wellness Partner
        </span>
      </div>
    </div>
  );
};
 
export default ResultsScreen;
 

src/lib/assessment-data.ts
export interface Question {
  id: number;
  text: string;
  category: string;
}
 
export const questions: Question[] = [
  { id: 1, text: "How often do you feel overwhelmed by your workload?", category: "Work" },
  { id: 2, text: "How frequently do you have trouble falling or staying asleep?", category: "Sleep" },
  { id: 3, text: "How often do you feel anxious or worried without a clear reason?", category: "Anxiety" },
  { id: 4, text: "How frequently do you experience tension headaches or muscle pain?", category: "Physical" },
  { id: 5, text: "How often do you feel irritable or short-tempered?", category: "Mood" },
  { id: 6, text: "How frequently do you struggle to concentrate or stay focused?", category: "Cognitive" },
  { id: 7, text: "How often do you skip meals or eat unhealthily due to stress?", category: "Lifestyle" },
  { id: 8, text: "How frequently do you feel emotionally drained at the end of the day?", category: "Emotional" },
  { id: 9, text: "How often do you feel disconnected from friends or family?", category: "Social" },
  { id: 10, text: "How frequently do you feel like you have no time for yourself?", category: "Balance" },
];
 
export const answerOptions = [
  { value: 0, label: "Never" },
  { value: 1, label: "Rarely" },
  { value: 2, label: "Sometimes" },
  { value: 3, label: "Often" },
  { value: 4, label: "Always" },
];
 
export type StressLevel = "low" | "moderate" | "high";
 
export function calculateStressLevel(score: number): StressLevel {
  const maxScore = questions.length * 4;
  const percentage = (score / maxScore) * 100;
  if (percentage <= 33) return "low";
  if (percentage <= 66) return "moderate";
  return "high";
}
 
export const stressLevelConfig: Record<StressLevel, { label: string; color: string; description: string; tips: string[] }> = {
  low: {
    label: "Low Stress",
    color: "stress-low",
    description: "You're managing stress well! Keep up your healthy habits and continue prioritizing self-care.",
    tips: [
      "Maintain your current wellness routine",
      "Consider mindfulness practices to stay grounded",
      "Keep nurturing your social connections",
    ],
  },
  moderate: {
    label: "Moderate Stress",
    color: "stress-moderate",
    description: "You're experiencing a moderate level of stress. Small changes can make a big difference in how you feel.",
    tips: [
      "Try scheduling regular breaks during work",
      "Practice deep breathing exercises daily",
      "Establish a consistent sleep schedule",
      "Consider speaking with a wellness professional",
    ],
  },
  high: {
    label: "High Stress",
    color: "stress-high",
    description: "Your stress levels are elevated. It's important to take proactive steps to protect your mental health.",
    tips: [
      "Reach out to a mental health professional",
      "Prioritize sleep and nutrition immediately",
      "Set firm boundaries with work and obligations",
      "Practice daily relaxation techniques",
      "Talk to someone you trust about how you're feeling",
    ],
  },
};
 

src/lib/save-lead.ts
import { supabase } from "@/integrations/supabase/client";
 
export async function saveAssessmentLead(data: {
  name: string;
  email: string;
  phone?: string;
  stress_score: number;
  stress_level: string;
}) {
  const { error } = await supabase.from("assessment_leads").insert([data]);
  if (error) {
    console.error("Error saving lead:", error);
    throw error;
  }
}
 

tailwind.config.ts
import type { Config } from "tailwindcss";
 
export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        primary: ["Inter", "system-ui", "sans-serif"],
        secondary: ["DM Sans", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          light: "hsl(var(--primary-light))",
          dark: "hsl(var(--primary-dark))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        stress: {
          low: "hsl(var(--stress-low))",
          moderate: "hsl(var(--stress-moderate))",
          high: "hsl(var(--stress-high))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1.25rem",
      },
      boxShadow: {
        "card": "var(--shadow-1)",
        "card-hover": "var(--shadow-2)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "progress-fill": {
          from: { width: "0%" },
          to: { width: "var(--progress-width)" },
        },
        "count-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "scale-in": "scale-in 0.4s ease-out forwards",
        "progress-fill": "progress-fill 1s ease-out forwards",
        "count-up": "count-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
 