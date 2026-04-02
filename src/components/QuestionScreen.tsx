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
 

