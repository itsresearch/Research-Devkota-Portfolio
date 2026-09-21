import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

/* Lazy-load pages — each chunk only loads when the route is visited */
const Index     = lazy(() => import("./pages/Index"));
const BlogIndex = lazy(() => import("./pages/BlogIndex"));
const BlogPost  = lazy(() => import("./pages/BlogPost"));
const Admin     = lazy(() => import("./pages/Admin"));

const queryClient = new QueryClient();

/* Minimal full-page spinner shown while a lazy chunk loads */
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner richColors position="top-right" />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"           element={<Index />} />
            <Route path="/blog"       element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/admin"      element={<Admin />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
