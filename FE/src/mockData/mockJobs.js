const mockJobs = [
    {
        _id: "1",
        title: "Software Engineer",
        companyId: "60f7c88b8b1dcd001c5b92a1",
        jobApplyPositionId: "60f7c88b8b1dcd001c5b92a2",
        details: [
            "Develop and maintain web applications.",
            "Collaborate with cross-functional teams."
        ],
        benefits: [
            "Competitive salary.",
            "Flexible working hours."
        ],
        descriptions: [
            "Looking for a passionate software engineer to join our team.",
            "Work on cutting-edge technologies."
        ],
        requirements: [
            "Proficiency in JavaScript and React.js.",
            "Experience with Node.js and MongoDB."
        ],
        location: "Ho Chi Minh City, Vietnam",
        degree: "Bachelor's Degree in Computer Science",
        salary: {
        },
        jobType: "60f7c88b8b1dcd001c5b92a3",
        status: "pending"
    },
    {
        _id: "2",
        title: "Data Analyst",
        companyId: "60f7c88b8b1dcd001c5b92a4",
        jobApplyPositionId: "60f7c88b8b1dcd001c5b92a5",
        details: [
            "Analyze large datasets to extract insights.",
            "Create data visualizations and reports."
        ],
        benefits: [
            "Attractive bonus scheme.",
            "Health insurance."
        ],
        descriptions: [
            "Looking for an experienced data analyst.",
            "Opportunity to work in a dynamic environment."
        ],
        requirements: [
            "Strong SQL and Python skills.",
            "Experience with data visualization tools."
        ],
        location: "Hanoi, Vietnam",
        degree: "Bachelor's Degree in Data Science",
        salary: {
            fixed: 2000,
            negotiable: false
        },
        jobType: "60f7c88b8b1dcd001c5b92a6",
        status: "approved"
    },
    {
        _id: "3",
        title: "UX/UI Designer",
        companyId: "60f7c88b8b1dcd001c5b92a7",
        jobApplyPositionId: "60f7c88b8b1dcd001c5b92a8",
        details: [
            "Design intuitive user interfaces.",
            "Collaborate with developers and product teams."
        ],
        benefits: [
            "Work from home options.",
            "Annual performance bonus."
        ],
        descriptions: [
            "Seeking a creative UX/UI Designer.",
            "Work with the latest design tools."
        ],
        requirements: [
            "Proficiency in Figma, Adobe XD.",
            "Experience in user research and wireframing."
        ],
        location: "Da Nang, Vietnam",
        degree: "Bachelor's Degree in Design",
        salary: {
            min: 1200,
            max: 2500,
            negotiable: true
        },
        jobType: "60f7c88b8b1dcd001c5b92a9",
        status: "pending"
    },
    {
        _id: "4",
        title: "Project Manager",
        companyId: "60f7c88b8b1dcd001c5b92b1",
        jobApplyPositionId: "60f7c88b8b1dcd001c5b92b2",
        details: [
            "Lead and manage software development projects.",
            "Ensure timely project delivery."
        ],
        benefits: [
            "Company stock options.",
            "Leadership training programs."
        ],
        descriptions: [
            "Looking for an experienced Project Manager.",
            "Opportunity to work with international clients."
        ],
        requirements: [
            "Strong knowledge of Agile methodologies.",
            "Excellent leadership and communication skills."
        ],
        location: "Ho Chi Minh City, Vietnam",
        degree: "Master's Degree in Project Management",
        salary: {
            min: 2500,
            max: 5000,
            negotiable: true
        },
        jobType: "60f7c88b8b1dcd001c5b92b3",
        status: "approved"
    },
    {
        _id: "5",
        title: "Cyber Security Engineer",
        companyId: "60f7c88b8b1dcd001c5b92b4",
        jobApplyPositionId: "60f7c88b8b1dcd001c5b92b5",
        details: [
            "Protect company systems from cyber threats.",
            "Implement security protocols and strategies."
        ],
        benefits: [
            "Attractive salary package.",
            "Work with a team of security experts."
        ],
        descriptions: [
            "Hiring a Cyber Security Engineer with experience in penetration testing.",
            "Join a fast-growing security team."
        ],
        requirements: [
            "Proficiency in network security and ethical hacking.",
            "Knowledge of SIEM tools."
        ],
        location: "Hanoi, Vietnam",
        degree: "Bachelor's Degree in Cyber Security",
        salary: {
            min: 2000,
            max: 4000,
            negotiable: true
        },
        jobType: "60f7c88b8b1dcd001c5b92b6",
        status: "pending"
    },
    {
        _id: "6",
        title: "Marketing Specialist",
        companyId: "60f7c88b8b1dcd001c5b92b7",
        jobApplyPositionId: "60f7c88b8b1dcd001c5b92b8",
        details: [
            "Develop and execute marketing strategies.",
            "Manage social media campaigns."
        ],
        benefits: [
            "Travel opportunities.",
            "Company-sponsored certifications."
        ],
        descriptions: [
            "Looking for a Marketing Specialist with experience in digital marketing.",
            "Work in a dynamic and creative team."
        ],
        requirements: [
            "Experience in SEO, SEM, and content marketing.",
            "Strong analytical and communication skills."
        ],
        location: "Da Nang, Vietnam",
        degree: "Bachelor's Degree in Marketing",
        salary: {
            fixed: 1800,
            negotiable: false
        },
        jobType: "60f7c88b8b1dcd001c5b92b9",
        status: "approved"
    }
];

export default mockJobs;
