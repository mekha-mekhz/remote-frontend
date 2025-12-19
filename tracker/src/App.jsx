
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Auth & common pages
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";

// User  pages
import EmployeeDashboard from "./pages/EmpDashboard";
import DailyLog from "./pages/DailyLog";
import Productivity from "./pages/Productivity";
import Notifications from "./pages/Notification";
import ProductivityReport from "./pages/ProductivityReport";
import ApplyLeave from "./pages/ApplyLeave";
import PremiumFeatures from "./pages/Premiumfeatures";
import PremiumDashboard from "./pages/PremiumDash";
import Pricing from "./pages/Pricing";
import Attendance from "./pages/Attendance";
import TimeTracker from "./pages/TimeTracker";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Chats from "./pages/Chats";
import CreateDispute from "./pages/CreateDispute";
import CreateReminder from "./pages/CreateReminder";
import AllReminders from "./pages/AllReminders";

// Manager pages
import TaskManagerDashboard from "./pages/TaskmanagerDash";
import ManagerTaskList from "./pages/Mangertask";
import ManagerAddTask from "./pages/Mangeraddtask";
import ManagerLeaves from "./pages/managerleave";
import ManagerRecords from "./pages/managerrecord";
import ProjectsPage from "./pages/ProjectsPage";
import TeamsPage from "./pages/TeamsPage";
import ManagerChat from "./pages/Mangerchat";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/Adminuser";
import AdminTasks from "./pages/Admintask";
import AdminReports from "./pages/AdminReports";
import AdminRolePermissions from "./pages/AdminPermission";
import AdminDisputes from "./pages/AdminDispute";
import AdminEditDispute from "./pages/AdminEditDispute";
import Approval from "./pages/Approval";
import UserStatusAdmin from "./pages/UserStatusAdmin";

// Password & payment pages
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Success from "./pages/Success";
import AdminAttendance from "./pages/AdminAttendance";

function App() {
  return (
    <Router>
      <Routes>
        // Stripe success page
        <Route path="/paymentsuccess" element={<Success />} />

        // Pricing page (logged-in users)
        <Route
          path="/pricing"
          element={
            <PrivateRoute roles={["user"]}>
              <Pricing />
            </PrivateRoute>
          }
        />

        // All layout-based routes
        <Route path="/" element={<Layout />}>

          // Public routes
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />

          // User (Employee) routes
          <Route
            path="dashboard"
            element={
              <PrivateRoute roles={["user"]}>
                <EmployeeDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="dailylog"
            element={
              <PrivateRoute roles={["user"]}>
                <DailyLog />
              </PrivateRoute>
            }
          />
          <Route
            path="productivity"
            element={
              <PrivateRoute roles={["user"]}>
                <Productivity />
              </PrivateRoute>
            }
          />
          <Route
            path="notifications"
            element={
              <PrivateRoute roles={["user"]}>
                <Notifications />
              </PrivateRoute>
            }
          />
          <Route
            path="productivityreport"
            element={
              <PrivateRoute roles={["user"]}>
                <ProductivityReport />
              </PrivateRoute>
            }
          />
          <Route
            path="apply-leave"
            element={
              <PrivateRoute roles={["user"]}>
                <ApplyLeave />
              </PrivateRoute>
            }
          />
          <Route
            path="premium"
            element={
              <PrivateRoute roles={["user"]}>
                <PremiumFeatures />
              </PrivateRoute>
            }
          />
          <Route
            path="premiumdashboard"
            element={
              <PrivateRoute roles={["user"]}>
                <PremiumDashboard />
              </PrivateRoute>
            }
          />
          <Route path="attendance" element={<Attendance />} />
          <Route path="time" element={<TimeTracker />} />
          <Route path="profile" element={<Profile />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="chat" element={<Chats />} />
          <Route path="disputes/create" element={<CreateDispute />} />
          <Route path="createreminder" element={<CreateReminder />} />
          <Route path="all-reminders" element={<AllReminders />} />

          // Manager routes
          <Route
            path="taskmanager"
            element={
              <PrivateRoute roles={["manager"]}>
                <TaskManagerDashboard />
              </PrivateRoute>
            }
          />
          <Route path="manager/tasks" element={<ManagerTaskList />} />
          <Route path="manager/add-task" element={<ManagerAddTask />} />
          <Route path="manager/leaves" element={<ManagerLeaves />} />
          <Route path="manager/projects" element={<ProjectsPage />} />
          <Route path="manager/teams" element={<TeamsPage />} />
          <Route path="manager/records" element={<ManagerRecords />} />
          <Route path="manager/chat" element={<ManagerChat />} />

          // Admin routes
          <Route
            path="admin"
            element={
              <PrivateRoute roles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route path="admin/users" element={<AdminUsers />} />
          <Route path="admin/tasks" element={<AdminTasks />} />
          <Route path="admin/reports" element={<AdminReports />} />
          <Route path="admin/roles" element={<AdminRolePermissions />} />
          <Route path="admin/disputes" element={<AdminDisputes />} />
          <Route path="admin/approval" element={<Approval />} />
          <Route path="admin/user-status" element={<UserStatusAdmin />} />
          <Route path="admin/disputes/edit/:id" element={<AdminEditDispute />} />
          <Route path="admin/attendance" element={<AdminAttendance/>} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
