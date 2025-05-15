import { useState, useRef } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FileUp, Upload, FileType, FileVideo, FileText, File, X } from "lucide-react";

type ContentType = "video" | "presentation" | "document" | "other";

interface FileUploadProps {
  courseId: string | number;
  onContentAdded: () => void;
}

export function ContentUploader({ courseId, onContentAdded }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [contentType, setContentType] = useState<ContentType>("video");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Content type icon mapper
  const contentTypeIcons = {
    video: <FileVideo className="h-6 w-6 text-blue-500" />,
    presentation: <FileType className="h-6 w-6 text-orange-500" />,
    document: <FileText className="h-6 w-6 text-green-500" />,
    other: <File className="h-6 w-6 text-gray-500" />
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file type based on contentType
      if (contentType === "video" && !file.type.includes("video")) {
        toast({
          title: "Invalid file type",
          description: "Please select a video file",
          variant: "destructive"
        });
        return;
      }
      
      if (contentType === "presentation" && 
          !file.type.includes("presentation") && 
          !file.name.endsWith(".ppt") && 
          !file.name.endsWith(".pptx")) {
        toast({
          title: "Invalid file type",
          description: "Please select a PowerPoint file (.ppt or .pptx)",
          variant: "destructive"
        });
        return;
      }
      
      // Check file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "File size should be less than 100MB",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleContentTypeChange = (value: string) => {
    setContentType(value as ContentType);
    // Reset selected file when changing content type
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }
    
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for the content",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("contentType", contentType);
    
    try {
      // Upload the file
      const response = await fetch(`/api/teacher/courses/${courseId}/content`, {
        method: "POST",
        body: formData
      });
      
      if (!response.ok) {
        throw new Error("Failed to upload content");
      }
      
      toast({
        title: "Content uploaded",
        description: "Your content has been uploaded successfully"
      });
      
      // Reset form
      setTitle("");
      setDescription("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Close dialog
      setIsDialogOpen(false);
      
      // Callback to refresh content list
      onContentAdded();
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
          <FileUp className="h-4 w-4" />
          Add Content
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Course Content</DialogTitle>
          <DialogDescription>
            Add videos, presentations, or documents to your course
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="contentType">Content Type</Label>
            <Select
              value={contentType}
              onValueChange={handleContentTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="presentation">Presentation (PPT)</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for this content"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief description of this content"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file">Upload File</Label>
            
            {!selectedFile ? (
              <div 
                className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Click to select a file or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {contentType === "video" && "Supported formats: MP4, WebM (Max 100MB)"}
                  {contentType === "presentation" && "Supported formats: PPT, PPTX (Max 100MB)"}
                  {contentType === "document" && "Supported formats: PDF, DOC, DOCX (Max 100MB)"}
                  {contentType === "other" && "Max size: 100MB"}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept={
                    contentType === "video" ? "video/*" :
                    contentType === "presentation" ? ".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" :
                    contentType === "document" ? ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" :
                    "*/*"
                  }
                />
              </div>
            ) : (
              <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {contentTypeIcons[contentType]}
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={removeSelectedFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading || !selectedFile}>
              {isUploading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                  Uploading...
                </>
              ) : "Upload Content"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}