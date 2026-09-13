import { Routes, Route } from "react-router-dom";

import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Services from "../pages/public/Services";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import AdminDashboard from "../pages/admin/AdminDashboard";
import OfficerDashboard from "../pages/officer/OfficerDashboard";
import CitizenDashboard from "../pages/citizen/CitizenDashboard";
import RegisterOfficer from "../pages/admin/RegisterOfficer";
import OfficerList from "../pages/admin/OfficerList";
import CitizenList from "../pages/admin/CitizenList";
import RequestMonitoring from "../pages/admin/RequestMonitoring";
import Reports from "../pages/admin/Reports";
import Settings from "../pages/admin/Settings";
import CreateRequest from "../pages/citizen/CreateRequest";
import MyRequests from "../pages/citizen/MyRequests";
import VolunteerDetails from "../pages/citizen/VolunteerDetails";
import CitizenProfilePage from "../pages/citizen/CitizenProfilePage";
import OfficerRequests from "../pages/officer/OfficerRequests";
import RequestReview from "../pages/officer/RequestReview";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/admin/dashboard"
        element={<AdminDashboard />}
      />
      <Route path="/admin/requests" element={<RequestMonitoring />} />
      <Route path="/admin/reports" element={<Reports />} />
      <Route path="/admin/settings" element={<Settings />} />

      <Route
        path="/officer/dashboard"
        element={<OfficerDashboard />}
      />
      <Route path="/officer/requests" element={<OfficerRequests />} />
      <Route path="/officer/requests/:id" element={<RequestReview />} />

      <Route
        path="/citizen/dashboard"
        element={<CitizenDashboard />}
      />
      <Route path="/citizen/requests/new" element={<CreateRequest />} />
      <Route path="/citizen/requests" element={<MyRequests />} />
      <Route path="/citizen/volunteer" element={<VolunteerDetails />} />
      <Route path="/citizen/profile" element={<CitizenProfilePage />} />
      <Route
  path="/admin/officers/register"
  element={<RegisterOfficer />}
/>

<Route
  path="/admin/officers"
  element={<OfficerList />}
/>

<Route
  path="/admin/citizens"
  element={<CitizenList />}
/>
      
    </Routes>
    
  );
};

export default AppRoutes;
