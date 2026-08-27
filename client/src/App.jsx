import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminRoute from './components/layout/AdminRoute';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import Vendors from './pages/Vendors';
import VendorDetails from './pages/VendorDetails';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import EventPlanner from './pages/EventPlanner';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';

import DashboardLayout from './pages/dashboard/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import Bookings from './pages/dashboard/Bookings';
import BookingDetail from './pages/dashboard/BookingDetail';
import Wishlist from './pages/dashboard/Wishlist';
import Notifications from './pages/dashboard/Notifications';
import Profile from './pages/dashboard/Profile';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminVendors from './pages/admin/AdminVendors';
import AdminBookings from './pages/admin/AdminBookings';
import AdminReviews from './pages/admin/AdminReviews';
import AdminMessages from './pages/admin/AdminMessages';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="services" element={<Services />} />
        <Route path="vendors" element={<Vendors />} />
        <Route path="vendors/decoration" element={<Vendors defaultCategory="Decoration" />} />
        <Route path="vendors/catering" element={<Vendors defaultCategory="Catering" />} />
        <Route path="vendors/photography" element={<Vendors defaultCategory="Photography" />} />
        <Route path="vendors/dj-music" element={<Vendors defaultCategory="DJ & Music" />} />
        <Route path="vendors/makeup-artists" element={<Vendors defaultCategory="Makeup Artists" />} />
        <Route path="vendors/venues" element={<Vendors defaultCategory="Venues" />} />
        <Route path="vendors/entertainment" element={<Vendors defaultCategory="Entertainment" />} />
        <Route path="vendors/transportation" element={<Vendors defaultCategory="Transportation" />} />
        <Route path="vendors/invitations" element={<Vendors defaultCategory="Invitations" />} />
        <Route path="vendors/:id" element={<VendorDetails />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetails />} />
        <Route path="planner" element={<EventPlanner />} />

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
        <Route path="verify-email/:token" element={<VerifyEmail />} />

        <Route path="dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Overview />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="bookings/:id" element={<BookingDetail />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="checkout/:vendorId" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="checkout/success/:bookingId" element={<ProtectedRoute><CheckoutSuccess /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="vendors" element={<AdminVendors />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>
    </Routes>
  );
}
