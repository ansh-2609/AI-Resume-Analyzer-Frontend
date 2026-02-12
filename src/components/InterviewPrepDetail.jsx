import React, { useState } from "react";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  LightBulbIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import InlineAIHelper from "./InlineAIHelper";

function InterviewPrepDetail() {

   const job = useSelector((state) => state.interviewQuestions.questions);
   const jobTitle = useSelector((state) => state.interviewQuestions.jobTitle);  
   const theme = useSelector((state) => state.theme.theme);
   const isDark = theme === "dark";

    const handleBack = () => {
      window.history.back();
    }

  
  return (
  <div
    className={`min-h-screen px-4 py-8 ${
      isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
    }`}
  >
    <div className="max-w-5xl mx-auto">
      <button
        onClick={handleBack}
        className={`flex items-center text-sm mb-6 hover:underline ${
          isDark ? "text-blue-400" : "text-blue-600"
        }`}
      >
        <ArrowLeftIcon className="h-4 w-4 mr-1" />
        Back to jobs
      </button>

      <h1 className="text-3xl font-bold mb-6">
        {jobTitle} Interview Prep Questions
      </h1>

      <div className="space-y-6">
        {job.map((item, index) => (
          <div
            key={index}
            className={`border rounded-xl p-6 shadow-sm ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h2 className="text-lg font-semibold mb-3">
              Q{index + 1}. {item.question}
            </h2>

            <p
              className={`mb-4 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <strong>Answer:</strong> {item.answer}
            </p>

            <div className="mb-4">
              <h4 className="flex items-center font-medium mb-2">
                <FireIcon className="h-4 w-4 text-red-500 mr-1" />
                Interviewer is looking for
              </h4>

              <ul className="space-y-1">
                {item.goals.map((point, idx) => (
                  <li
                    key={idx}
                    className={`flex items-start text-sm ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className={`border p-4 rounded-lg ${
                isDark
                  ? "bg-blue-900/30 border-blue-800 text-blue-200"
                  : "bg-blue-50 border-blue-100 text-blue-800"
              }`}
            >
              <h4 className="flex items-center text-sm font-semibold mb-1">
                <LightBulbIcon
                  className={`h-4 w-4 mr-1 ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                Pro Tip
              </h4>
              <p className="text-sm">{item.tip}</p>
            </div>
            <InlineAIHelper question={item.question} />

          </div>
          
        ))}
      </div>
    </div>
    
  </div>
);
}

export default InterviewPrepDetail;
