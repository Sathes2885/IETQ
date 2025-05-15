import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRewards, triggerAchievement, triggerMilestone, triggerCertificate, triggerPrize } from '@/components/rewards/RewardManager';
import { BuilderComponent, builder, useIsPreviewing } from '@builder.io/react';
import type { BuilderContent } from '@builder.io/sdk';
import { Separator } from '@/components/ui/separator';

// If you were editing this in Builder.io, this would be your page model
const BUILDER_MODEL = 'page';

export default function RewardsDemo() {
  const rewards = useRewards();
  const isPreviewing = useIsPreviewing();
  const [builderContentJson, setBuilderContentJson] = useState<BuilderContent | undefined>(undefined);
  
  // Load Builder content
  React.useEffect(() => {
    async function fetchContent() {
      try {
        const content = await builder
          .get(BUILDER_MODEL, {
            url: window.location.pathname,
            cachebust: true
          })
          .promise();
        
        // Cast the content to the expected type
        setBuilderContentJson(content as BuilderContent);
      } catch (error) {
        console.error('Error loading Builder.io content:', error);
      }
    }
    
    fetchContent();
  }, []);
  
  // Demo achievements
  const achievements = [
    {
      title: 'First Login',
      description: 'Welcome to the IETQ platform!',
      points: 10,
      type: 'achievement'
    },
    {
      title: 'Quiz Master',
      description: 'Successfully completed 5 quizzes with perfect scores',
      points: 50,
      type: 'achievement'
    },
    {
      title: '7-Day Streak',
      description: 'Logged in for 7 consecutive days',
      points: 25,
      type: 'milestone'
    },
    {
      title: 'Science Explorer Certificate',
      description: 'Completed the Science Explorer course with distinction',
      image: 'https://images.unsplash.com/photo-1623017487851-3435e50c8624?q=80&w=2070',
      type: 'certificate'
    },
    {
      title: 'Math Champion',
      description: 'Won first place in the National Math Competition',
      points: 200,
      image: 'https://images.unsplash.com/photo-1596496181871-9681eacf9764?q=80&w=1974',
      type: 'prize'
    },
  ];
  
  // Show a specific achievement
  const showAchievement = (achievement: any) => {
    switch(achievement.type) {
      case 'achievement':
        triggerAchievement(rewards, achievement.title, achievement.description, achievement.points);
        break;
      case 'milestone':
        triggerMilestone(rewards, achievement.title, achievement.description, achievement.points);
        break;
      case 'certificate':
        triggerCertificate(rewards, achievement.title, achievement.description, achievement.image);
        break;
      case 'prize':
        triggerPrize(rewards, achievement.title, achievement.description, achievement.image, achievement.points);
        break;
      default:
        triggerAchievement(rewards, achievement.title, achievement.description, achievement.points);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Rewards System Demo</h1>
      
      <Tabs defaultValue="rewards" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="rewards">Rewards Demo</TabsTrigger>
          <TabsTrigger value="builder">Builder.io Integration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rewards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contextual Reward Popups</CardTitle>
              <CardDescription>
                Click on any reward below to see the animated popup notification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className={`
                      ${achievement.type === 'achievement' ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                      ${achievement.type === 'milestone' ? 'bg-purple-50 dark:bg-purple-900/20' : ''}
                      ${achievement.type === 'certificate' ? 'bg-green-50 dark:bg-green-900/20' : ''}
                      ${achievement.type === 'prize' ? 'bg-amber-50 dark:bg-amber-900/20' : ''}
                    `}>
                      <CardTitle className="text-lg">{achievement.title}</CardTitle>
                      <CardDescription>{achievement.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between items-center pt-4">
                      <div className="text-sm font-medium">
                        {achievement.points && `${achievement.points} points`}
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => showAchievement(achievement)}
                        className={`
                          ${achievement.type === 'achievement' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                          ${achievement.type === 'milestone' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                          ${achievement.type === 'certificate' ? 'bg-green-600 hover:bg-green-700' : ''}
                          ${achievement.type === 'prize' ? 'bg-amber-600 hover:bg-amber-700' : ''}
                        `}
                      >
                        Trigger
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Customize Rewards</CardTitle>
              <CardDescription>
                Create your own reward popup with custom parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <Button 
                  className="w-full md:w-auto"
                  onClick={() => triggerAchievement(
                    rewards, 
                    'Custom Achievement', 
                    'This is a custom achievement with your own text and points',
                    75
                  )}
                >
                  Custom Achievement
                </Button>
                <Button
                  variant="outline"
                  className="w-full md:w-auto"
                  onClick={() => triggerPrize(
                    rewards,
                    'Special Prize',
                    'You won a special prize for excellent performance!',
                    undefined,
                    100
                  )}
                >
                  Prize with Points
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="builder" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Builder.io Visual Editor Integration</CardTitle>
              <CardDescription>
                Content below can be edited using the Builder.io visual editor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border p-4 rounded-md min-h-[200px]">
                {isPreviewing && <div className="text-sm font-medium text-blue-500 mb-4">Preview Mode Active</div>}
                
                {/* Builder.io editable content */}
                <BuilderComponent 
                  model={BUILDER_MODEL} 
                  content={builderContentJson} 
                  options={{ includeRefs: true }}
                >
                  {/* Default content when no Builder content exists */}
                  <div className="text-center py-8">
                    <h3 className="text-xl font-medium mb-2">This content is editable with Builder.io</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      This section can be customized using the visual editor without changing code.
                    </p>
                    <Separator className="my-4" />
                    <p className="text-sm">
                      Go to Builder.io, create a section for this page, and it will appear here.
                    </p>
                  </div>
                </BuilderComponent>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}