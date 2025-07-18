import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PlusCircle, User, LogOut, Calendar, BookOpen, Heart, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  createdAt: string;
  likes: number;
  comments: number;
  tags: string[];
}

interface BlogDashboardProps {
  onLogout: () => void;
}

export function BlogDashboard({ onLogout }: BlogDashboardProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    tags: ""
  });

  // Mock user data
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  // Mock blogs data
  const [blogs, setBlogs] = useState<Blog[]>([
    {
      id: "1",
      title: "Getting Started with React Development",
      content: "React is a powerful JavaScript library for building user interfaces. In this comprehensive guide, we'll explore the fundamentals of React development, including components, props, state management, and modern hooks. Whether you're a beginner or looking to refresh your knowledge, this post will provide valuable insights into building modern web applications with React.",
      excerpt: "Learn the fundamentals of React development including components, props, and state management.",
      author: "Sarah Johnson",
      createdAt: "2024-01-15",
      likes: 24,
      comments: 8,
      tags: ["React", "JavaScript", "Frontend"]
    },
    {
      id: "2",
      title: "The Future of Web Development",
      content: "The web development landscape is constantly evolving. From new frameworks to emerging technologies like WebAssembly and Progressive Web Apps, developers need to stay updated with the latest trends. This article explores what the future holds for web development and how you can prepare for the changes ahead.",
      excerpt: "Exploring emerging technologies and trends shaping the future of web development.",
      author: "Mike Chen",
      createdAt: "2024-01-12",
      likes: 18,
      comments: 12,
      tags: ["Web Development", "Technology", "Trends"]
    },
    {
      id: "3",
      title: "Building Scalable APIs with Node.js",
      content: "Creating robust and scalable APIs is crucial for modern applications. This guide covers best practices for building APIs with Node.js, including proper error handling, authentication, database optimization, and deployment strategies. Learn how to create APIs that can handle thousands of concurrent users.",
      excerpt: "Best practices for creating robust and scalable APIs using Node.js.",
      author: "Emma Davis",
      createdAt: "2024-01-10",
      likes: 31,
      comments: 6,
      tags: ["Node.js", "API", "Backend"]
    }
  ]);

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const blog: Blog = {
      id: Date.now().toString(),
      title: newBlog.title,
      content: newBlog.content,
      excerpt: newBlog.content.substring(0, 120) + "...",
      author: user.name || "Anonymous",
      createdAt: new Date().toISOString().split('T')[0],
      likes: 0,
      comments: 0,
      tags: newBlog.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
    };
    
    setBlogs([blog, ...blogs]);
    setNewBlog({ title: "", content: "", tags: "" });
    setShowCreateForm(false);
    setIsLoading(false);
    
    toast({
      title: "Blog published!",
      description: "Your blog post has been published successfully."
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully."
    });
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              BlogSpace
            </h1>
            <Badge variant="secondary" className="animate-fade-in">
              Welcome, {user.name}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-gradient-primary hover:shadow-glow transition-spring"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              New Blog
            </Button>
            
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Create Blog Form */}
        {showCreateForm && (
          <Card className="mb-8 bg-gradient-card shadow-lg animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PlusCircle className="h-5 w-5 mr-2" />
                Create New Blog Post
              </CardTitle>
              <CardDescription>
                Share your thoughts and ideas with the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateBlog} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter your blog title..."
                    className="transition-smooth focus:shadow-md"
                    value={newBlog.title}
                    onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your blog content here..."
                    className="min-h-[200px] transition-smooth focus:shadow-md"
                    value={newBlog.content}
                    onChange={(e) => setNewBlog({...newBlog, content: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    placeholder="React, JavaScript, Tutorial..."
                    className="transition-smooth focus:shadow-md"
                    value={newBlog.tags}
                    onChange={(e) => setNewBlog({...newBlog, tags: e.target.value})}
                  />
                </div>
                
                <div className="flex space-x-4">
                  <Button 
                    type="submit" 
                    className="bg-gradient-primary hover:shadow-glow transition-spring"
                    disabled={isLoading}
                  >
                    {isLoading ? "Publishing..." : "Publish Blog"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Blog Posts */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center mb-8">
            Latest Blog Posts
          </h2>
          
          {blogs.map((blog, index) => (
            <Card 
              key={blog.id} 
              className="bg-gradient-card shadow-lg hover:shadow-glow transition-spring animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl hover:text-primary transition-smooth cursor-pointer">
                      {blog.title}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {blog.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {blog.createdAt}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="text-base leading-relaxed mb-4">
                  {blog.excerpt}
                </CardDescription>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center hover:text-primary transition-smooth cursor-pointer">
                      <Heart className="h-4 w-4 mr-1" />
                      {blog.likes}
                    </div>
                    <div className="flex items-center hover:text-primary transition-smooth cursor-pointer">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {blog.comments}
                    </div>
                    <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                      <BookOpen className="h-4 w-4 mr-1" />
                      Read More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}