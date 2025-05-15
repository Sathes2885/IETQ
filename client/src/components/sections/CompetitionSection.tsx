import React from 'react';
import { cn } from '@/lib/utils';
import { FlipCardSection } from '@/components/ui/flip-card';
import { Button } from '@/components/ui/button';
import { Award, Calendar, Clock, Users, Star, Trophy, Medal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function CompetitionSection() {
  const competitions = [
    {
      id: 1,
      title: "National Science Olympiad",
      description: "Test your knowledge across various scientific disciplines and compete with students nationwide.",
      category: "Science",
      deadline: "October 15, 2025",
      prizes: "₹1,00,000 in prizes",
      eligibility: "Grades 6-10",
      participants: 5000,
      badge: "Popular"
    },
    {
      id: 2,
      title: "Young Mathematicians Challenge",
      description: "Solve complex mathematical problems in this prestigious competition for young math enthusiasts.",
      category: "Mathematics",
      deadline: "September 30, 2025",
      prizes: "₹75,000 in prizes",
      eligibility: "Grades 4-9",
      participants: 3800,
      badge: "Trending"
    },
    {
      id: 3,
      title: "Creative Writing Contest",
      description: "Express your creativity through stories, poems, and essays in this nationwide writing competition.",
      category: "Language Arts",
      deadline: "November 10, 2025",
      prizes: "₹50,000 in prizes",
      eligibility: "All grades",
      participants: 4200,
      badge: "New"
    },
    {
      id: 4,
      title: "Coding Challenge Championship",
      description: "Showcase your programming skills and solve real-world problems through code.",
      category: "Computer Science",
      deadline: "December 5, 2025",
      prizes: "₹1,25,000 in prizes",
      eligibility: "Grades 7-10",
      participants: 3500,
      badge: "Featured"
    }
  ];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Popular': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Trending': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'New': return 'bg-green-100 text-green-800 border-green-200';
      case 'Featured': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'Popular': return <Users className="w-3 h-3 mr-1" />;
      case 'Trending': return <Star className="w-3 h-3 mr-1" />;
      case 'New': return <Clock className="w-3 h-3 mr-1" />;
      case 'Featured': return <Trophy className="w-3 h-3 mr-1" />;
      default: return <Medal className="w-3 h-3 mr-1" />;
    }
  };

  const cards = competitions.map(competition => ({
    id: competition.id,
    frontContent: (
      <div className="p-6 bg-white h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900">{competition.title}</h3>
          <Badge className={cn("flex items-center", getBadgeColor(competition.badge))}>
            {getBadgeIcon(competition.badge)}
            {competition.badge}
          </Badge>
        </div>
        <p className="text-gray-600 mb-4 flex-grow">{competition.description}</p>
        <div className="text-sm text-gray-500 mt-auto">
          <div className="flex items-center mb-1">
            <Award className="w-4 h-4 mr-2 text-primary" />
            <span>{competition.category}</span>
          </div>
          <div className="flex items-center mb-1">
            <Calendar className="w-4 h-4 mr-2 text-primary" />
            <span>Deadline: {competition.deadline}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-primary" />
            <span>{competition.participants.toLocaleString()} participants</span>
          </div>
        </div>
      </div>
    ),
    backContent: (
      <div className="p-6 bg-gradient-to-br from-primary to-primary-800 h-full flex flex-col text-white">
        <h3 className="text-xl font-bold mb-4">{competition.title}</h3>
        <div className="mb-4">
          <p className="font-semibold">Prizes:</p>
          <p>{competition.prizes}</p>
        </div>
        <div className="mb-4">
          <p className="font-semibold">Eligibility:</p>
          <p>{competition.eligibility}</p>
        </div>
        <Button className="mt-auto bg-white text-primary hover:bg-gray-100">
          Register Now
        </Button>
      </div>
    ),
    frontClassName: "bg-white",
    backClassName: "bg-primary"
  }));

  return (
    <FlipCardSection
      title="Participate in National Competitions"
      subtitle="Showcase your skills, compete with peers across India, and win exciting prizes in these prestigious competitions."
      cards={cards}
      columns={4}
      backgroundColor="#f0f4f8"
      textColor="text-gray-800"
      className="py-20"
    />
  );
}