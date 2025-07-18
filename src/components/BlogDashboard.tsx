import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PlusCircle, User, LogOut, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";
interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  createdAt: string;
}

interface BlogDashboardProps {
  onLogout: () => void;
}

export function BlogDashboard({ onLogout }: BlogDashboardProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const { toast } = useToast();

  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    tags: ""
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("jwt");

  // ✅ Fetch Blogs from Strapi
  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/blogs?populate=*`);
      console.log(res)
      const mappedBlogs = res.data.data.map((b: any) => ({
        id: b.id,
        title: b.title,
        content: b.content,
        excerpt: b.content.substring(0, 120) + "...",
        author: b.author|| "Anonymous",
        createdAt: new Date(b.createdAt).toISOString().split("T")[0],
      }));
      setBlogs(mappedBlogs);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to fetch blogs.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // ✅ Create Blog in Strapi
  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/blogs`,
        {
          data: {
            title: newBlog.title,
            content: newBlog.content,
            author: user.username, // logged-in user id
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Blog published!",
        description: "Your blog post has been published successfully.",
      });

      // Refresh blogs after creation
      fetchBlogs();

      setNewBlog({ title: "", content: "", tags: "" });
      setShowCreateForm(false);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.error?.message || "Failed to publish blog",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("jwt");
    toast({ title: "Logged out", description: "You have been logged out successfully." });
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
            <Badge variant="secondary">Welcome, {user.username || user.name}</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-gradient-primary"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> New Blog
            </Button>
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {user.username?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Create Blog Form */}
        {showCreateForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Blog Post</CardTitle>
              <CardDescription>Share your thoughts</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateBlog} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newBlog.title}
                    onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newBlog.content}
                    onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Publishing..." : "Publish Blog"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Blog Posts */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center mb-8">Latest Blog Posts</h2>
          {blogs.map((blog) => (
            <Card key={blog.id}>
              <CardHeader>
                <CardTitle>{blog.title}</CardTitle>
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
              </CardHeader>
              <CardContent>
                <CardDescription>{blog.excerpt}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
