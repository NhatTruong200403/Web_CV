import { createContext, useContext } from "react";

export const JobContext = createContext({
    reloadJobs: () => { },
});

export const useJobContext = () => useContext(JobContext);