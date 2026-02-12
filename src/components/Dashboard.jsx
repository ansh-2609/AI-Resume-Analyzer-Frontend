import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import {
  DocumentArrowUpIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { analysisResume, fetchUserResumes, updateStats, uploadResume, downloadResume, deleteResume } from '../services/appServices';
import { useDispatch, useSelector } from 'react-redux';
import { setResumes } from '../store/resumeSlice';


function Dashboard() {
    const [resume, setResume] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const [selectedResume, setSelectedResume] = useState(null); //{resumeId: '', text: ''}
    const [metadata, setMetadata] = useState({
        score:0,
        strengths:[],
        weaknesses:[],
        improvements:[]
    });

    const dispatch = useDispatch(); 

    const userId = useSelector((state) => state.auth.userId);
    const allResumes = useSelector((state) => state.resume.resumes);

    const theme = useSelector((state) => state.theme.theme);
    const isDark = theme === "dark";
    
    console.log('All resumes:', allResumes);

    useEffect(() => {
        // Connect to WebSocket
        const socket = io('http://localhost:5000');
        
        socket.on('processing-123', (data) => {
            setProgress(data.message);
        });
        
        return () => socket.disconnect();
    }, []);
    
    useEffect(() => {
      if (!userId) return;
        const fetchResumes = async () => {
            try {
                // console.log('User ID for fetching resumes:', userId);
                const response = await fetchUserResumes(userId);
                // console.log('Fetched responseeeeeeeeeeee:', response);  
                dispatch(setResumes(response));

            } catch (error) {
                console.error('Error fetching resumes:', error);
            }
        };

        fetchResumes();
    }, [userId, dispatch]);

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleFileUpload = async (file) => {
        const formData = new FormData();
        formData.append('resume', file);
        
        setUploading(true);
        setProgress('Uploading file...');

        try {
            
            const response = await uploadResume(formData);
            console.log('response:', response);
            console.log('Upload response:', response.resumeId);
            console.log('response success:', response.success);
            setResume(response.success);
            setProgress('Analyzing resume...');

            const updatedResumes = await fetchUserResumes(userId);
            dispatch(setResumes(updatedResumes));

            const analysisResponse = await analysisResume(response.resumeId);
            
            console.log('AI Analysis:', analysisResponse);
            // setProgress('Analysis complete!');
            setProgress('Updating stats!');

            // Update stats
            const updatedStatsResponse = await updateStats(response.resumeId);
            console.log('Updated Stats:', updatedStatsResponse);
            setMetadata(updatedStatsResponse);

            setProgress('Stats Updated...');

            setTimeout(() => {
                setUploading(false);
                setProgress('');
            }, 2000);
        } catch (error) {
            console.error('Upload failed:', error);
            setProgress('Upload failed. Please try again.');
            setUploading(false);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
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

    const handleSelectedResume = async(resume) => {
      console.log('Selected resume:', resume);
      setMetadata({
        score: resume?.score || 0,
        strengths: resume?.strengths || [],
        weaknesses: resume?.weaknesses || [],
        improvements: resume?.improvements || []
      })

      console.log('metadata:', metadata);
    }

    const handleDeleteResume = async(resumeId) => {
      await deleteResume(resumeId);
      const updatedResumes = await fetchUserResumes(userId);
      dispatch(setResumes(updatedResumes));
      setSelectedResume(null);
      setResume(null);
      setMetadata({});
      setStats({});
    }

    return (
      <div
        className={`min-h-screen px-4 py-8 lg:px-8 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      >
        {/* Main Content with Sidebar Offset */}
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1
              className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Dashboard
            </h1>
            <p className={`mt-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              {/* Welcome back! Upload your resume to get personalized job matches. */}
              Welcome back! Upload your resume to know more about its strengths
              and weaknesses.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div
              className={`rounded-xl shadow-sm p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}
            >
              <div className="flex items-center">
                <div
                  className={`p-3 rounded-lg ${isDark ? "bg-blue-900/30" : "bg-blue-100"}`}
                >
                  <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p
                    className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Resume Score
                  </p>
                  <p
                    className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {resume || selectedResume ? metadata.score : "--"}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`rounded-xl shadow-sm p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}
            >
              <div className="flex items-center">
                <div
                  className={`p-3 rounded-lg ${isDark ? "bg-green-900/30" : "bg-green-100"}`}
                >
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p
                    className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Strengths
                  </p>
                  <p
                    className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {metadata.strengths?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`rounded-xl shadow-sm p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}
            >
              <div className="flex items-center">
                <div
                  className={`p-3 rounded-lg ${isDark ? "bg-red-900/30" : "bg-red-100"}`}
                >
                  <CheckCircleIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p
                    className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Weaknesses
                  </p>
                  <p
                    className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {metadata.weaknesses?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`rounded-xl shadow-sm p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}
            >
              <div className="flex items-center">
                <div
                  className={`p-3 rounded-lg ${isDark ? "bg-blue-900/30" : "bg-blue-100"}`}
                >
                  <ArrowPathIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p
                    className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Improvements
                  </p>
                  <p
                    className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {metadata.improvements?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Card */}
            <div
              className={`rounded-xl shadow-sm p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}
            >
              <h2
                className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Upload Your Resume
              </h2>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragOver
                    ? isDark
                      ? "border-blue-500 bg-blue-900/20"
                      : "border-blue-500 bg-blue-50"
                    : isDark
                      ? "border-gray-600 hover:border-blue-500 hover:bg-gray-700/50"
                      : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p
                  className={`mt-4 text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Drag and drop your resume here, or click to browse
                </p>
                <p
                  className={`mt-1 text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Supports PDF, DOC, DOCX (Max 5MB)
                </p>

                <label className="mt-6 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer">
                  <span>Browse Files</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {uploading && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Processing
                    </span>
                    <span
                      className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      <ClockIcon className="inline h-4 w-4 mr-1" />
                      {progress || "Analyzing..."}
                    </span>
                  </div>
                  <div
                    className={`w-full rounded-full h-2 ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
                  >
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: "70%" }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Resume Preview */}
            {(resume || allResumes?.length > 0) && (
              <div
                className={`rounded-xl shadow-sm p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}
              >
                <h2
                  className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  Resume Preview
                </h2>

                <div className="space-y-4 max-h-100 overflow-y-auto">
                  {allResumes.map((resume) => {
                    const isSelected = selectedResume?.id === resume.id;

                    return (
                      <div
                        key={resume.id}
                        onClick={() => {
                          if (selectedResume?.id === resume.id) {
                            // Deselect
                            setSelectedResume(null);
                            setMetadata({
                              score: 0,
                              strengths: [],
                              weaknesses: [],
                              improvements: [],
                            });
                            return;
                          }

                          // Select
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
                          handleSelectedResume(selected);
                        }}
                        className={`border rounded-lg p-4 cursor-pointer transition
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
                        <div className="flex items-start mb-3">
                          <DocumentTextIcon className="h-6 w-6 text-blue-600 mr-2 shrink-0" />
                          <div>
                            <h3
                              className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                            >
                              {resume.name || "Untitled Resume"}
                            </h3>
                            <p
                              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                            >
                              Uploaded{" "}
                              {new Date(resume.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`text-sm whitespace-pre-line ${isDark ? "text-gray-300" : "text-gray-600"}`}
                        >
                          {isSelected && (
                            <span
                              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                            >
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
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      className={`px-4 py-2 border text-sm font-medium rounded-md ${
                        isDark
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => handleDownload(selectedResume.id)}
                    >
                      Download
                    </button>

                    <button
                      className="px-4 py-2 bg-red-600 text-sm font-medium rounded-md text-white hover:bg-red-700"
                      onClick={() => handleDeleteResume(selectedResume.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Resume Insights */}
          {(resume || selectedResume) && (
            <div
              className={`mt-8 rounded-xl shadow-sm p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}
            >
              <h2
                className={`text-xl font-semibold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Resume Insights
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Strengths */}
                <div
                  className={`border rounded-lg p-4 ${isDark ? "border-gray-700" : "border-gray-200"}`}
                >
                  <h3
                    className={`text-sm font-semibold mb-3 ${isDark ? "text-green-400" : "text-green-700"}`}
                  >
                    Strengths
                  </h3>
                  {metadata.strengths?.length ? (
                    <ul className="space-y-2 text-sm">
                      {metadata.strengths.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span
                            className={
                              isDark ? "text-gray-300" : "text-gray-700"
                            }
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p
                      className={`text-sm ${isDark ? "text-gray-400" : "text-gray-400"}`}
                    >
                      No strengths identified yet.
                    </p>
                  )}
                </div>

                {/* Weaknesses */}
                <div
                  className={`border rounded-lg p-4 ${isDark ? "border-gray-700" : "border-gray-200"}`}
                >
                  <h3
                    className={`text-sm font-semibold mb-3 ${isDark ? "text-red-400" : "text-red-700"}`}
                  >
                    Weaknesses
                  </h3>
                  {metadata.weaknesses?.length ? (
                    <ul className="space-y-2 text-sm">
                      {metadata.weaknesses.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-red-500 mr-2">⚠</span>
                          <span
                            className={
                              isDark ? "text-gray-300" : "text-gray-700"
                            }
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p
                      className={`text-sm ${isDark ? "text-gray-400" : "text-gray-400"}`}
                    >
                      No weaknesses identified yet.
                    </p>
                  )}
                </div>

                {/* Improvements */}
                <div
                  className={`border rounded-lg p-4 ${isDark ? "border-gray-700" : "border-gray-200"}`}
                >
                  <h3
                    className={`text-sm font-semibold mb-3 ${isDark ? "text-blue-400" : "text-blue-700"}`}
                  >
                    Improvements
                  </h3>
                  {metadata.improvements?.length ? (
                    <ul className="space-y-2 text-sm">
                      {metadata.improvements.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-blue-500 mr-2">→</span>
                          <span
                            className={
                              isDark ? "text-gray-300" : "text-gray-700"
                            }
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p
                      className={`text-sm ${isDark ? "text-gray-400" : "text-gray-400"}`}
                    >
                      No improvement suggestions yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
   
   

}

export default Dashboard;
