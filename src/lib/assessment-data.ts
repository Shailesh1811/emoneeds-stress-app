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
 

