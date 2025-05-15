import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  FileVideo, 
  FileType, 
  FileText, 
  File, 
  MoreVertical, 
  Trash, 
  Edit, 
  Download, 
  Eye, 
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ContentUploader } from "./ContentUploader";

interface ContentItem {
  id: number;
  title: string;
  description?: string;
  contentType: "video" | "presentation" | "document" | "other";
  fileUrl: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
}

interface ContentListProps {
  courseId: string | number;
}

export function ContentList({ courseId }: ContentListProps) {
  const { toast } = useToast();
  
  const { 
    data: contentItems = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: [`/api/teacher/courses/${courseId}/content`]
  });
  
  const handleDeleteContent = async (contentId: number) => {
    if (confirm("Are you sure you want to delete this content? This action cannot be undone.")) {
      try {
        const response = await fetch(`/api/teacher/courses/${courseId}/content/${contentId}`, {
          method: "DELETE"
        });
        
        if (!response.ok) {
          throw new Error("Failed to delete content");
        }
        
        toast({
          title: "Content deleted",
          description: "Content has been successfully deleted"
        });
        
        refetch();
      } catch (error) {
        console.error("Error deleting content:", error);
        toast({
          title: "Delete failed",
          description: "There was an error deleting the content",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleViewContent = (content: ContentItem) => {
    window.open(content.fileUrl, "_blank");
  };
  
  const handleDownloadContent = (content: ContentItem) => {
    const a = document.createElement("a");
    a.href = content.fileUrl;
    a.download = content.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  // Function to get icon based on content type
  const getContentIcon = (contentType: string) => {
    switch(contentType) {
      case "video":
        return <FileVideo className="h-8 w-8 text-blue-500" />;
      case "presentation":
        return <FileType className="h-8 w-8 text-orange-500" />;
      case "document":
        return <FileText className="h-8 w-8 text-green-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
    else return (bytes / 1073741824).toFixed(1) + ' GB';
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Course Content</h3>
          <Skeleton className="h-9 w-[120px]" />
        </div>
        
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-3/4 mb-1" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Course Content</h3>
          <ContentUploader courseId={courseId} onContentAdded={refetch} />
        </div>
        
        <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <h3 className="font-semibold">Failed to load content</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                There was an error loading the course content. Please try again.
              </p>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Course Content</h3>
        <ContentUploader courseId={courseId} onContentAdded={refetch} />
      </div>
      
      {Array.isArray(contentItems) && contentItems.length > 0 ? (
        <div className="space-y-3">
          {contentItems.map((content: ContentItem) => (
            <Card key={content.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{content.title}</CardTitle>
                    {content.description && (
                      <CardDescription className="mt-1">
                        {content.description}
                      </CardDescription>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewContent(content)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownloadContent(content)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600 focus:text-red-600"
                        onClick={() => handleDeleteContent(content.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  {getContentIcon(content.contentType)}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="font-normal">
                        {content.contentType === "video" && "Video"}
                        {content.contentType === "presentation" && "Presentation"}
                        {content.contentType === "document" && "Document"}
                        {content.contentType === "other" && "File"}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {content.fileName}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(content.fileSize)} • Uploaded {new Date(content.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col items-center text-center gap-2">
              <File className="h-8 w-8 text-gray-400" />
              <h3 className="font-semibold">No content yet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Upload videos, presentations, or documents to enhance your course.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}