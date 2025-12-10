import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StudentSidebar } from "@/components/StudentSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { 
  Upload, 
  Bot, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  Trophy, 
  Flame, 
  Star,
  BookOpen,
  Target,
  Zap,
  ArrowRight,
  RotateCcw,
  HelpCircle,
  Loader2
} from "lucide-react";
import confetti from "canvas-confetti";

interface Exercise {
  id: number;
  type: 'multiple-choice' | 'fill-blank' | 'true-false' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string | boolean;
  explanation?: string;
  hint?: string;
  keywords?: string[];
  points: number;
}

interface LearningSession {
  id: string;
  fileName: string;
  exercises: Exercise[];
  topic: string;
  summary: string;
  totalPoints: number;
}

const StudentLearning = () => {
  const sidebarContent = <StudentSidebar />;
  
  // State
  const [session, setSession] = useState<LearningSession | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [xp, setXp] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState("");
  const [sessionComplete, setSessionComplete] = useState(false);
  
  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [exerciseType, setExerciseType] = useState("mixed");
  const [difficulty, setDifficulty] = useState("medium");
  const [exerciseCount, setExerciseCount] = useState("5");

  const currentExercise = session?.exercises[currentExerciseIndex];
  const progress = session ? ((currentExerciseIndex) / session.exercises.length) * 100 : 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      toast({ title: "Invalid file", description: "Please select a PDF file", variant: "destructive" });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({ title: "No file selected", description: "Please select a PDF file first", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("pdf", selectedFile);
      formData.append("exerciseType", exerciseType);
      formData.append("difficulty", difficulty);
      formData.append("count", exerciseCount);

      const response = await api.upload("/learning/upload", formData);
      
      setSession(response);
      setCurrentExerciseIndex(0);
      setScore(0);
      setStreak(0);
      setHearts(5);
      setXp(0);
      setSessionComplete(false);
      
      toast({ title: "Exercises generated!", description: `${response.exercises.length} exercises created from your PDF` });
    } catch (error: any) {
      console.error(error);
      toast({ title: "Error", description: error.message || "Failed to generate exercises", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const checkAnswer = async () => {
    if (!currentExercise || !userAnswer) return;

    setIsChecking(true);
    try {
      const response = await api.post("/learning/check-answer", {
        exercise: currentExercise,
        userAnswer: currentExercise.type === 'true-false' 
          ? userAnswer === 'true' 
          : userAnswer
      });

      setIsCorrect(response.isCorrect);
      setFeedback(response.feedback);
      setShowResult(true);

      if (response.isCorrect) {
        setScore(prev => prev + response.score);
        setStreak(prev => prev + 1);
        setXp(prev => prev + (response.score * (1 + streak * 0.1)));
        
        // Celebration for streaks
        if (streak > 0 && streak % 3 === 2) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } else {
        setStreak(0);
        setHearts(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to check answer", variant: "destructive" });
    } finally {
      setIsChecking(false);
    }
  };

  const nextExercise = () => {
    if (currentExerciseIndex < (session?.exercises.length || 0) - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setUserAnswer("");
      setShowResult(false);
      setShowHint(false);
      setHint("");
    } else {
      // Session complete
      setSessionComplete(true);
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 }
      });
    }
  };

  const getHint = async () => {
    if (!currentExercise) return;

    try {
      const response = await api.post("/learning/get-hint", { exercise: currentExercise });
      setHint(response.hint);
      setShowHint(true);
      setHearts(prev => Math.max(0, prev - 0.5)); // Using hint costs half a heart
    } catch (error) {
      toast({ title: "Error", description: "Failed to get hint", variant: "destructive" });
    }
  };

  const restartSession = () => {
    setCurrentExerciseIndex(0);
    setUserAnswer("");
    setShowResult(false);
    setScore(0);
    setStreak(0);
    setHearts(5);
    setSessionComplete(false);
  };

  const startNewSession = () => {
    setSession(null);
    setSelectedFile(null);
    setSessionComplete(false);
  };

  // Render upload screen
  if (!session) {
    return (
      <DashboardLayout sidebar={sidebarContent} title="AI Learning">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <Bot className="w-16 h-16 mx-auto text-emerald-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              AI-Powered Learning
            </h1>
            <p className="text-muted-foreground text-lg">
              Upload your study materials and practice with AI-generated exercises
            </p>
          </div>

          {/* Upload Card */}
          <Card className="border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* File Upload */}
                <div className="text-center">
                  <Label 
                    htmlFor="pdf-upload" 
                    className="cursor-pointer block p-8 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <p className="font-medium text-lg">
                      {selectedFile ? selectedFile.name : "Click to upload PDF"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : "Max 10MB"}
                    </p>
                  </Label>
                  <Input 
                    id="pdf-upload" 
                    type="file" 
                    accept=".pdf" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                </div>

                {/* Options */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Exercise Type</Label>
                    <Select value={exerciseType} onValueChange={setExerciseType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mixed">Mixed</SelectItem>
                        <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                        <SelectItem value="fill-blank">Fill in the Blank</SelectItem>
                        <SelectItem value="true-false">True/False</SelectItem>
                        <SelectItem value="short-answer">Short Answer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Difficulty</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Number of Exercises</Label>
                    <Select value={exerciseCount} onValueChange={setExerciseCount}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 exercises</SelectItem>
                        <SelectItem value="5">5 exercises</SelectItem>
                        <SelectItem value="10">10 exercises</SelectItem>
                        <SelectItem value="15">15 exercises</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Generate Button */}
                <Button 
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  onClick={handleUpload}
                  disabled={!selectedFile || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating exercises...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Exercises
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200">
              <CardContent className="pt-6 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold">Personalized</h3>
                <p className="text-sm text-muted-foreground">Exercises tailored to your material</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200">
              <CardContent className="pt-6 text-center">
                <Zap className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-semibold">AI-Powered</h3>
                <p className="text-sm text-muted-foreground">Smart exercise generation</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200">
              <CardContent className="pt-6 text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <h3 className="font-semibold">Gamified</h3>
                <p className="text-sm text-muted-foreground">Earn XP and maintain streaks</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Render session complete screen
  if (sessionComplete) {
    const percentage = Math.round((score / session.totalPoints) * 100);
    const grade = percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : percentage >= 60 ? 'D' : 'F';
    
    return (
      <DashboardLayout sidebar={sidebarContent} title="AI Learning">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg animate-bounce">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          
          <div>
            <h1 className="text-4xl font-bold mb-2">Session Complete! 🎉</h1>
            <p className="text-xl text-muted-foreground">{session.topic}</p>
          </div>

          <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-4xl font-bold text-primary">{score}</p>
                  <p className="text-sm text-muted-foreground">Points Earned</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-yellow-500">{Math.round(xp)}</p>
                  <p className="text-sm text-muted-foreground">XP Gained</p>
                </div>
                <div>
                  <p className="text-4xl font-bold" style={{ color: percentage >= 70 ? '#22c55e' : '#ef4444' }}>
                    {grade}
                  </p>
                  <p className="text-sm text-muted-foreground">{percentage}% Correct</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-8 h-8 ${i < Math.ceil(percentage / 20) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" size="lg" onClick={restartSession}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button size="lg" onClick={startNewSession} className="bg-gradient-to-r from-green-500 to-emerald-600">
              <BookOpen className="w-4 h-4 mr-2" />
              New Material
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Render exercise screen
  return (
    <DashboardLayout sidebar={sidebarContent} title="AI Learning">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={startNewSession}>
            ← Exit
          </Button>
          
          <div className="flex items-center gap-4">
            {/* Hearts */}
            <div className="flex items-center gap-1 text-red-500">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < hearts ? "opacity-100" : "opacity-30"}>❤️</span>
              ))}
            </div>
            
            {/* Streak */}
            <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-bold text-orange-600">{streak}</span>
            </div>
            
            {/* XP */}
            <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="font-bold text-yellow-600">{Math.round(xp)} XP</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-center text-muted-foreground">
            Question {currentExerciseIndex + 1} of {session.exercises.length}
          </p>
        </div>

        {/* Exercise Card */}
        {currentExercise && (
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant={
                  currentExercise.type === 'multiple-choice' ? 'default' :
                  currentExercise.type === 'fill-blank' ? 'secondary' :
                  currentExercise.type === 'true-false' ? 'outline' : 'destructive'
                }>
                  {currentExercise.type.replace('-', ' ').toUpperCase()}
                </Badge>
                <Badge variant="outline">{currentExercise.points} pts</Badge>
              </div>
              <CardTitle className="text-xl mt-4">{currentExercise.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Answer Input based on type */}
              {currentExercise.type === 'multiple-choice' && currentExercise.options && (
                <RadioGroup 
                  value={userAnswer} 
                  onValueChange={setUserAnswer}
                  disabled={showResult}
                  className="space-y-3"
                >
                  {currentExercise.options.map((option, i) => (
                    <div 
                      key={i}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer
                        ${showResult && option === currentExercise.correctAnswer ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : ''}
                        ${showResult && userAnswer === option && option !== currentExercise.correctAnswer ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : ''}
                        ${!showResult && userAnswer === option ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}
                      `}
                    >
                      <RadioGroupItem value={option} id={`option-${i}`} />
                      <Label htmlFor={`option-${i}`} className="flex-1 cursor-pointer font-medium">
                        {option}
                      </Label>
                      {showResult && option === currentExercise.correctAnswer && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {showResult && userAnswer === option && option !== currentExercise.correctAnswer && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  ))}
                </RadioGroup>
              )}

              {currentExercise.type === 'true-false' && (
                <RadioGroup 
                  value={userAnswer} 
                  onValueChange={setUserAnswer}
                  disabled={showResult}
                  className="flex gap-4"
                >
                  {['true', 'false'].map((option) => (
                    <div 
                      key={option}
                      className={`flex-1 flex items-center justify-center space-x-3 p-6 rounded-lg border-2 transition-all cursor-pointer
                        ${showResult && String(currentExercise.correctAnswer) === option ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : ''}
                        ${showResult && userAnswer === option && String(currentExercise.correctAnswer) !== option ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : ''}
                        ${!showResult && userAnswer === option ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}
                      `}
                    >
                      <RadioGroupItem value={option} id={`tf-${option}`} />
                      <Label htmlFor={`tf-${option}`} className="text-lg font-bold cursor-pointer">
                        {option === 'true' ? '✓ TRUE' : '✗ FALSE'}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {currentExercise.type === 'fill-blank' && (
                <Input
                  placeholder="Type your answer..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={showResult}
                  className={`text-lg h-14 ${
                    showResult && isCorrect ? 'border-green-500 bg-green-50' : 
                    showResult && !isCorrect ? 'border-red-500 bg-red-50' : ''
                  }`}
                />
              )}

              {currentExercise.type === 'short-answer' && (
                <Textarea
                  placeholder="Write your answer..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={showResult}
                  rows={4}
                  className={`text-lg ${
                    showResult && isCorrect ? 'border-green-500 bg-green-50' : 
                    showResult && !isCorrect ? 'border-red-500 bg-red-50' : ''
                  }`}
                />
              )}

              {/* Hint */}
              {showHint && hint && (
                <div className="flex items-start gap-2 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200">
                  <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <p className="text-sm">{hint}</p>
                </div>
              )}

              {/* Result Feedback */}
              {showResult && (
                <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-950/20 border border-green-200' : 'bg-red-50 dark:bg-red-950/20 border border-red-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-bold text-green-600">Correct!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span className="font-bold text-red-600">Not quite right</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm">{feedback}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {!showResult ? (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={getHint}
                      disabled={showHint}
                      className="flex-1"
                    >
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Get Hint (-0.5 ❤️)
                    </Button>
                    <Button 
                      onClick={checkAnswer}
                      disabled={!userAnswer || isChecking}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600"
                    >
                      {isChecking ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Check Answer
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={nextExercise}
                    className="w-full h-12 text-lg bg-gradient-to-r from-green-500 to-emerald-600"
                  >
                    {currentExerciseIndex < session.exercises.length - 1 ? (
                      <>
                        Continue
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    ) : (
                      <>
                        <Trophy className="w-5 h-5 mr-2" />
                        Finish Session
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Topic Info */}
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">
              <strong>Topic:</strong> {session.topic}
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentLearning;
