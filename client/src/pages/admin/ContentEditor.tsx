import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Eye, FileText, Globe, Layout, Plus, Save, X, Palette } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Page editor types
type PageElement = {
  id: string;
  type: 'header' | 'text' | 'image' | 'button' | 'section' | 'form';
  content: string;
  styles?: Record<string, string>;
};

type Page = {
  id: string;
  title: string;
  path: string;
  elements: PageElement[];
};

export default function ContentEditor() {
  const { toast } = useToast();
  const [activePage, setActivePage] = useState<string>('home');
  const [editMode, setEditMode] = useState<boolean>(true);
  const [activeElement, setActiveElement] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('content');
  
  // Sample data for the editor
  const [pages, setPages] = useState<Page[]>([
    {
      id: 'home',
      title: 'Home Page',
      path: '/',
      elements: [
        {
          id: 'header-1',
          type: 'header',
          content: 'India\'s Emerging Talent Quest',
          styles: { fontSize: '36px', fontWeight: 'bold', textAlign: 'center' }
        },
        {
          id: 'subtitle-1',
          type: 'text',
          content: 'Discover, Develop, Dazzle - Get Ready for the Ultimate Student Challenge!',
          styles: { fontSize: '18px', textAlign: 'center', marginBottom: '24px' }
        },
        {
          id: 'image-1',
          type: 'image',
          content: '/competition-banner.jpg',
          styles: { width: '100%', borderRadius: '8px' }
        },
        {
          id: 'text-1',
          type: 'text',
          content: 'Welcome to India\'s premier virtual talent platform for grades 1-10. Compete, learn, and grow with courses and competitions designed to unlock your potential!',
          styles: { margin: '24px 0' }
        },
        {
          id: 'button-1',
          type: 'button',
          content: 'Register Now',
          styles: { backgroundColor: '#4f46e5', color: 'white', padding: '12px 24px', borderRadius: '4px' }
        }
      ]
    },
    {
      id: 'about',
      title: 'About Us',
      path: '/about',
      elements: [
        {
          id: 'header-1',
          type: 'header',
          content: 'About IETQ',
          styles: { fontSize: '32px', fontWeight: 'bold' }
        },
        {
          id: 'text-1',
          type: 'text',
          content: 'IETQ (India\'s Emerging Talent Quest) is a nationwide virtual platform for students in grades 1-10.',
          styles: { margin: '16px 0' }
        }
      ]
    }
  ]);
  
  // Elements that can be added to a page
  const elementTypes = [
    { id: 'header', name: 'Heading', icon: <Layout size={24} /> },
    { id: 'text', name: 'Paragraph', icon: <FileText size={24} /> },
    { id: 'image', name: 'Image', icon: <Globe size={24} /> },
    { id: 'button', name: 'Button', icon: <Layout size={24} /> },
    { id: 'form', name: 'Form', icon: <FileText size={24} /> },
    { id: 'section', name: 'Section', icon: <Layout size={24} /> },
  ];
  
  // Find current page and active element
  const currentPage = pages.find(p => p.id === activePage) || pages[0];
  const element = activeElement ? currentPage.elements.find(e => e.id === activeElement) : null;
  
  const handleAddElement = (type: PageElement['type']) => {
    const newElement: PageElement = {
      id: `${type}-${Date.now()}`,
      type,
      content: type === 'header' ? 'New Heading' : 
               type === 'text' ? 'Add your text here' :
               type === 'image' ? '/placeholder.jpg' :
               type === 'button' ? 'Click Me' : '',
      styles: {}
    };
    
    // Add element to current page
    setPages(prevPages => 
      prevPages.map(page => 
        page.id === activePage 
          ? { ...page, elements: [...page.elements, newElement] } 
          : page
      )
    );
    
    // Select the new element
    setActiveElement(newElement.id);
    
    toast({
      title: 'Element Added',
      description: `Added a new ${type} element to the page`
    });
  };
  
  const handleUpdateElement = (id: string, updates: Partial<PageElement>) => {
    setPages(prevPages => 
      prevPages.map(page => 
        page.id === activePage 
          ? {
              ...page,
              elements: page.elements.map(el => 
                el.id === id ? { ...el, ...updates } : el
              )
            } 
          : page
      )
    );
  };
  
  const handleDeleteElement = (id: string) => {
    setPages(prevPages => 
      prevPages.map(page => 
        page.id === activePage 
          ? {
              ...page,
              elements: page.elements.filter(el => el.id !== id)
            } 
          : page
      )
    );
    
    setActiveElement(null);
    
    toast({
      title: 'Element Deleted',
      description: 'The element has been removed from the page'
    });
  };
  
  const handleCreatePage = (title: string, path: string) => {
    const id = title.toLowerCase().replace(/\s+/g, '-');
    const newPage: Page = {
      id,
      title,
      path: path || `/${id}`,
      elements: []
    };
    
    setPages(prev => [...prev, newPage]);
    setActivePage(id);
    
    toast({
      title: 'Page Created',
      description: `Created new page: ${title}`
    });
  };
  
  const handleSaveChanges = () => {
    // In a real implementation, this would save to the database or Builder.io
    toast({
      title: 'Changes Saved',
      description: 'Your changes have been saved successfully'
    });
  };
  
  const handlePublishChanges = () => {
    // In a real implementation, this would publish the changes
    toast({
      title: 'Changes Published',
      description: 'Your changes are now live on the website'
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Visual Website Editor</h1>
            <p className="text-gray-500">Create and edit website content with ease</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? <Eye size={16} /> : <FileText size={16} />}
              {editMode ? 'Preview' : 'Edit'}
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={handleSaveChanges}
            >
              <Save size={16} />
              Save Draft
            </Button>
            <Button 
              className="gap-2"
              onClick={handlePublishChanges}
            >
              <Globe size={16} />
              Publish
            </Button>
          </div>
        </div>
        
        {/* Page selector */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-lg font-medium">Pages</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                >
                  <Plus size={16} />
                  New Page
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Page</DialogTitle>
                  <DialogDescription>
                    Enter the details for your new page
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="page-title">Page Title</Label>
                    <Input id="page-title" placeholder="Home Page" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="page-path">Page URL</Label>
                    <div className="flex">
                      <div className="bg-gray-100 border border-r-0 rounded-l px-3 py-2 text-gray-500 text-sm">
                        yourdomain.com/
                      </div>
                      <Input 
                        id="page-path" 
                        className="rounded-l-none"
                        placeholder="home"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={() => handleCreatePage('New Page', '/new-page')}>
                    Create Page
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex overflow-x-auto space-x-2 pb-2">
            {pages.map(page => (
              <Button
                key={page.id}
                variant={activePage === page.id ? "default" : "outline"}
                className="whitespace-nowrap"
                onClick={() => {
                  setActivePage(page.id);
                  setActiveElement(null);
                }}
              >
                {page.title}
              </Button>
            ))}
          </div>
        </div>
      
        <div className="flex gap-4">
          {/* Element sidebar */}
          {editMode && (
            <div className="w-56 shrink-0">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Add Elements</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="grid grid-cols-2 gap-2">
                    {elementTypes.map(type => (
                      <Button
                        key={type.id}
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-gray-100"
                        onClick={() => handleAddElement(type.id as PageElement['type'])}
                      >
                        <div className="text-primary">{type.icon}</div>
                        <span className="text-xs">{type.name}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Main content area */}
          <div className="flex-1 border rounded-lg bg-white">
            <div className="p-6 min-h-[500px]">
              {currentPage.elements.map(element => (
                <div 
                  key={element.id}
                  onClick={() => setActiveElement(element.id)}
                  className={`relative mb-4 group ${
                    activeElement === element.id && editMode ? 'ring-2 ring-blue-500' : ''
                  } ${editMode ? 'cursor-pointer hover:ring-2 hover:ring-blue-200' : ''}`}
                >
                  {editMode && activeElement === element.id && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white p-1 text-xs z-10">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-6 w-6 p-0 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteElement(element.id);
                        }}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  )}
                  
                  {element.type === 'header' && (
                    <h2 style={element.styles}>{element.content}</h2>
                  )}
                  {element.type === 'text' && (
                    <p style={element.styles}>{element.content}</p>
                  )}
                  {element.type === 'image' && (
                    <div style={element.styles}>
                      <div className="bg-gray-200 text-center py-16">
                        [Image: {element.content}]
                      </div>
                    </div>
                  )}
                  {element.type === 'button' && (
                    <button 
                      style={element.styles}
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      {element.content}
                    </button>
                  )}
                </div>
              ))}
              
              {currentPage.elements.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                  <Layout size={48} className="mx-auto mb-4" />
                  <p>Add elements from the sidebar to build your page</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Properties sidebar */}
          {editMode && (
            <div className="w-72 shrink-0">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Properties</CardTitle>
                </CardHeader>
                
                <CardContent className="p-4">
                  {element ? (
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="content">Content</TabsTrigger>
                        <TabsTrigger value="style">Style</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="content" className="space-y-4 pt-4">
                        {(element.type === 'header' || element.type === 'text' || element.type === 'button') && (
                          <div className="space-y-2">
                            <Label htmlFor="element-text">Text</Label>
                            <Textarea 
                              id="element-text" 
                              value={element.content}
                              onChange={(e) => handleUpdateElement(element.id, { content: e.target.value })}
                              rows={4}
                            />
                          </div>
                        )}
                        
                        {element.type === 'image' && (
                          <div className="space-y-2">
                            <Label htmlFor="image-src">Image URL</Label>
                            <Input 
                              id="image-src" 
                              value={element.content}
                              onChange={(e) => handleUpdateElement(element.id, { content: e.target.value })}
                            />
                            <Button variant="outline" size="sm" className="mt-2 w-full">
                              Upload Image
                            </Button>
                          </div>
                        )}
                        
                        {element.type === 'button' && (
                          <div className="space-y-2">
                            <Label htmlFor="button-link">Link URL</Label>
                            <Input 
                              id="button-link" 
                              placeholder="https://example.com"
                            />
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="style" className="pt-4">
                        <Accordion type="single" collapsible>
                          <AccordionItem value="typography">
                            <AccordionTrigger>Typography</AccordionTrigger>
                            <AccordionContent className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="font-size">Font Size</Label>
                                <div className="grid grid-cols-3 gap-2">
                                  <Input 
                                    id="font-size" 
                                    type="number" 
                                    placeholder="16"
                                    value={(element.styles?.fontSize || '').replace('px', '')}
                                    onChange={(e) => {
                                      handleUpdateElement(element.id, { 
                                        styles: {
                                          ...element.styles,
                                          fontSize: `${e.target.value}px`
                                        }
                                      });
                                    }}
                                  />
                                  <Select defaultValue="px">
                                    <SelectTrigger>
                                      <SelectValue placeholder="Unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="px">px</SelectItem>
                                      <SelectItem value="em">em</SelectItem>
                                      <SelectItem value="%">%</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Select 
                                    value={element.styles?.fontWeight || ''}
                                    onValueChange={(value) => {
                                      handleUpdateElement(element.id, { 
                                        styles: {
                                          ...element.styles,
                                          fontWeight: value
                                        }
                                      });
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Weight" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="normal">Normal</SelectItem>
                                      <SelectItem value="bold">Bold</SelectItem>
                                      <SelectItem value="lighter">Light</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Text Align</Label>
                                <div className="flex justify-between">
                                  <Button 
                                    variant={element.styles?.textAlign === 'left' ? 'default' : 'outline'} 
                                    size="sm"
                                    onClick={() => {
                                      handleUpdateElement(element.id, { 
                                        styles: {
                                          ...element.styles,
                                          textAlign: 'left'
                                        }
                                      });
                                    }}
                                  >
                                    Left
                                  </Button>
                                  <Button 
                                    variant={element.styles?.textAlign === 'center' ? 'default' : 'outline'} 
                                    size="sm"
                                    onClick={() => {
                                      handleUpdateElement(element.id, { 
                                        styles: {
                                          ...element.styles,
                                          textAlign: 'center'
                                        }
                                      });
                                    }}
                                  >
                                    Center
                                  </Button>
                                  <Button 
                                    variant={element.styles?.textAlign === 'right' ? 'default' : 'outline'} 
                                    size="sm"
                                    onClick={() => {
                                      handleUpdateElement(element.id, { 
                                        styles: {
                                          ...element.styles,
                                          textAlign: 'right'
                                        }
                                      });
                                    }}
                                  >
                                    Right
                                  </Button>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="colors">
                            <AccordionTrigger>Colors</AccordionTrigger>
                            <AccordionContent className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="text-color">Text Color</Label>
                                <div className="flex">
                                  <Input 
                                    id="text-color" 
                                    value={element.styles?.color || ''}
                                    onChange={(e) => {
                                      handleUpdateElement(element.id, { 
                                        styles: {
                                          ...element.styles,
                                          color: e.target.value
                                        }
                                      });
                                    }}
                                  />
                                  <div 
                                    className="w-10 h-10 border ml-2" 
                                    style={{ backgroundColor: element.styles?.color || 'transparent' }}
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="bg-color">Background Color</Label>
                                <div className="flex">
                                  <Input 
                                    id="bg-color" 
                                    value={element.styles?.backgroundColor || ''}
                                    onChange={(e) => {
                                      handleUpdateElement(element.id, { 
                                        styles: {
                                          ...element.styles,
                                          backgroundColor: e.target.value
                                        }
                                      });
                                    }}
                                  />
                                  <div 
                                    className="w-10 h-10 border ml-2" 
                                    style={{ backgroundColor: element.styles?.backgroundColor || 'transparent' }}
                                  />
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
                                    <Input type="number" placeholder="0" />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-xs">Right</Label>
                                    <Input type="number" placeholder="0" />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-xs">Bottom</Label>
                                    <Input type="number" placeholder="0" />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-xs">Left</Label>
                                    <Input type="number" placeholder="0" />
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                          
                          {element.type === 'button' && (
                            <AccordionItem value="button-style">
                              <AccordionTrigger>Button Style</AccordionTrigger>
                              <AccordionContent className="space-y-4">
                                <div className="space-y-2">
                                  <Label>Border Radius</Label>
                                  <Input 
                                    type="number" 
                                    placeholder="4" 
                                    value={(element.styles?.borderRadius || '').replace('px', '')}
                                    onChange={(e) => {
                                      handleUpdateElement(element.id, { 
                                        styles: {
                                          ...element.styles,
                                          borderRadius: `${e.target.value}px`
                                        }
                                      });
                                    }}
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label>Padding</Label>
                                  <div className="grid grid-cols-2 gap-2">
                                    <Input 
                                      placeholder="Vertical" 
                                      value={(element.styles?.padding || '').split(' ')[0]?.replace('px', '')}
                                      onChange={(e) => {
                                        const horizontal = ((element.styles?.padding || '').split(' ')[1] || '24px').replace('px', '');
                                        handleUpdateElement(element.id, { 
                                          styles: {
                                            ...element.styles,
                                            padding: `${e.target.value}px ${horizontal}px`
                                          }
                                        });
                                      }}
                                    />
                                    <Input 
                                      placeholder="Horizontal" 
                                      value={(element.styles?.padding || '').split(' ')[1]?.replace('px', '')}
                                      onChange={(e) => {
                                        const vertical = ((element.styles?.padding || '').split(' ')[0] || '12px').replace('px', '');
                                        handleUpdateElement(element.id, { 
                                          styles: {
                                            ...element.styles,
                                            padding: `${vertical}px ${e.target.value}px`
                                          }
                                        });
                                      }}
                                    />
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          )}
                        </Accordion>
                      </TabsContent>
                      
                      <TabsContent value="settings" className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="visible">Visible</Label>
                            <Switch id="visible" defaultChecked />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Responsive Visibility</Label>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="flex flex-col items-center">
                              <Label className="mb-2">Mobile</Label>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex flex-col items-center">
                              <Label className="mb-2">Tablet</Label>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex flex-col items-center">
                              <Label className="mb-2">Desktop</Label>
                              <Switch defaultChecked />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Animation</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="None" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="fade">Fade In</SelectItem>
                              <SelectItem value="slide">Slide In</SelectItem>
                              <SelectItem value="zoom">Zoom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="text-center py-10 text-gray-400">
                      <Layout size={48} className="mx-auto mb-4" />
                      <p>Select an element to edit its properties</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        
        {/* Page settings */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Page Settings</CardTitle>
            <CardDescription>Configure metadata and publishing options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="page-title">Page Title</Label>
                  <Input 
                    id="page-title" 
                    value={currentPage.title}
                    onChange={(e) => {
                      setPages(prev => 
                        prev.map(p => 
                          p.id === activePage 
                            ? { ...p, title: e.target.value } 
                            : p
                        )
                      );
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="page-url">Page URL</Label>
                  <div className="flex">
                    <div className="bg-gray-100 border border-r-0 rounded-l px-3 py-2 text-gray-500 text-sm">
                      yourdomain.com
                    </div>
                    <Input 
                      id="page-url" 
                      className="rounded-l-none"
                      value={currentPage.path}
                      onChange={(e) => {
                        setPages(prev => 
                          prev.map(p => 
                            p.id === activePage 
                              ? { ...p, path: e.target.value } 
                              : p
                          )
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta-description">Meta Description</Label>
                  <Textarea 
                    id="meta-description" 
                    placeholder="Enter a description for search engines"
                    className="h-20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Page Visibility</Label>
                  <RadioGroup defaultValue="published">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="published" id="published" />
                      <Label htmlFor="published">Published</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="draft" id="draft" />
                      <Label htmlFor="draft">Draft</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </CardContent>
          <Separator />
          <div className="p-4 flex justify-end space-x-2">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}