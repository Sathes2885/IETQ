import { useState } from 'react';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UploadCloud, Upload, X } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface TeacherCreateProps {
  user: {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'teacher' | 'student';
    grade?: string;
  };
}

export default function TeacherCreate({ user }: TeacherCreateProps) {
  const [activeTab, setActiveTab] = useState('course');
  const { toast } = useToast();
  
  // Create course state
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseSubject, setCourseSubject] = useState('');
  const [courseGrade, setCourseGrade] = useState('');
  const [courseThumbnail, setCourseThumbnail] = useState<File | null>(null);
  
  // Create quiz state
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [quizSubject, setQuizSubject] = useState('');
  const [quizGrade, setQuizGrade] = useState('');
  const [quizType, setQuizType] = useState('anytime');
  const [quizDuration, setQuizDuration] = useState('30');
  
  // Create competition state
  const [competitionTitle, setCompetitionTitle] = useState('');
  const [competitionDescription, setCompetitionDescription] = useState('');
  const [competitionCategory, setCompetitionCategory] = useState('');
  const [competitionStart, setCompetitionStart] = useState('');
  const [competitionEnd, setCompetitionEnd] = useState('');

  const createCourseMutation = useMutation({
    mutationFn: async (data: any) => {
      // Mock successful creation
      return { success: true, id: Math.floor(Math.random() * 1000) };
    },
    onSuccess: () => {
      toast({
        title: "Course created successfully",
        description: "Your new course has been created and is ready for students.",
      });
      // Reset form
      setCourseTitle('');
      setCourseDescription('');
      setCourseSubject('');
      setCourseGrade('');
      setCourseThumbnail(null);
    },
    onError: () => {
      toast({
        title: "Failed to create course",
        description: "There was an error creating your course. Please try again.",
        variant: "destructive",
      });
    }
  });

  const createQuizMutation = useMutation({
    mutationFn: async (data: any) => {
      // Mock successful creation
      return { success: true, id: Math.floor(Math.random() * 1000) };
    },
    onSuccess: () => {
      toast({
        title: "Quiz created successfully",
        description: "Your new quiz has been created and is ready for students.",
      });
      // Reset form
      setQuizTitle('');
      setQuizDescription('');
      setQuizSubject('');
      setQuizGrade('');
      setQuizType('anytime');
      setQuizDuration('30');
    },
    onError: () => {
      toast({
        title: "Failed to create quiz",
        description: "There was an error creating your quiz. Please try again.",
        variant: "destructive",
      });
    }
  });

  const createCompetitionMutation = useMutation({
    mutationFn: async (data: any) => {
      // Mock successful creation
      return { success: true, id: Math.floor(Math.random() * 1000) };
    },
    onSuccess: () => {
      toast({
        title: "Competition created successfully",
        description: "Your new competition has been created and is ready for students.",
      });
      // Reset form
      setCompetitionTitle('');
      setCompetitionDescription('');
      setCompetitionCategory('');
      setCompetitionStart('');
      setCompetitionEnd('');
    },
    onError: () => {
      toast({
        title: "Failed to create competition",
        description: "There was an error creating your competition. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCourseMutation.mutate({
      title: courseTitle,
      description: courseDescription,
      subject: courseSubject,
      grade: courseGrade,
      thumbnail: courseThumbnail,
    });
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createQuizMutation.mutate({
      title: quizTitle,
      description: quizDescription,
      subject: quizSubject,
      grade: quizGrade,
      type: quizType,
      duration: quizDuration,
    });
  };

  const handleCompetitionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCompetitionMutation.mutate({
      title: competitionTitle,
      description: competitionDescription,
      category: competitionCategory,
      startDate: competitionStart,
      endDate: competitionEnd,
    });
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCourseThumbnail(e.target.files[0]);
    }
  };

  const removeThumbnail = () => {
    setCourseThumbnail(null);
  };

  return (
    <DashboardLayout user={user}>
      <Helmet>
        <title>Create Content | IETQ Teacher Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Content</h1>
          <p className="text-muted-foreground mt-2">
            Create new learning material for your students - courses, quizzes, or competitions.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="course">Course</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
            <TabsTrigger value="competition">Competition</TabsTrigger>
          </TabsList>
          
          {/* Course Creation */}
          <TabsContent value="course">
            <Card>
              <CardHeader>
                <CardTitle>Create a New Course</CardTitle>
                <CardDescription>
                  Design comprehensive learning journeys for your students with engaging content.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleCourseSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="courseTitle">Course Title</Label>
                    <Input 
                      id="courseTitle" 
                      placeholder="e.g., Introduction to Algebra" 
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="courseDescription">Description</Label>
                    <Textarea 
                      id="courseDescription" 
                      placeholder="Provide a brief description of your course" 
                      rows={4} 
                      value={courseDescription}
                      onChange={(e) => setCourseDescription(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="courseSubject">Subject</Label>
                      <Select value={courseSubject} onValueChange={setCourseSubject} required>
                        <SelectTrigger id="courseSubject">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mathematics">Mathematics</SelectItem>
                          <SelectItem value="science">Science</SelectItem>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="history">History</SelectItem>
                          <SelectItem value="geography">Geography</SelectItem>
                          <SelectItem value="art">Art</SelectItem>
                          <SelectItem value="music">Music</SelectItem>
                          <SelectItem value="computer_science">Computer Science</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="courseGrade">Grade Level</Label>
                      <Select value={courseGrade} onValueChange={setCourseGrade} required>
                        <SelectTrigger id="courseGrade">
                          <SelectValue placeholder="Select a grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Grade 1</SelectItem>
                          <SelectItem value="2">Grade 2</SelectItem>
                          <SelectItem value="3">Grade 3</SelectItem>
                          <SelectItem value="4">Grade 4</SelectItem>
                          <SelectItem value="5">Grade 5</SelectItem>
                          <SelectItem value="6">Grade 6</SelectItem>
                          <SelectItem value="7">Grade 7</SelectItem>
                          <SelectItem value="8">Grade 8</SelectItem>
                          <SelectItem value="9">Grade 9</SelectItem>
                          <SelectItem value="10">Grade 10</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="courseThumbnail">Course Thumbnail</Label>
                    {!courseThumbnail ? (
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <Input
                          id="courseThumbnail"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleThumbnailChange}
                        />
                        <Label htmlFor="courseThumbnail" className="cursor-pointer flex flex-col items-center gap-2">
                          <UploadCloud className="h-10 w-10 text-muted-foreground" />
                          <span className="text-sm font-medium">Click to upload an image</span>
                          <span className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (Max 2MB)</span>
                        </Label>
                      </div>
                    ) : (
                      <div className="relative border rounded-lg p-2">
                        <div className="flex items-center gap-2">
                          <Upload className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm">{courseThumbnail.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2"
                            onClick={removeThumbnail}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => {
                    setCourseTitle('');
                    setCourseDescription('');
                    setCourseSubject('');
                    setCourseGrade('');
                    setCourseThumbnail(null);
                  }}>
                    Clear
                  </Button>
                  <Button type="submit" disabled={createCourseMutation.isPending}>
                    {createCourseMutation.isPending ? "Creating..." : "Create Course"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          {/* Quiz Creation */}
          <TabsContent value="quiz">
            <Card>
              <CardHeader>
                <CardTitle>Create a New Quiz</CardTitle>
                <CardDescription>
                  Craft assessments to test your students' knowledge and track their progress.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleQuizSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="quizTitle">Quiz Title</Label>
                    <Input 
                      id="quizTitle" 
                      placeholder="e.g., Unit 3 Assessment" 
                      value={quizTitle}
                      onChange={(e) => setQuizTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quizDescription">Description</Label>
                    <Textarea 
                      id="quizDescription" 
                      placeholder="Briefly describe what this quiz will cover" 
                      rows={3} 
                      value={quizDescription}
                      onChange={(e) => setQuizDescription(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quizSubject">Subject</Label>
                      <Select value={quizSubject} onValueChange={setQuizSubject} required>
                        <SelectTrigger id="quizSubject">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mathematics">Mathematics</SelectItem>
                          <SelectItem value="science">Science</SelectItem>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="history">History</SelectItem>
                          <SelectItem value="geography">Geography</SelectItem>
                          <SelectItem value="art">Art</SelectItem>
                          <SelectItem value="music">Music</SelectItem>
                          <SelectItem value="computer_science">Computer Science</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="quizGrade">Grade Level</Label>
                      <Select value={quizGrade} onValueChange={setQuizGrade} required>
                        <SelectTrigger id="quizGrade">
                          <SelectValue placeholder="Select a grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Grade 1</SelectItem>
                          <SelectItem value="2">Grade 2</SelectItem>
                          <SelectItem value="3">Grade 3</SelectItem>
                          <SelectItem value="4">Grade 4</SelectItem>
                          <SelectItem value="5">Grade 5</SelectItem>
                          <SelectItem value="6">Grade 6</SelectItem>
                          <SelectItem value="7">Grade 7</SelectItem>
                          <SelectItem value="8">Grade 8</SelectItem>
                          <SelectItem value="9">Grade 9</SelectItem>
                          <SelectItem value="10">Grade 10</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quizType">Quiz Type</Label>
                      <Select value={quizType} onValueChange={setQuizType} required>
                        <SelectTrigger id="quizType">
                          <SelectValue placeholder="Select quiz type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="anytime">Anytime (Self-paced)</SelectItem>
                          <SelectItem value="scheduled">Scheduled (Timed)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="quizDuration">Duration (minutes)</Label>
                      <Input 
                        id="quizDuration" 
                        type="number" 
                        min={5} 
                        max={180} 
                        value={quizDuration}
                        onChange={(e) => setQuizDuration(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => {
                    setQuizTitle('');
                    setQuizDescription('');
                    setQuizSubject('');
                    setQuizGrade('');
                    setQuizType('anytime');
                    setQuizDuration('30');
                  }}>
                    Clear
                  </Button>
                  <Button type="submit" disabled={createQuizMutation.isPending}>
                    {createQuizMutation.isPending ? "Creating..." : "Create & Add Questions"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          {/* Competition Creation */}
          <TabsContent value="competition">
            <Card>
              <CardHeader>
                <CardTitle>Create a New Competition</CardTitle>
                <CardDescription>
                  Organize engaging challenges to motivate students and showcase their skills.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleCompetitionSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="competitionTitle">Competition Title</Label>
                    <Input 
                      id="competitionTitle" 
                      placeholder="e.g., National Science Olympiad" 
                      value={competitionTitle}
                      onChange={(e) => setCompetitionTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="competitionDescription">Description</Label>
                    <Textarea 
                      id="competitionDescription" 
                      placeholder="Describe the competition, goals, and criteria for winning" 
                      rows={4} 
                      value={competitionDescription}
                      onChange={(e) => setCompetitionDescription(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="competitionCategory">Category</Label>
                    <Select value={competitionCategory} onValueChange={setCompetitionCategory} required>
                      <SelectTrigger id="competitionCategory">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="spelling_bee">Spelling Bee</SelectItem>
                        <SelectItem value="essay_writing">Essay Writing</SelectItem>
                        <SelectItem value="art">Art & Design</SelectItem>
                        <SelectItem value="coding">Coding & Robotics</SelectItem>
                        <SelectItem value="music">Music</SelectItem>
                        <SelectItem value="debate">Debate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="competitionStart">Start Date</Label>
                      <Input 
                        id="competitionStart" 
                        type="date" 
                        value={competitionStart}
                        onChange={(e) => setCompetitionStart(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="competitionEnd">End Date</Label>
                      <Input 
                        id="competitionEnd" 
                        type="date" 
                        value={competitionEnd}
                        onChange={(e) => setCompetitionEnd(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => {
                    setCompetitionTitle('');
                    setCompetitionDescription('');
                    setCompetitionCategory('');
                    setCompetitionStart('');
                    setCompetitionEnd('');
                  }}>
                    Clear
                  </Button>
                  <Button type="submit" disabled={createCompetitionMutation.isPending}>
                    {createCompetitionMutation.isPending ? "Creating..." : "Create Competition"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}