import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Generator from "./pages/Generator";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import ExpertDashboard from "./pages/ExpertDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import BookConsultation from "./pages/BookConsultation";
import StripePayment from "./pages/StripePayment";
import ChatBox from "./pages/ChatBox";
import ReviewPage from "./pages/ReviewPage";
import AdminPanel from "./pages/AdminPanel";
import RealtimeChat from "./pages/RealtimeChat";
import { useAuth } from "./_core/hooks/useAuth";

function Router() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/generator" component={isAuthenticated ? Generator : Home} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/subscription-plans" component={SubscriptionPlans} />
      <Route path="/expert-dashboard" component={ExpertDashboard} />
      <Route path="/client-dashboard" component={ClientDashboard} />
      <Route path="/book-consultation/:id" component={BookConsultation} />
      <Route path="/stripe-payment" component={StripePayment} />
      <Route path="/chat/:consultationId" component={ChatBox} />
      <Route path="/review/:consultationId" component={ReviewPage} />
      <Route path="/admin-panel" component={AdminPanel} />
      <Route path="/realtime-chat/:consultationId" component={RealtimeChat} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
