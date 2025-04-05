import { Route, Routes } from "react-router-dom";
import JobList from "../components/Job/JobList";

const AppRoutes = () => {
    return (
        <div className="mt-5">
            <Routes>
                <Route path="/" element={<JobList />} />
            </Routes>
        </div>
    );
};

export default AppRoutes;