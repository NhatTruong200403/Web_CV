import { Route, Routes } from "react-router-dom";
import JobList from "../components/Job/JobList";
import JobDetail from "../components/Job/JobDetail";

const AppRoutes = () => {
    return (
        <div className="mt-5">
            <Routes>
                <Route path="/" element={<JobList />} />
                <Route path="/" element={<JobDetail />} />
            </Routes>
        </div>
    );
};

export default AppRoutes;