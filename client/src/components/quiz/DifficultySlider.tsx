import { useState, useEffect } from 'react';
import {
  Slider,
  SliderTrack,
  SliderRange,
  SliderThumb,
} from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Brain, CheckCircle, Clock, Lightbulb, Settings, Trophy, Zap } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

// Define difficulty levels
const DIFFICULTY_LEVELS = [
  { value: 1, label: 'Beginner', color: 'bg-green-500', description: 'Basic concepts and simple questions' },
  { value: 2, label: 'Elementary', color: 'bg-teal-500', description: 'Slightly challenging but still foundational' },
  { value: 3, label: 'Intermediate', color: 'bg-blue-500', description: 'Balanced difficulty with some complex problems' },
  { value: 4, label: 'Advanced', color: 'bg-purple-500', description: 'Challenging questions requiring deeper knowledge' },
  { value: 5, label: 'Expert', color: 'bg-red-500', description: 'Very difficult problems for mastery demonstration' }
];

// Define parameters that change based on difficulty
interface DifficultyParams {
  timePerQuestion: number; // in seconds
  pointsPerQuestion: number;
  totalQuestions: number;
  hintAvailable: boolean;
  skipAllowed: boolean;
}

// Calculate parameters based on difficulty level (1-5)
const calculateParams = (difficulty: number): DifficultyParams => {
  // Interpolate between min and max values based on difficulty
  const timePerQuestion = Math.round(90 - (difficulty - 1) * 15); // 90s for level 1, down to 30s for level 5
  const pointsPerQuestion = Math.round(10 + (difficulty - 1) * 10); // 10pts for level 1, up to 50pts for level 5
  const totalQuestions = Math.round(5 + (difficulty - 1) * 5); // 5 questions for level 1, up to 25 for level 5
  const hintAvailable = difficulty <= 3; // Hints available only for levels 1-3
  const skipAllowed = difficulty <= 2; // Skip allowed only for levels 1-2
  
  return {
    timePerQuestion,
    pointsPerQuestion,
    totalQuestions,
    hintAvailable,
    skipAllowed
  };
};

interface DifficultySliderProps {
  defaultDifficulty?: number;
  onDifficultyChange?: (difficulty: number, params: DifficultyParams) => void;
  onStartQuiz?: (difficulty: number, params: DifficultyParams) => void;
  className?: string;
  quizTitle?: string;
  quizDescription?: string;
  showStartButton?: boolean;
}

export function DifficultySlider({
  defaultDifficulty = 3,
  onDifficultyChange,
  onStartQuiz,
  className = '',
  quizTitle = 'Adjust Quiz Difficulty',
  quizDescription = 'Drag the slider to set your preferred difficulty level.',
  showStartButton = true
}: DifficultySliderProps) {
  const [difficulty, setDifficulty] = useState(defaultDifficulty);
  const [params, setParams] = useState<DifficultyParams>(calculateParams(defaultDifficulty));
  const [lastCompletedLevel, setLastCompletedLevel] = useState<number | null>(null);
  const [animate, setAnimate] = useState(false);
  const { toast } = useToast();

  // Get the current difficulty level object
  const currentLevel = DIFFICULTY_LEVELS.find(level => level.value === Math.round(difficulty)) || DIFFICULTY_LEVELS[2];
  
  // Update parameters when difficulty changes
  useEffect(() => {
    const newParams = calculateParams(difficulty);
    setParams(newParams);
    
    if (onDifficultyChange) {
      onDifficultyChange(difficulty, newParams);
    }
  }, [difficulty, onDifficultyChange]);

  // Simulated function to handle completing a difficulty level
  const handleCompleteDifficulty = (level: number) => {
    setLastCompletedLevel(level);
    setAnimate(true);
    
    toast({
      title: `${DIFFICULTY_LEVELS[level-1].label} Level Completed!`,
      description: "Great job! You've mastered this difficulty level.",
      variant: "default",
    });
    
    // Auto increase difficulty after a delay
    setTimeout(() => {
      if (difficulty < 5) {
        setDifficulty(prev => Math.min(prev + 0.5, 5));
      }
      setAnimate(false);
    }, 1000);
  };

  // Handle starting the quiz
  const handleStartQuiz = () => {
    if (onStartQuiz) {
      onStartQuiz(difficulty, params);
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <CardTitle className="text-2xl">{quizTitle}</CardTitle>
            <CardDescription>{quizDescription}</CardDescription>
          </div>
          <Badge 
            className={`${currentLevel.color} text-white px-3 py-1.5 text-sm font-medium`}
          >
            {currentLevel.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Difficulty Slider */}
        <div className="relative pt-6 pb-8">
          {/* Difficulty level markers */}
          <div className="absolute w-full top-0 flex justify-between mb-2">
            {DIFFICULTY_LEVELS.map((level) => (
              <TooltipProvider key={level.value}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className={`flex flex-col items-center ${Math.round(difficulty) === level.value ? 'scale-110 transition-transform' : ''}`}
                    >
                      <div 
                        className={`w-3 h-3 rounded-full ${level.value <= lastCompletedLevel ? 'bg-green-500' : level.color} 
                        ${Math.round(difficulty) === level.value ? 'ring-2 ring-offset-2 ring-gray-300' : ''}`}
                      />
                      <span className={`text-xs mt-1 ${Math.round(difficulty) === level.value ? 'font-bold' : 'text-gray-500'}`}>
                        {level.label}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{level.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
          
          {/* The actual slider */}
          <Slider
            value={[difficulty]}
            min={1}
            max={5}
            step={0.1}
            onValueChange={(values) => setDifficulty(values[0])}
            className="mt-10"
          />
          
          {/* Animated glow effect when level completed */}
          {animate && (
            <div className="absolute inset-0 rounded-md bg-green-500 opacity-10 animate-pulse"></div>
          )}
        </div>
        
        {/* Current settings based on difficulty */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <div className="bg-blue-100 p-2 rounded-full">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Time per Question</p>
              <p className="text-2xl font-bold">{params.timePerQuestion}s</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <div className="bg-purple-100 p-2 rounded-full">
              <Trophy className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Points per Question</p>
              <p className="text-2xl font-bold">{params.pointsPerQuestion}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <div className="bg-amber-100 p-2 rounded-full">
              <Brain className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Total Questions</p>
              <p className="text-2xl font-bold">{params.totalQuestions}</p>
            </div>
          </div>
        </div>
        
        {/* Additional features based on difficulty */}
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant={params.hintAvailable ? "outline" : "secondary"} className="bg-white">
            <Lightbulb className={`h-3.5 w-3.5 mr-1 ${params.hintAvailable ? 'text-green-500' : 'text-gray-400'}`} />
            Hints {params.hintAvailable ? 'Available' : 'Unavailable'}
          </Badge>
          
          <Badge variant={params.skipAllowed ? "outline" : "secondary"} className="bg-white">
            <Zap className={`h-3.5 w-3.5 mr-1 ${params.skipAllowed ? 'text-green-500' : 'text-gray-400'}`} />
            Question Skip {params.skipAllowed ? 'Allowed' : 'Unavailable'}
          </Badge>
        </div>
      </CardContent>
      
      {showStartButton && (
        <CardFooter className="flex justify-between">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={() => handleCompleteDifficulty(Math.round(difficulty))}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Simulate Level Complete
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This simulates completing a level, which would typically be done after answering all questions correctly.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button 
            onClick={handleStartQuiz}
            className={`${currentLevel.color}`}
          >
            Start Quiz <Trophy className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}