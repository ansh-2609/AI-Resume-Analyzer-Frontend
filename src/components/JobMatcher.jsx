
import { useState } from 'react';
import {
  LinkIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTopRightOnSquareIcon,
  SparklesIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchUserResumes, matchJob } from '../services/appServices';

function JobMatcher() {
    const [jobDescription, setJobDescription] = useState('');
    const [matchResult, setMatchResult] = useState({
      score: 0,
      strongMatches: [],
      missing: [],
      suggestions: [],
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const [resumes, setResumes] = useState(null);
    const [selectedResume, setSelectedResume] = useState(null);

    const userId = useSelector((state) => state.auth.userId);

    const theme = useSelector((state) => state.theme.theme);
    const isDark = theme === "dark";
    

    useEffect(() => {
      const loadResumes = async () => {
        try {
          const data = await fetchUserResumes(userId);
          setResumes(data);
        } catch (err) {
          console.error(err);
        }
      };

      loadResumes();
    }, [userId]);

    const analyzeJob = async () => {
      if (!jobDescription.trim()) {
        setError("Please paste a job description");
        return;
      }

      if (!selectedResume) {
        setError("Please select a resume first");
        return;
      }

      setLoading(true);
      setIsAnalyzing(true);
      setError(null);

      try {
        const matchData = await matchJob(selectedResume.id, jobDescription);

        // Defensive defaults
        setMatchResult({
          score: matchData?.score ?? 0,
          strongMatches: matchData?.strongMatches ?? [],
          missing: matchData?.missing ?? [],
          suggestions: matchData?.suggestions ?? [],
        });
      } catch (err) {
        console.error(err);
        setError("Failed to analyze job description");

        // Reset safely on error
        setMatchResult({
          score: 0,
          strongMatches: [],
          missing: [],
          suggestions: [],
        });
      } finally {
        setLoading(false);
        setTimeout(() => setIsAnalyzing(false), 500);
      }
    };



    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            analyzeJob();
        }
    };

    const getScoreBadgeColor = (score, isDark) => {
      if (score >= 80) {
        return isDark
          ? "bg-green-900/30 text-green-400"
          : "bg-green-100 text-green-700";
      }

      if (score >= 60) {
        return isDark
          ? "bg-yellow-900/30 text-yellow-400"
          : "bg-yellow-100 text-yellow-700";
      }

      return isDark
        ? "bg-red-900/30 text-red-400"
        : "bg-red-100 text-red-700";
    };


    const getScoreTextColor = (score) => {
      if (score >= 80) return "text-green-500";
      if (score >= 60) return "text-yellow-500";
      return "text-red-500";
    };


    const getScoreRingColor = (score) => {
        if (score >= 80) return 'stroke-green-500';
        if (score >= 60) return 'stroke-yellow-500';
        return 'stroke-red-500';
    };

    return (
  <div className={`min-h-screen px-4 py-8 lg:px-8 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 mt-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              Job Matcher
            </h1>
            <p className={`mt-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Select a resume and paste a job description to analyze how well your resume matches
            </p>
          </div>
          <div className={`hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg ${isDark ? "bg-blue-900/30" : "bg-blue-50"}`}>
            <SparklesIcon className="h-5 w-5 text-blue-600" />
            <span className={`text-sm font-medium ${isDark ? "text-blue-300" : "text-blue-700"}`}>
              AI-Powered Matching
            </span>
          </div>
        </div>
      </div>
      {/* Resume Selection Modal/Top Section */}
      <div className={`rounded-xl shadow-sm p-6 ${isDark ? "bg-gray-800" : "bg-white"} mb-4`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
          Select Resume
        </h3>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {resumes && resumes.map((resume) => {
            const isSelected = selectedResume?.id === resume.id;

            return (
              <div
                key={resume.id}
                onClick={() => {
                  if (selectedResume?.id === resume.id) {
                    setSelectedResume(null);
                    return;
                  }
                  else {
                    setSelectedResume(resume);
                  }
                }}
                className={`p-3 border rounded-lg cursor-pointer transition
                            ${
                              isSelected
                                ? isDark
                                  ? "border-blue-500 bg-blue-900/30"
                                  : "border-blue-600 bg-blue-50"
                                : isDark
                                  ? "border-gray-700 hover:bg-gray-700/50"
                                  : "border-gray-200 hover:bg-gray-50"
                            }`}
              >
                <div className="flex items-center">
                  <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                      {resume.name || "Untitled Resume"}
                    </p>
                    <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {new Date(resume.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!selectedResume && (
          <p className="text-sm text-red-500 mt-3">
            Please select a resume before analyzing
          </p>
        )}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Job Analysis */}
        <div className="lg:col-span-2 space-y-8">
          {/* URL Input Card */}
          <div className={`rounded-xl shadow-sm p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex items-center mb-6">
              <div className={`p-2 rounded-lg ${isDark ? "bg-blue-900/30" : "bg-blue-100"}`}>
                <LinkIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h2 className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                  Analyze Job Match
                </h2>
                <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Paste a job description to analyze how well your resume matches
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    rows={8}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here..."
                    className={`block w-full py-4 px-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      isDark 
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                        : "border-gray-300"
                    }`}
                  />
                </div>
                <button
                  onClick={analyzeJob}
                  disabled={loading || !selectedResume || !jobDescription.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-r-lg disabled:opacity-50 hover:bg-blue-700 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-5 w-5 mr-2" />
                      Analyze Match
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className={`p-4 border rounded-lg ${
                  isDark 
                    ? "bg-red-900/20 border-red-800" 
                    : "bg-red-50 border-red-200"
                }`}>
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
                    <span className={isDark ? "text-red-300" : "text-red-700"}>{error}</span>
                  </div>
                </div>
              )}

              <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                <p>
                  ✅ Tip: Copy the job description directly from LinkedIn, Indeed,
                  or the company careers page
                </p>
              </div>
            </div>
          </div>

          {/* Results Card */}
          {!loading &&
          (matchResult.score > 0 ||
            matchResult.strongMatches.length > 0 ||
            matchResult.missing.length > 0 ||
            matchResult.suggestions.length > 0) && (
            <div className={`rounded-xl shadow-sm p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                    Analysis Results
                  </h2>
                  <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Based on your resume and job requirements
                  </p>
                </div>
                <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Based on pasted job description
                </span>
              </div>

              {/* Score Circle */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <svg className="w-48 h-48" viewBox="0 0 120 120">
                    {/* Background circle */}
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke={isDark ? "#374151" : "#e5e7eb"} // gray-700 for dark, gray-200 for light
                      strokeWidth="12"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      strokeLinecap="round"
                      strokeWidth="12"
                      strokeDasharray="339.292"
                      strokeDashoffset={
                        339.292 * (1 - matchResult.score / 100)
                      }
                      className={getScoreRingColor(matchResult.score)}
                      transform="rotate(-90 60 60)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className={`text-5xl font-bold ${
                        getScoreTextColor(matchResult.score)
                      }`}
                    >
                      {matchResult.score}%
                    </span>
                    <span className={`mt-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>Match Score</span>
                  </div>
                </div>
                <div
                  className={`mt-4 px-4 py-2 rounded-full text-sm font-medium ${getScoreBadgeColor(matchResult.score, isDark)}`}
                >
                  {matchResult.score >= 80
                    ? "Strong Match"
                    : matchResult.score >= 60
                    ? "Moderate Match"
                    : "Needs Improvement"}
                </div>
              </div>

              {/* Match Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strong Matches */}
                <div className={`border rounded-xl p-5 ${
                  isDark 
                    ? "border-green-800 bg-green-900/20" 
                    : "border-green-200 bg-green-50"
                }`}>
                  <div className="flex items-center mb-4">
                    <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
                    <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      Strong Matches
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {matchResult.strongMatches &&
                    matchResult.strongMatches.length > 0 ? (
                      matchResult.strongMatches.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                          <span className={isDark ? "text-gray-300" : "text-gray-700"}>{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className={isDark ? "text-gray-400" : "text-gray-600"}>
                        No strong matches found
                      </li>
                    )}
                  </ul>
                </div>


                {/* Missing Skills */}
                <div className={`border rounded-xl p-5 ${
                  isDark 
                    ? "border-amber-800 bg-amber-900/20" 
                    : "border-amber-200 bg-amber-50"
                }`}>
                  <div className="flex items-center mb-4">
                    <ExclamationTriangleIcon className="h-6 w-6 text-amber-600 mr-2" />
                    <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      Areas to Improve
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {matchResult.missing &&
                    matchResult.missing.length > 0 ? (
                      matchResult.missing.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <ExclamationTriangleIcon className="h-5 w-5 text-amber-500 mr-2 mt-0.5 shrink-0" />
                          <span className={isDark ? "text-gray-300" : "text-gray-700"}>{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className={isDark ? "text-gray-400" : "text-gray-600"}>
                        No significant gaps found
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Recommendations */}
              {matchResult.suggestions.length > 0 && (
                <div className={`mt-6 border rounded-xl p-5 ${
                  isDark 
                    ? "border-blue-800 bg-blue-900/20" 
                    : "border-blue-200 bg-blue-50"
                }`}>
                  <div className="flex items-center mb-4">
                    <SparklesIcon className="h-6 w-6 text-blue-600 mr-2" />
                    <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      AI Suggestions
                    </h3>
                  </div>

                  <ul className="space-y-3">
                    {matchResult.suggestions.map((rec, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className={`mr-3 mt-1 w-2 h-2 rounded-full ${
                          isDark ? "bg-blue-400" : "bg-blue-500"
                        }`} />
                        <span className={isDark ? "text-gray-300" : "text-gray-700"}>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Recent Jobs & Stats */}
        <div className="space-y-8">
          {/* Tips Card */}
          <div className={`rounded-xl shadow-sm p-6 border ${
            isDark 
              ? "bg-gray-800 border-gray-700" 
              : "bg-linear-to-br from-blue-50 to-indigo-50 border-blue-100"
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              💡 Tips for Better Matches
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="mr-3 mt-1">
                  <div className={`w-2 h-2 rounded-full ${isDark ? "bg-blue-400" : "bg-blue-500"}`}></div>
                </div>
                <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                  Update your resume with specific skills mentioned in job descriptions
                </span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1">
                  <div className={`w-2 h-2 rounded-full ${isDark ? "bg-blue-400" : "bg-blue-500"}`}></div>
                </div>
                <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                  Focus on roles with 70%+ match for higher success rates
                </span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1">
                  <div className={`w-2 h-2 rounded-full ${isDark ? "bg-blue-400" : "bg-blue-500"}`}></div>
                </div>
                <span className={isDark ? "text-gray-300" : "text-gray-300"}>
                  Use keywords from job titles in your resume
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Analysis Progress Animation */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-2xl p-8 max-w-md w-full mx-4 ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}>
            <div className="text-center">
              <div className="mx-auto mb-6 relative">
                <ArrowPathIcon className="h-16 w-16 text-blue-600 animate-spin mx-auto" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                Analyzing Job Match
              </h3>
              <p className={`mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Our AI is comparing your resume with the job requirements...
              </p>
              <div className={`w-full rounded-full h-2 ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
                <div
                  className="bg-blue-600 h-2 rounded-full animate-pulse"
                  style={{ width: "70%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

}


export default JobMatcher;

