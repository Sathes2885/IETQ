import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  BellRing,
  UserCircle,
  Lock,
  Globe,
  Moon,
  Eye,
  Save,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function StudentSettings({ user }: { user: any }) {
  // Log user data to verify
  console.log("SettingsPage received user:", user);
  
  // Format user data to match DashboardLayout props interface
  const dashboardUser = user ? {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as 'admin' | 'teacher' | 'student',
    grade: user.grade === null ? undefined : user.grade
  } : undefined;

  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profileImage: '',
    language: 'english',
    theme: 'system',
    grade: user?.grade || '',
    notifications: {
      emailUpdates: true,
      newCompetitions: true,
      upcomingQuizzes: true,
      courseCompletion: true
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked
      }
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Settings Updated",
      description: "Your settings have been saved successfully.",
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
    
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  return (
    <DashboardLayout user={dashboardUser}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display tracking-tight mb-1">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserCircle className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Globe className="h-4 w-4" /> Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <DashboardCard>
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Basic Information</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade</Label>
                    <Select 
                      value={formData.grade} 
                      onValueChange={(value) => handleSelectChange('grade', value)}
                    >
                      <SelectTrigger id="grade">
                        <SelectValue placeholder="Select grade" />
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
                
                <div className="flex justify-end">
                  <Button type="submit" className="gap-2">
                    <Save className="h-4 w-4" /> Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </DashboardCard>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <DashboardCard>
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Change Password</h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" className="gap-2">
                    <RefreshCw className="h-4 w-4" /> Update Password
                  </Button>
                </div>
              </form>
              
              <Separator className="my-6" />
              
              <h3 className="text-lg font-medium mb-4">Account Actions</h3>
              <div className="space-y-4">
                <Button variant="destructive" className="gap-2">
                  <LogOut className="h-4 w-4" /> Sign Out from All Devices
                </Button>
              </div>
            </div>
          </DashboardCard>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <DashboardCard>
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">App Preferences</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Theme</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Choose your preferred theme
                      </p>
                    </div>
                    <Select 
                      value={formData.theme} 
                      onValueChange={(value) => handleSelectChange('theme', value)}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Language</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Set your preferred language
                      </p>
                    </div>
                    <Select 
                      value={formData.language} 
                      onValueChange={(value) => handleSelectChange('language', value)}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="hindi">Hindi</SelectItem>
                        <SelectItem value="tamil">Tamil</SelectItem>
                        <SelectItem value="telugu">Telugu</SelectItem>
                        <SelectItem value="bengali">Bengali</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-base font-medium mb-3 flex items-center gap-2">
                    <BellRing className="h-4 w-4" /> Notifications
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="emailUpdates">Email updates and newsletters</Label>
                      <Switch 
                        id="emailUpdates" 
                        checked={formData.notifications.emailUpdates}
                        onCheckedChange={(checked) => handleSwitchChange('emailUpdates', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="newCompetitions">New competition announcements</Label>
                      <Switch 
                        id="newCompetitions" 
                        checked={formData.notifications.newCompetitions}
                        onCheckedChange={(checked) => handleSwitchChange('newCompetitions', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="upcomingQuizzes">Upcoming quiz reminders</Label>
                      <Switch 
                        id="upcomingQuizzes" 
                        checked={formData.notifications.upcomingQuizzes}
                        onCheckedChange={(checked) => handleSwitchChange('upcomingQuizzes', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="courseCompletion">Course completion certificates</Label>
                      <Switch 
                        id="courseCompletion" 
                        checked={formData.notifications.courseCompletion}
                        onCheckedChange={(checked) => handleSwitchChange('courseCompletion', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button className="gap-2" onClick={() => {
                  toast({
                    title: "Preferences Updated",
                    description: "Your preferences have been saved successfully.",
                  });
                }}>
                  <Save className="h-4 w-4" /> Save Preferences
                </Button>
              </div>
            </div>
          </DashboardCard>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}