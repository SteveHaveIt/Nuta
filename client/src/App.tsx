import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ProductCatalog from "./pages/ProductCatalog";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import DashboardOrders from "./pages/DashboardOrders";
import DashboardLoyalty from "./pages/DashboardLoyalty";
import DashboardAffiliate from "./pages/DashboardAffiliate";
import Support from "./pages/Support";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import AdminTickets from "./pages/AdminTickets";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Policies from "./pages/Policies";
import OrderTracking from "./pages/OrderTracking";

function Router() {
  return (
    <Switch>
      {/* Public Pages */}
      <Route path={"/"} component={Home} />
      <Route path={"/products"} component={ProductCatalog} />
      <Route path={"/products/:id"} component={ProductDetails} />
      <Route path={"/cart"} component={Cart} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/track/:orderPin"} component={OrderTracking} />
      
      {/* Customer Dashboard */}
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/dashboard/orders"} component={DashboardOrders} />
      <Route path={"/dashboard/loyalty"} component={DashboardLoyalty} />
      <Route path={"/dashboard/affiliate"} component={DashboardAffiliate} />
      
      {/* Support & Content */}
      <Route path={"/support"} component={Support} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/about"} component={About} />
      <Route path={"/policies"} component={Policies} />
      
      {/* Admin Pages */}
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/orders"} component={AdminOrders} />
      <Route path={"/admin/products"} component={AdminProducts} />
      <Route path={"/admin/tickets"} component={AdminTickets} />
      
      {/* 404 */}
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
