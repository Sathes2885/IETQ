import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Search, Plus, Trash2, Eye, MoreHorizontal, Award, Download, FileUp } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from '@shared/schema';
import { Link } from 'wouter';
import { formatDate } from '@/lib/utils';

interface AdminManageCertificatesProps {
  user: User;
}

export default function AdminManageCertificates({ user }: AdminManageCertificatesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('recent');
  const [certificateToDelete, setCertificateToDelete] = useState<any | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all certificates
  const { data: certificates, isLoading } = useQuery({
    queryKey: ['/api/admin/certificates'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/admin/certificates');
      return await res.json();
    }
  });

  // Fetch certificate templates
  const { data: certificateTemplates } = useQuery({
    queryKey: ['/api/admin/certificate-templates'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/admin/certificate-templates');
      return await res.json();
    }
  });

  // Delete certificate mutation
  const deleteMutation = useMutation({
    mutationFn: async (certificateId: number) => {
      const res = await apiRequest('DELETE', `/api/admin/certificates/${certificateId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/certificates'] });
      setCertificateToDelete(null);
    }
  });

  // Filter and sort certificates
  const filteredCertificates = certificates?.filter((cert: any) => {
    // Search filter
    const matchesSearch = cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cert.studentName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    let matchesType = true;
    if (typeFilter !== 'all' && cert.contentType !== typeFilter) {
      matchesType = false;
    }
    
    return matchesSearch && matchesType;
  }) || [];
  
  // Sort certificates
  const sortedCertificates = [...filteredCertificates].sort((a: any, b: any) => {
    if (sortOrder === 'recent') {
      return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
    } else if (sortOrder === 'title_asc') {
      return a.title.localeCompare(b.title);
    } else if (sortOrder === 'title_desc') {
      return b.title.localeCompare(a.title);
    } else if (sortOrder === 'student') {
      return (a.studentName || '').localeCompare(b.studentName || '');
    }
    return 0;
  });

  // Group certificates by type
  const courseCertificates = sortedCertificates.filter((c: any) => c.contentType === 'course');
  const competitionCertificates = sortedCertificates.filter((c: any) => c.contentType === 'competition');
  const quizCertificates = sortedCertificates.filter((c: any) => c.contentType === 'quiz');

  const confirmDelete = (certificate: any) => {
    setCertificateToDelete(certificate);
  };

  const handleDelete = () => {
    if (certificateToDelete) {
      deleteMutation.mutate(certificateToDelete.id);
    }
  };

  const getContentTypeBadge = (type: string) => {
    switch (type) {
      case 'course':
        return <Badge className="bg-primary-100 text-primary-800">Course Completion</Badge>;
      case 'competition':
        return <Badge className="bg-secondary-100 text-secondary-800">Competition Award</Badge>;
      case 'quiz':
        return <Badge className="bg-amber-100 text-amber-800">Quiz Achievement</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex">
        <Sidebar user={user} />
        
        <div className="flex-1 overflow-auto focus:outline-none">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Page Header */}
            <div className="md:flex md:items-center md:justify-between mb-6">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  Manage Certificates
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Create, issue, and manage certificates for students
                </p>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <FileUp className="mr-2 h-4 w-4" />
                      Upload Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Certificate Template</DialogTitle>
                      <DialogDescription>
                        Upload a new certificate template for future use.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Input id="certificate-name" placeholder="Certificate Template Name" />
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                        <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">Drag and drop a file here, or click to select a file</p>
                          <p className="mt-1 text-xs text-gray-500">SVG, PNG or PDF, up to 10MB</p>
                        </div>
                        <Input 
                          type="file" 
                          className="hidden" 
                          accept=".svg,.png,.pdf" 
                          id="certificate-template" 
                        />
                        <Button variant="outline" className="mt-2">
                          Select File
                        </Button>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="ghost" onClick={() => setIsUploadDialogOpen(false)}>Cancel</Button>
                      <Button>Upload Template</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Issue Certificate
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Issue Certificate</DialogTitle>
                      <DialogDescription>
                        Create and issue a new certificate for a student.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm" htmlFor="certificate-title">
                          Title
                        </label>
                        <Input
                          id="certificate-title"
                          placeholder="Certificate Title"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm" htmlFor="certificate-student">
                          Student
                        </label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select Student" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student1">Student 1</SelectItem>
                            <SelectItem value="student2">Student 2</SelectItem>
                            <SelectItem value="student3">Student 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm" htmlFor="certificate-content">
                          Content
                        </label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select Content" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="course1">Course: Advanced Mathematics</SelectItem>
                            <SelectItem value="competition1">Competition: Science Project</SelectItem>
                            <SelectItem value="quiz1">Quiz: English Grammar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm" htmlFor="certificate-template">
                          Template
                        </label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select Template" />
                          </SelectTrigger>
                          <SelectContent>
                            {certificateTemplates?.map((template: any) => (
                              <SelectItem key={template.id} value={template.id.toString()}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="ghost" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button>Issue Certificate</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 mb-6">
              <div className="sm:col-span-6 lg:col-span-7">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search certificates by title or student name..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="sm:col-span-3 lg:col-span-2">
                <Select onValueChange={(value) => setTypeFilter(value)} defaultValue={typeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="course">Courses</SelectItem>
                    <SelectItem value="competition">Competitions</SelectItem>
                    <SelectItem value="quiz">Quizzes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-3 lg:col-span-3">
                <Select onValueChange={(value) => setSortOrder(value)} defaultValue={sortOrder}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="title_asc">Title A-Z</SelectItem>
                    <SelectItem value="title_desc">Title Z-A</SelectItem>
                    <SelectItem value="student">Student Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Certificates Tabs */}
            <Tabs defaultValue="all" className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Certificates</TabsTrigger>
                <TabsTrigger value="courses">Course Certificates</TabsTrigger>
                <TabsTrigger value="competitions">Competition Certificates</TabsTrigger>
                <TabsTrigger value="quizzes">Quiz Certificates</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <CertificatesTable 
                  certificates={sortedCertificates} 
                  isLoading={isLoading} 
                  confirmDelete={confirmDelete}
                  getContentTypeBadge={getContentTypeBadge}
                />
              </TabsContent>
              
              <TabsContent value="courses">
                <CertificatesTable 
                  certificates={courseCertificates} 
                  isLoading={isLoading} 
                  confirmDelete={confirmDelete}
                  getContentTypeBadge={getContentTypeBadge}
                />
              </TabsContent>
              
              <TabsContent value="competitions">
                <CertificatesTable 
                  certificates={competitionCertificates} 
                  isLoading={isLoading} 
                  confirmDelete={confirmDelete}
                  getContentTypeBadge={getContentTypeBadge}
                />
              </TabsContent>
              
              <TabsContent value="quizzes">
                <CertificatesTable 
                  certificates={quizCertificates} 
                  isLoading={isLoading} 
                  confirmDelete={confirmDelete}
                  getContentTypeBadge={getContentTypeBadge}
                />
              </TabsContent>
              
              <TabsContent value="templates">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {certificateTemplates?.map((template: any) => (
                    <Card key={template.id} className="overflow-hidden">
                      <div className="h-48 bg-gray-100 flex items-center justify-center">
                        {template.previewUrl ? (
                          <img 
                            src={template.previewUrl} 
                            alt={template.name} 
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <Award className="h-16 w-16 text-gray-400" />
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{template.name}</h3>
                        <div className="flex justify-between items-center">
                          <Badge>{template.contentType === 'all' ? 'All Types' : template.contentType}</Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Template Upload Card */}
                  <Card className="border-2 border-dashed border-gray-200">
                    <CardContent className="h-full flex flex-col items-center justify-center p-6">
                      <FileUp className="h-12 w-12 text-gray-400 mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">Upload New Template</h3>
                      <p className="text-sm text-gray-500 text-center mb-4">
                        Add a new certificate template for future use
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsUploadDialogOpen(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Upload Template
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!certificateToDelete} onOpenChange={(open) => !open && setCertificateToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this certificate?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the certificate
              "{certificateToDelete?.title}" issued to {certificateToDelete?.studentName}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Certificate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface CertificatesTableProps {
  certificates: any[];
  isLoading: boolean;
  confirmDelete: (certificate: any) => void;
  getContentTypeBadge: (type: string) => React.ReactNode;
}

function CertificatesTable({ 
  certificates, 
  isLoading, 
  confirmDelete,
  getContentTypeBadge,
}: CertificatesTableProps) {
  return (
    <Card>
      {isLoading ? (
        <div className="py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading certificates...</p>
        </div>
      ) : certificates.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certificates.map((certificate: any) => (
              <TableRow key={certificate.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <div className="mr-2">
                      <Award className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>{certificate.title}</div>
                  </div>
                </TableCell>
                <TableCell>{certificate.studentName}</TableCell>
                <TableCell>
                  {getContentTypeBadge(certificate.contentType)}
                </TableCell>
                <TableCell>{certificate.contentTitle}</TableCell>
                <TableCell>{formatDate(certificate.issueDate)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Link href={`/admin/certificates/${certificate.id}`}>
                          <span className="flex items-center w-full">
                            <Eye className="mr-2 h-4 w-4" />
                            View Certificate
                          </span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <span className="flex items-center w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => confirmDelete(certificate)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="p-6 text-center">
          <Award className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No certificates found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm ? 'No certificates match your search criteria' : 'There are no certificates to display'}
          </p>
          <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
            Issue a Certificate
          </Button>
        </div>
      )}
    </Card>
  );
}
