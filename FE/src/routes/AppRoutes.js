// src/routes/AppRoutes.js
import { Route, Routes, Navigate } from "react-router-dom";
import JobList from "../components/Job/JobList";
import { useAuth } from "../provider/AuthProvider";

// User Components
import UserProfile from "../components/User/UserProfile";
import UserApplications from "../components/User/UserApplications";
import ManageCv from "../components/User/ManageCV";

// Company Components
import CompanyJobList from "../components/Company/CompanyJobList";

// Admin Components
import ManageRoles from "../components/Admin/ManageRoles";
import ManageJobs from "../components/Admin/ManageJobs";
import ManageJobTypes from "../components/Admin/ManageJobTypes";
import ManageUsers from "../components/Admin/ManageUser";
import ManagePositionTypes from "../components/Admin/ManagePositionTypes";
// import AdminDashboard from "../components/Admin/AdminDashboard"; // Import nếu có component này

// --- Protected Route Components (Ví dụ Implementation) ---
// Bạn cần tạo các file riêng cho những component này hoặc định nghĩa tại đây
const ProtectedUserRoute = ({ children }) => {
    const { auth } = useAuth();
    // Cho phép User, Company, Admin truy cập (ví dụ)
    const isAllowed = auth.isAuthenticated; // Hoặc kiểm tra role cụ thể nếu cần
    if (!isAllowed) {
        // Redirect về trang chủ hoặc trang login nếu chưa đăng nhập
        return <Navigate to="/" replace />;
    }
    return children; // Render component con nếu được phép
};

const ProtectedCompanyRoute = ({ children }) => {
    const { auth } = useAuth();
    // Chỉ cho phép Company truy cập
    const isAllowed = auth.isAuthenticated && auth.role === 'Company';
    if (!isAllowed) {
        // Redirect về trang chủ nếu không phải Company
        return <Navigate to="/" replace />;
    }
    return children;
};

const ProtectedAdminRoute = ({ children }) => {
    const { auth } = useAuth();
    // Chỉ cho phép Admin truy cập
    const isAllowed = auth.isAuthenticated && auth.role === 'Admin';
    if (!isAllowed) {
         // Redirect về trang chủ nếu không phải Admin
        return <Navigate to="/" replace />;
    }
    return children;
};
// --- Kết thúc ví dụ Protected Route ---


const AppRoutes = () => {
    // const { auth } = useAuth(); // Không cần auth ở đây nếu dùng Protected Route Components

    return (
        <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<JobList />} />
            {/* Thêm các route public khác nếu cần, ví dụ: chi tiết job public */}
            {/* <Route path="/job/:id" element={<PublicJobDetail />} /> */}


            {/* --- User Routes (Cần đăng nhập) --- */}
            <Route
                path="/profile"
                element={<ProtectedUserRoute><UserProfile /></ProtectedUserRoute>}
            />
             <Route
                path="/my-applications"
                element={<ProtectedUserRoute><UserApplications /></ProtectedUserRoute>}
            />
            <Route
                path="/manage-cv"
                element={<ProtectedUserRoute><ManageCv /></ProtectedUserRoute>}
            />
             {/* Các route khác chỉ User mới thấy */}


            {/* --- Company Routes (Cần role Company) --- */}
            <Route
                path="/company/jobs"
                element={<ProtectedCompanyRoute><CompanyJobList /></ProtectedCompanyRoute>}
            />

<Route
                path="/PersonalPosts"
                element={<ProtectedCompanyRoute><CompanyJobList /></ProtectedCompanyRoute>}
            />
             {/* Các route khác chỉ Company mới thấy */}


            {/* --- Admin Routes (Cần role Admin) --- */}
            {/* Sử dụng layout chung cho admin nếu có, ví dụ AdminDashboard */}
            {/* <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboardLayout /></ProtectedAdminRoute>}> */}
                {/* <Route index element={<AdminDashboardSummary />} /> */} {/* Trang mặc định /admin */}
                {/* <Route path="dashboard" element={<AdminDashboardSummary />} /> */}
                <Route path="/admin/roles" element={<ProtectedAdminRoute><ManageRoles /></ProtectedAdminRoute>} />
                <Route path="/admin/jobs" element={<ProtectedAdminRoute><ManageJobs /></ProtectedAdminRoute>} />
                <Route path="/admin/job-types" element={<ProtectedAdminRoute><ManageJobTypes /></ProtectedAdminRoute>} />
                <Route path="/admin/users" element={<ProtectedAdminRoute><ManageUsers /></ProtectedAdminRoute>} />
                <Route path="/admin/position-types" element={<ProtectedAdminRoute><ManagePositionTypes /></ProtectedAdminRoute>} /> 
            {/* </Route> */}


            {/* Catch-all Route (Trang 404 hoặc redirect về home) */}
            {/* Nên có một trang 404 NotFound riêng */}
            {/* <Route path="*" element={<NotFound />} /> */}
            <Route path="*" element={<Navigate to="/" replace />} /> {/* Hoặc redirect về home */}

        </Routes>
    );
};

export default AppRoutes;