import { createContext, useContext } from "react";

export const JobContext = createContext({
    reloadJobs: () => { }, // hàm mặc định
});

export const useJobContext = () => useContext(JobContext);