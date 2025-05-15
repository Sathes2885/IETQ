import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Loader2, Search, Plus, Edit, Trash2, ExternalLink, Save, Eye, Code, Copy, Layout, Type, Image, Video, Grid, Box, Zap, Palette, Globe, FileText, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type ContentType = 'page' | 'section' | 'banner';
type ContentItem = {
  id: string;
  title: string;
  type: ContentType;
  lastUpdated: string;
  status: 'published' | 'draft';
  url?: string;
};

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState<string>('pages');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [openBuilderDialog, setOpenBuilderDialog] = useState<boolean>(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const { toast } = useToast();

  // Sample content items - in a real app these would come from Builder.io API
  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Home Page',
      type: 'page',
      lastUpdated: '2025-05-08',
      status: 'published',
      url: '/'
    },
    {
      id: '2',
      title: 'About Us',
      type: 'page',
      lastUpdated: '2025-05-07',
      status: 'published',
      url: '/about'
    },
    {
      id: '3',
      title: 'Hero Banner',
      type: 'banner',
      lastUpdated: '2025-05-06',
      status: 'published'
    },
    {
      id: '4',
      title: 'Competition Section',
      type: 'section',
      lastUpdated: '2025-05-05',
      status: 'draft'
    }
  ]);

  const filteredContent = contentItems.filter(item => {
    // Filter by tab
    const typeMatch = 
      (activeTab === 'pages' && item.type === 'page') ||
      (activeTab === 'sections' && item.type === 'section') ||
      (activeTab === 'banners' && item.type === 'banner') ||
      (activeTab === 'all');
      
    // Filter by search
    const searchMatch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    return typeMatch && searchMatch;
  });

  const handleCreateContent = (type: ContentType) => {
    // In a real app, this would create a new content item in Builder.io
    // and then redirect to the Builder.io editor
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newContent: ContentItem = {
        id: Math.random().toString(36).substring(2, 9),
        title: `New ${type} (Untitled)`,
        type: type,
        lastUpdated: new Date().toISOString().split('T')[0],
        status: 'draft'
      };
      
      setContentItems(prev => [newContent, ...prev]);
      setLoading(false);
      
      // Open Builder.io in a new tab
      const builderUrl = `https://builder.io/content/${type}s/edit/new`;
      window.open(builderUrl, '_blank');
      
      toast({
        title: 'Content Created',
        description: `A new ${type} has been created and opened in Builder.io`,
      });
    }, 1000);
  };

  const handleEditContent = (item: ContentItem) => {
    setSelectedContent(item);
    
    // In a real app, this would open the Builder.io editor for this content item
    const builderUrl = `https://builder.io/content/${item.type}s/edit/${item.id}`;
    window.open(builderUrl, '_blank');
    
    toast({
      title: 'Editing Content',
      description: `Opening ${item.title} in Builder.io editor`,
    });
  };

  const handleDeleteContent = (id: string) => {
    // In a real app, this would delete the content item from Builder.io
    setContentItems(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: 'Content Deleted',
      description: 'The content item has been deleted',
    });
  };

  const handleOpenBuilderEditor = () => {
    // In a real app, this would open the Builder.io dashboard
    window.open('https://builder.io/content', '_blank');
  };

  // For visual page builder simulation
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');
  const [showElementLibrary, setShowElementLibrary] = useState<boolean>(false);
  const [activeEditTab, setActiveEditTab] = useState<string>('content');
  const [iframeRef, setIframeRef] = useState<HTMLIFrameElement | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Sample site pages for the page selector
  const sitePages = [
    { id: 'home', name: 'Home', path: '/' },
    { id: 'about', name: 'About Us', path: '/about' },
    { id: 'competitions', name: 'Competitions', path: '/competitions' },
    { id: 'courses', name: 'Courses', path: '/courses' },
    { id: 'contact', name: 'Contact', path: '/contact' },
    { id: 'blog', name: 'Blog', path: '/blog' },
  ];

  // Sample element types for the element library
  const elementLibrary = [
    { id: 'heading', name: 'Heading', icon: <Type size={24} /> },
    { id: 'text', name: 'Text Block', icon: <FileText size={24} /> },
    { id: 'image', name: 'Image', icon: <Image size={24} /> },
    { id: 'button', name: 'Button', icon: <Box size={24} /> },
    { id: 'video', name: 'Video', icon: <Video size={24} /> },
    { id: 'column', name: 'Columns', icon: <Grid size={24} /> },
    { id: 'section', name: 'Section', icon: <Layout size={24} /> },
    { id: 'animation', name: 'Animation', icon: <Zap size={24} /> },
    { id: 'form', name: 'Form', icon: <FileText size={24} /> },
    { id: 'gallery', name: 'Gallery', icon: <Image size={24} /> },
    { id: 'slider', name: 'Slider', icon: <Layout size={24} /> },
    { id: 'social', name: 'Social Links', icon: <Globe size={24} /> },
  ];

  const handleEditInBuilder = () => {
    // This would actually open the page in Builder.io's visual editor
    // For now, we'll direct to their site
    window.open('https://builder.io/content', '_blank');
    
    toast({
      title: 'Opening Builder.io Editor',
      description: 'The visual editor is opening in a new tab'
    });
  };
  
  const handlePublishChanges = () => {
    toast({
      title: 'Changes Published',
      description: 'Your changes have been published to the live site',
    });
  };

  const handleAddElement = (elementType: string) => {
    // In a real implementation, this would add the element to the canvas
    setSelectedElement(elementType);
    setShowElementLibrary(false);
    
    toast({
      title: 'Element Added',
      description: `Added a new ${elementType} element to the page`,
    });
  };

  const handleCreateNewPage = () => {
    // In a real implementation, this would create a new page
    toast({
      title: 'Creating New Page',
      description: 'Opening the page creation wizard',
    });
    
    setTimeout(() => {
      handleEditInBuilder();
    }, 500);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
        {/* Top toolbar with site selector, actions and view modes */}
        <div className="border-b p-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1 w-44 justify-between">
                  <span>Home Page</span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Site Pages</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {sitePages.map(page => (
                  <DropdownMenuItem key={page.id} className="cursor-pointer">
                    {page.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="gap-1 text-primary cursor-pointer"
                  onClick={handleCreateNewPage}
                >
                  <Plus size={14} />
                  <span>Create New Page</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditorMode('edit')}
                    className={`${editorMode === 'edit' ? 'bg-gray-100' : ''}`}
                  >
                    <Edit size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit Mode</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditorMode('preview')}
                    className={`${editorMode === 'preview' ? 'bg-gray-100' : ''}`}
                  >
                    <Eye size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Preview Mode</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Separator orientation="vertical" className="h-6" />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm"
                    variant="ghost"
                    onClick={handleEditInBuilder}
                  >
                    <Code size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Open in Builder.io</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" onClick={() => {}}>
                    <Save size={16} className="mr-1" />
                    Save Draft
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save as Draft</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button onClick={handlePublishChanges}>
              Publish Changes
            </Button>
          </div>
        </div>

        {/* Main editor area with sidebar and preview */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left sidebar - Element library */}
          <div className={`w-[280px] border-r bg-gray-50 flex flex-col ${!showElementLibrary && editorMode === 'edit' ? '' : 'hidden'}`}>
            <div className="p-4 border-b bg-white">
              <h3 className="font-semibold">Elements</h3>
              <p className="text-xs text-gray-500">Drag elements onto the page</p>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="grid grid-cols-2 gap-2">
                {elementLibrary.map(element => (
                  <Button
                    key={element.id}
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-gray-100"
                    onClick={() => handleAddElement(element.name)}
                  >
                    <div className="text-primary">{element.icon}</div>
                    <span className="text-xs">{element.name}</span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Center - Visual page editor */}
          <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
            <div className="flex-1 overflow-auto p-4">
              <div className="bg-white rounded shadow-lg mx-auto" style={{ width: '100%', height: '100%' }}>
                <div className="w-full h-full border relative" ref={editorRef}>
                  <iframe
                    ref={(ref) => setIframeRef(ref)}
                    src="/"
                    className="w-full h-full"
                    style={{ pointerEvents: editorMode === 'preview' ? 'auto' : 'none' }}
                  />
                  
                  {editorMode === 'edit' && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="p-10 text-center text-gray-400">
                        <p className="mb-4">This is a simulated visual editor. In a real implementation, you would:</p>
                        <ul className="list-disc text-left inline-block">
                          <li>Drag elements from the left sidebar to this canvas</li>
                          <li>Edit text, images, and other content directly on the page</li>
                          <li>Use the right sidebar to customize the selected element</li>
                          <li>Modify global styles and theme settings</li>
                        </ul>
                        <div className="mt-6">
                          <Button
                            onClick={handleEditInBuilder}
                            className="pointer-events-auto"
                          >
                            Open Real Visual Editor
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar - Properties and settings */}
          {editorMode === 'edit' && (
            <div className="w-[300px] border-l bg-white flex flex-col">
              <Tabs value={activeEditTab} onValueChange={setActiveEditTab} className="flex-1 flex flex-col">
                <TabsList className="w-full justify-start px-4 pt-4 bg-transparent">
                  <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
                  <TabsTrigger value="style" className="flex-1">Style</TabsTrigger>
                  <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
                </TabsList>
                
                <ScrollArea className="flex-1 p-4">
                  <TabsContent value="content" className="mt-0 space-y-4">
                    {selectedElement ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="element-text">Text Content</Label>
                          <Textarea 
                            id="element-text" 
                            placeholder="Enter text content" 
                            className="resize-none"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="element-link">Link URL</Label>
                          <Input 
                            id="element-link" 
                            placeholder="https://example.com"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-10 text-gray-500">
                        <Layout size={48} className="mx-auto mb-4 text-gray-300" />
                        <p>Select an element on the page to edit its content</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="style" className="mt-0 space-y-4">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="typography">
                        <AccordionTrigger>Typography</AccordionTrigger>
                        <AccordionContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="font-family">Font Family</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select font" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sans">Sans-serif</SelectItem>
                                <SelectItem value="serif">Serif</SelectItem>
                                <SelectItem value="mono">Monospace</SelectItem>
                                <SelectItem value="display">Display</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="font-size">Font Size</Label>
                            <div className="flex items-center gap-2">
                              <Input id="font-size" type="number" defaultValue="16" className="w-20" />
                              <Select defaultValue="px">
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="px">px</SelectItem>
                                  <SelectItem value="rem">rem</SelectItem>
                                  <SelectItem value="em">em</SelectItem>
                                  <SelectItem value="%">%</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Font Weight</Label>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="flex-1">Regular</Button>
                              <Button variant="outline" size="sm" className="flex-1">Medium</Button>
                              <Button variant="outline" size="sm" className="flex-1">Bold</Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Text Align</Label>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="flex-1">Left</Button>
                              <Button variant="outline" size="sm" className="flex-1">Center</Button>
                              <Button variant="outline" size="sm" className="flex-1">Right</Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="colors">
                        <AccordionTrigger>Colors</AccordionTrigger>
                        <AccordionContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>Text Color</Label>
                            <div className="grid grid-cols-5 gap-2">
                              {['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', 
                                '#FFFF00', '#00FFFF', '#FF00FF', '#C0C0C0', '#808080'].map(color => (
                                <div 
                                  key={color}
                                  className="w-8 h-8 rounded-full cursor-pointer border shadow-sm"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Background Color</Label>
                            <div className="grid grid-cols-5 gap-2">
                              {['transparent', '#000000', '#FFFFFF', '#FF0000', '#00FF00', 
                                '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#C0C0C0'].map(color => (
                                <div 
                                  key={color}
                                  className="w-8 h-8 rounded-full cursor-pointer border shadow-sm"
                                  style={{ 
                                    backgroundColor: color,
                                    backgroundImage: color === 'transparent' ? 
                                      'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)' : 
                                      'none',
                                    backgroundSize: '8px 8px',
                                    backgroundPosition: '0 0, 4px 4px'
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="spacing">
                        <AccordionTrigger>Spacing</AccordionTrigger>
                        <AccordionContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>Margin</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <Label className="text-xs">Top</Label>
                                <Input type="number" defaultValue="0" />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Right</Label>
                                <Input type="number" defaultValue="0" />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Bottom</Label>
                                <Input type="number" defaultValue="0" />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Left</Label>
                                <Input type="number" defaultValue="0" />
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Padding</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <Label className="text-xs">Top</Label>
                                <Input type="number" defaultValue="0" />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Right</Label>
                                <Input type="number" defaultValue="0" />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Bottom</Label>
                                <Input type="number" defaultValue="0" />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Left</Label>
                                <Input type="number" defaultValue="0" />
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="animations">
                        <AccordionTrigger>Animations</AccordionTrigger>
                        <AccordionContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>Animation Type</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select animation" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="fade">Fade In</SelectItem>
                                <SelectItem value="slide">Slide In</SelectItem>
                                <SelectItem value="bounce">Bounce</SelectItem>
                                <SelectItem value="flip">Flip</SelectItem>
                                <SelectItem value="zoom">Zoom</SelectItem>
                                <SelectItem value="rotate">Rotate</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Duration (seconds)</Label>
                            <Input type="number" step="0.1" min="0.1" max="10" defaultValue="1" />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Delay (seconds)</Label>
                            <Input type="number" step="0.1" min="0" max="10" defaultValue="0" />
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Switch id="animate-on-scroll" />
                            <Label htmlFor="animate-on-scroll">Animate on scroll</Label>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="mt-0 space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="page-title">Page Title</Label>
                        <Input id="page-title" placeholder="Page Title" defaultValue="Home" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="page-description">Meta Description</Label>
                        <Textarea 
                          id="page-description" 
                          placeholder="Enter page description for SEO"
                          className="resize-none h-20"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="page-url">Page URL</Label>
                        <div className="flex">
                          <div className="bg-gray-100 border border-r-0 rounded-l px-3 py-2 text-gray-500 text-sm">
                            example.com/
                          </div>
                          <Input 
                            id="page-url" 
                            className="rounded-l-none"
                            defaultValue="home"
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <Label>Page Visibility</Label>
                        <RadioGroup defaultValue="public">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="public" id="public" />
                            <Label htmlFor="public">Public</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="private" id="private" />
                            <Label htmlFor="private">Private</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="password" id="password" />
                            <Label htmlFor="password">Password Protected</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="navigation">Show in Navigation</Label>
                          <Switch id="navigation" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}