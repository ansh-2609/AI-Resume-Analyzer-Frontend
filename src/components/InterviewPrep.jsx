import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseIcon,
  ArrowRightIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
import { fetchInterviewQuestions } from "../services/appServices";
import { setJobId, setJobTitle, setQuestions } from "../store/interviewQuestionsSlice";

const jobs = [
  // {
  //   id: "frontend",
  //   title: "Frontend Developer",
  //   level: "Mid-Level",
  //   description: "UI, performance, accessibility",
  // },
  {
    id: "react",
    title: "React Developer",
    level: "Mid-Level",
    description: "React, UI, performance, accessibility",
  },
  {
    id: "backend",
    title: "Backend Developer",
    level: "Junior–Mid",
    description: "APIs, databases, auth, scalability",
  },
  {
    id: "data",
    title: "Data Scientist",
    level: "Entry–Mid",
    description: "ML, stats, data analysis",
  },
  {
    id: "devops",
    title: "DevOps Engineer",
    level: "Mid–Senior",
    description: "CI/CD, cloud, monitoring",
  },
];

function InterviewPrep() {
  // const [selectedJob, setSelectedJob] = useState(null);
  // const [selectedJobId, setSelectedJobId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";

  // if (selectedJob) {
  //   return (
  //     <InterviewPrepDetail
  //       jobTitle={selectedJob}
  //       onBack={() => setSelectedJob(null)}
  //     />
  //   );
  // }

  const handleSelectJob = async(jobTitle, jobId) => {

    dispatch(setJobTitle(jobTitle));
    dispatch(setJobId(jobId));

    const response = await fetchInterviewQuestions(jobTitle.toLowerCase());
    console.log('Interview Questions for', jobTitle, ':', response);
    dispatch(setQuestions(response));
    console.log('jobid', jobId);
    const path = `/${jobId}-interview-questions`;
    navigate(path);

  }

  return (
    <div
      className={`min-h-screen px-4 py-8 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          Interview Preparation
        </h1>
        <p className={isDark ? "text-gray-400 mb-8" : "text-gray-600 mb-8"}>
          Choose a role to start your interview prep
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => handleSelectJob(job.title, job.id)}
              className={`p-6 rounded-xl border cursor-pointer transition-all ${
                isDark
                  ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                  : "bg-white border-gray-200 hover:shadow-md"
              }`}
            >
              <div className="flex items-center mb-3">
                <BriefcaseIcon className="h-6 w-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold">
                  {job.title}
                </h2>
              </div>

              <p
                className={`text-sm mb-4 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {job.description}
              </p>

              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-1 text-xs rounded font-medium ${
                    isDark
                      ? "bg-blue-900/40 text-blue-300"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {job.level}
                </span>
                <ArrowRightIcon
                  className={`h-5 w-5 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InterviewPrep;
