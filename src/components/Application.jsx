import React, { useState } from 'react';
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowTopRightOnSquareIcon,
  StarIcon,
  ChartBarIcon,
  FunnelIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FireIcon,
  LightBulbIcon,
  BeakerIcon,
  DocumentTextIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid,
  FireIcon as FireIconSolid
} from '@heroicons/react/24/solid';

import { useDispatch, useSelector } from 'react-redux';
import { setJobMatched } from '../store/jobMatched';
import { deleteResume, downloadResume, fetchMatchedJobs, fetchUserResumes } from '../services/appServices';
import { useEffect } from 'react';

function Application() {
  const [resumes, setResumes] = useState(null);
  const [expandedJob, setExpandedJob] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('score');

  const allresume = useSelector((state) => state.resume.resumes);
  const [selectedResume, setSelectedResume] = useState(null);
  const [selectedPage, setSelectedPage] = useState('1');
  const [progress, setProgress] = useState('');
  const dispatch = useDispatch();

  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";



  const matchedJobs = useSelector((state) => state.jobMatched.matchedJobs);
  const userId = useSelector((state) => state.auth.userId);
  console.log("Matched Jobs in Application.jsx:", matchedJobs);

  useEffect(() => {
      const fetchResumes = async () => {
          try {
              const allresume = await fetchUserResumes(userId);
              setResumes(allresume);
          } catch (error) {
              console.error('Error fetching resumes:', error);
          }
      };

      fetchResumes();
  }, [userId,dispatch]);

  const handleFindJobs = async (resumeId) => {
    // setSelectedResumeId(resumeId);
    setProgress('Finding matched jobs...');
    const matched = await fetchMatchedJobs(resumeId);
    console.log('Matched Jobs:', matched);
    dispatch(setJobMatched(matched));
    setProgress('All Matched Jobs Found...');
  };

  const handleDownload = async(id) => {
      try{
          const response = await downloadResume(id, userId);
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'resume.pdf';
          link.click();
          URL.revokeObjectURL(url);

      }catch(error){
          console.log(error);
      }
  }

  const handleDeleteResume = async(resumeId) => {
    await deleteResume(resumeId);
    const updatedResumes = await fetchUserResumes(userId);
    dispatch(setResumes(updatedResumes));
    setSelectedResume(null);
  }


  const toggleExpand = (jobId) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'bg-gradient-to-r from-green-500 to-emerald-600';
    if (score >= 6) return 'bg-gradient-to-r from-yellow-500 to-amber-600';
    if (score >= 4) return 'bg-gradient-to-r from-orange-500 to-red-500';
    return 'bg-gradient-to-r from-gray-400 to-gray-600';
  };

  const getScoreTextColor = (score) => {
    if (score >= 8) return 'text-green-700';
    if (score >= 6) return 'text-yellow-700';
    if (score >= 4) return 'text-orange-700';
    return 'text-gray-700';
  };

  const getScoreBgColor = (score) => {
    if (score >= 8) return 'bg-green-50 border-green-200';
    if (score >= 6) return 'bg-yellow-50 border-yellow-200';
    if (score >= 4) return 'bg-orange-50 border-orange-200';
    return 'bg-gray-50 border-gray-200';
  };

  const filteredJobs = matchedJobs.filter(job => {
    if (filter === 'high') return job.score >= 8;
    if (filter === 'medium') return job.score >= 6 && job.score < 8;
    if (filter === 'low') return job.score < 6;
    return true;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score;
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'company') return a.company.localeCompare(b.company);
    return 0;
  });

  const PAGE_SIZE = 10;
  const currentPage = Number(selectedPage);

  const paginatedJobs = sortedJobs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const stats = {
    total: matchedJobs.length,
    highMatch: matchedJobs.filter(job => job.score >= 8).length,
    avgScore: matchedJobs.reduce((acc, job) => acc + job.score, 0) / matchedJobs.length,
    topSkills: matchedJobs.reduce((acc, job) => {
      job.strengths.forEach(skill => {
        acc[skill] = (acc[skill] || 0) + 1;
      });
      return acc;
    }, {})
  };

  const topSkills = Object.entries(stats.topSkills)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([skill]) => skill);

  return (
    <div className={`min-h-screen px-4 py-8 lg:px-8 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Matched Jobs</h1>
              <p className={`mt-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Discover opportunities that match your resume
              </p>
            </div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${isDark ? "bg-gray-800 border-gray-700 from-blue-900/30 to-indigo-900/30" : "bg-linear-to-r from-blue-50 to-indigo-50 border-blue-100"}`}>
              <FireIcon className="h-5 w-5 text-orange-600" />
              <span className={`text-sm font-medium ${isDark ? "text-blue-300" : "text-blue-700"}`}>
                {stats.highMatch} High-Match Opportunities
              </span>
            </div>
          </div>
        </div>

        {/* Stats & Filters */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 mb-8">
          {/* Left Column: Stats */}
          <div className="xl:col-span-2 space-y-6">
            <div className={`rounded-xl shadow-sm p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}>
              <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                Resume Preview
              </h2>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {resumes &&
                  resumes.map((resume) => {
                    const isSelected = selectedResume?.id === resume.id;

                    return (
                      <div
                        key={resume.id}
                        onClick={() => {

                          if (selectedResume?.id === resume.id) {
                            // Deselect
                            setSelectedResume(null);
                            return;
                          }

                          const selected = {
                            id: resume.id,
                            name: resume.name,
                            score: resume.resume_score || 0,
                            strengths: resume.resume_feedback?.strengths || [],
                            weaknesses:
                              resume.resume_feedback?.weaknesses || [],
                            improvements:
                              resume.resume_feedback?.improvements || [],
                          };
                          setSelectedResume(selected);
                        }}
                        className={`border rounded-lg p-4 cursor-pointer transition
                                    ${isSelected
                                        ? isDark 
                                          ? "border-blue-500 bg-blue-900/30" 
                                          : "border-blue-600 bg-blue-50"
                                        : isDark
                                          ? "border-gray-700 hover:bg-gray-700/50"
                                          : "border-gray-200 hover:bg-gray-50"
                                    }`}
                      >
                        <div className="flex items-start mb-3 flex-wrap">
                          <DocumentTextIcon className="h-6 w-6 text-blue-600 mr-2 shrink-0" />
                          <div>
                            <h3 className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                              {resume.name || "Untitled Resume"}
                            </h3>
                            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                              Uploaded{" "}
                              {new Date(resume.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className={`text-sm whitespace-pre-line ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                          {isSelected && (
                            <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                              {(progress && (
                                <ClockIcon className="inline h-4 w-4 mr-1" />
                              )) ||
                                ""}
                              {progress || ""}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {selectedResume && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleDownload(selectedResume.id)}
                    className={`px-4 py-2 border rounded-md text-sm cursor-pointer ${
                      isDark 
                        ? "border-gray-600 text-white hover:bg-gray-700" 
                        : "border-gray-300 text-black hover:bg-gray-50"
                    }`}
                  >
                    Download
                  </button>

                  <button
                    disabled={progress === "Finding matched jobs..."}
                    onClick={() => handleFindJobs(selectedResume.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm cursor-pointer hover:bg-blue-700"
                  >
                    Find Jobs
                  </button>

                  <button
                    onClick={() => handleDeleteResume(selectedResume.id)}
                    className="col-span-2 px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 cursor-pointer"
                  >
                    Delete Resume
                  </button>
                </div>
              )}
            </div>
            
            <div className={`rounded-xl shadow-sm p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                Matching Overview
              </h3>

              <div className="space-y-4">
                <div className={`flex items-center justify-between p-3 rounded-lg ${
                  isDark 
                    ? "bg-gray-700/50" 
                    : "bg-linear-to-r from-blue-50 to-indigo-50"
                }`}>
                  <div className="flex items-center">
                    <BriefcaseIcon className="h-5 w-5 text-blue-600 mr-3" />
                    <span className={isDark ? "text-gray-300" : "text-gray-700"}>Total Matches</span>
                  </div>
                  <span className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                    {stats.total}
                  </span>
                </div>

                <div className={`flex items-center justify-between p-3 rounded-lg ${
                  isDark 
                    ? "bg-gray-700/50" 
                    : "bg-linear-to-r from-green-50 to-emerald-50"
                }`}>
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-green-600 mr-3" />
                    <span className={isDark ? "text-gray-300" : "text-gray-700"}>Avg. Match Score</span>
                  </div>
                  <span className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                    {stats.avgScore.toFixed(1)}/10
                  </span>
                </div>

                <div className={`flex items-center justify-between p-3 rounded-lg ${
                  isDark 
                    ? "bg-gray-700/50" 
                    : "bg-linear-to-r from-purple-50 to-violet-50"
                }`}>
                  <div className="flex items-center">
                    <FireIconSolid className="h-5 w-5 text-purple-600 mr-3" />
                    <span className={isDark ? "text-gray-300" : "text-gray-700"}>High Matches (8+)</span>
                  </div>
                  <span className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                    {stats.highMatch}
                  </span>
                </div>
              </div>

              {/* Top Skills */}
              {topSkills.length > 0 && (
                <div className="mt-6">
                  <h4 className={`text-sm font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                    Your Top Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {topSkills.map((skill, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          isDark 
                            ? "bg-blue-900/50 text-blue-300" 
                            : "bg-linear-to-r from-blue-100 to-indigo-100 text-blue-700"
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
            </div>

            {/* Filter Card */}
            <div className={`mt-6 rounded-xl shadow-sm p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                Filter & Sort
              </h3>

              <div className="space-y-4">
                <div>
                  <label className={`flex items-center text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    <FunnelIcon className="h-4 w-4 mr-2" />
                    Filter by Match Score
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["all", "high", "medium", "low"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                          filter === type
                            ? "bg-blue-600 text-white"
                            : isDark
                              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {type === "high"
                          ? "High (8+)"
                          : type === "medium"
                          ? "Medium (6-8)"
                          : type === "low"
                          ? "Low (<6)"
                          : "All"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`flex items-center text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    <ChartBarIcon className="h-4 w-4 mr-2" />
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      isDark 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "border-gray-300"
                    }`}
                  >
                    <option value="score">Match Score (High to Low)</option>
                    <option value="title">Job Title (A-Z)</option>
                    <option value="company" >Company (A-Z)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Job Listings */}
          <div className="xl:col-span-3">
            <div className={`rounded-xl shadow-sm p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {sortedJobs.length} Job{sortedJobs.length !== 1 ? "s" : ""}{" "}
                  Found
                </h2>
                <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Showing {sortedJobs.length} of {matchedJobs.length}
                </span>
              </div>

              {sortedJobs.length === 0 ? (
                <div className="text-center py-12">
                  <BeakerIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className={`text-lg font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    No matches found
                  </h3>
                  <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                    Try adjusting your filters or update your resume
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {paginatedJobs.map((job, index) => (
                    <div
                      key={index}
                      className={`border rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md ${
                        expandedJob === index
                          ? isDark
                            ? "border-blue-500 shadow-sm"
                            : "border-blue-300 shadow-sm"
                          : isDark
                            ? "border-gray-700 hover:border-gray-600"
                            : "border-gray-200"
                      }`}
                    >
                      {/* Job Header */}
                      <div className={`p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                                {job.title}
                              </h3>
                              {job.score >= 8 && (
                                <span className={`flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                  isDark 
                                    ? "bg-green-900/30 text-green-300" 
                                    : "bg-linear-to-r from-green-100 to-emerald-100 text-green-800"
                                }`}>
                                  <FireIconSolid className="h-3 w-3 mr-1" />
                                  Top Match
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm mb-3">
                              <span className={`flex items-center ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                                {job.company}
                              </span>
                              <span className={`flex items-center ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                <MapPinIcon className="h-4 w-4 mr-1" />
                                {job.location}
                              </span>
                            </div>

                            <p className={`text-sm line-clamp-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                              {job.description.split("\n")[0]}
                            </p>
                          </div>

                          {/* Score Circle */}
                          <div className="ml-4 flex flex-col items-center">
                            <div className="relative">
                              <div
                                className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${getScoreBgColor(
                                  job.score,
                                  isDark
                                )}`}
                              >
                                <div className="text-center">
                                  <div
                                    className={`text-2xl font-bold ${getScoreTextColor(
                                      job.score
                                    )}`}
                                  >
                                    {job.score}
                                  </div>
                                  <div
                                    className={`text-xs font-medium ${getScoreTextColor(
                                      job.score
                                    )}`}
                                  >
                                    /10
                                  </div>
                                </div>
                              </div>
                              <div
                                className={`absolute -top-1 -right-1 w-6 h-6 rounded-full ${getScoreColor(
                                  job.score
                                )} flex items-center justify-center`}
                              >
                                <StarIconSolid className="h-3 w-3 text-white" />
                              </div>
                            </div>
                            <span className={`text-xs mt-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                              Match Score
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <a
                              href={job.applyLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
                            >
                              <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
                              Apply Now
                            </a>
                            <button
                              onClick={() => toggleExpand(index)}
                              className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg ${
                                isDark
                                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {expandedJob === index ? (
                                <>
                                  <ChevronUpIcon className="h-4 w-4 mr-2" />
                                  Show Less
                                </>
                              ) : (
                                <>
                                  <ChevronDownIcon className="h-4 w-4 mr-2" />
                                  View Details
                                </>
                              )}
                            </button>
                          </div>

                          <button className={`${isDark ? "text-gray-500 hover:text-gray-400" : "text-gray-400 hover:text-gray-600"}`}>
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedJob === index && (
                        <div className={`border-t p-6 ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"}`}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Strengths */}
                            <div>
                              <div className="flex items-center mb-4">
                                <div className={`p-2 rounded-lg mr-3 ${isDark ? "bg-green-900/30" : "bg-green-100"}`}>
                                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                </div>
                                <h4 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                                  Your Strengths
                                </h4>
                              </div>
                              <ul className="space-y-2">
                                {job.strengths.map((strength, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                                    <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                                      {strength}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Missing Skills */}
                            <div>
                              <div className="flex items-center mb-4">
                                <div className={`p-2 rounded-lg mr-3 ${isDark ? "bg-amber-900/30" : "bg-amber-100"}`}>
                                  <ExclamationCircleIcon className="h-5 w-5 text-amber-600" />
                                </div>
                                <h4 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                                  Missing Skills
                                </h4>
                              </div>
                              <ul className="space-y-2">
                                {job.missing.map((missing, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <ExclamationCircleIcon className="h-5 w-5 text-amber-500 mr-2 mt-0.5 shrink-0" />
                                    <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                                      {missing}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Job Description Preview */}
                          <div className="mt-6">
                            <h4 className={`text-lg font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                              Job Description
                            </h4>
                            <div className={`border rounded-lg p-4 max-h-48 overflow-y-auto ${
                              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                            }`}>
                              <p className={`text-sm whitespace-pre-line ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                {job.description.length > 500
                                  ? `${job.description.substring(0, 500)}...`
                                  : job.description}
                              </p>
                            </div>
                          </div>

                          {/* Recommendations */}
                          <div className={`mt-6 p-4 rounded-lg border ${
                            isDark 
                              ? "bg-blue-900/20 border-blue-800" 
                              : "bg-linear-to-r from-blue-50 to-indigo-50 border-blue-100"
                          }`}>
                            <div className="flex items-center mb-3">
                              <LightBulbIcon className="h-5 w-5 text-blue-600 mr-2" />
                              <h4 className={`text-sm font-semibold ${isDark ? "text-blue-300" : "text-blue-900"}`}>
                                AI Recommendation
                              </h4>
                            </div>
                            <p className={`text-sm ${isDark ? "text-blue-200" : "text-blue-800"}`}>
                              {job.score >= 8
                                ? "Strong match! Your skills align well with 80%+ of requirements. Consider highlighting your experience with C++ and Python in your application."
                                : job.score >= 6
                                ? "Good match! Focus on gaining experience with the missing skills to increase your chances."
                                : "Consider gaining more experience in the missing areas or look for roles with better alignment."}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {sortedJobs.length > 0 && (
                <div className="mt-8 flex items-center justify-between">
                  <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Showing {(currentPage - 1) * PAGE_SIZE + 1}-
                    {Math.min(currentPage * PAGE_SIZE, sortedJobs.length)} of{" "}
                    {sortedJobs.length} jobs
                  </div>
                  <div className="flex space-x-2">
                    <button className={`px-3 py-2 border rounded-lg text-sm font-medium ${
                      isDark 
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700" 
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}>
                      Previous
                    </button>
                    {["1", "2", "3"].map((page) => (
                      <button
                        key={page}
                        className={`px-3 py-2 border rounded-lg text-sm font-medium ${
                          selectedPage === page
                            ? isDark
                              ? "border-blue-500 bg-blue-900/30 text-blue-300"
                              : "border-blue-600 bg-blue-50 text-blue-600"
                            : isDark
                              ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                    <button className={`px-3 py-2 border rounded-lg text-sm font-medium ${
                      isDark 
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700" 
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}>
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tips Card */}
            <div className={`mt-6 rounded-xl shadow-sm p-6 border ${
              isDark 
                ? "bg-gray-800 border-gray-700" 
                : "bg-linear-to-r from-purple-50 to-pink-50 border-purple-100"
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                💡 Pro Tips for Applicants
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Apply within 48 hours of job posting for better response rates",
                  "Tailor your resume to include keywords from each job description",
                  "Focus on roles with 80%+ match score for highest success rate",
                  "Use our Job Matcher tool to analyze specific job postings"
                ].map((tip, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mr-3 mt-1">
                      <div className={`w-2 h-2 rounded-full ${isDark ? "bg-purple-400" : "bg-purple-500"}`}></div>
                    </div>
                    <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      {tip}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default Application;
