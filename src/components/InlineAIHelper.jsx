// FloatingChatbot.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ChatBubbleLeftRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { aiResponse } from "../services/appServices";

function InlineAIHelper(activeQuestion) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const jobTitle = useSelector((state) => state.interviewQuestions.jobTitle); 

  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const response = await aiResponse(jobTitle, activeQuestion, input);

    console.log("AI Response:", response);

    const aiMsg = {
      role: "assistant",
      text: response,
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, aiMsg]);
    }, 500);
  };
 
  return (
  <>
    {!open && (
      <button
        onClick={() => setOpen(true)}
        className={`
          mt-4 inline-flex items-center gap-2
          px-4 py-2 text-sm font-semibold
          text-white
          rounded-lg shadow-sm
          transition cursor-pointer
          ${
            isDark
              ? "bg-linear-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800"
              : "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          }
        `}
      >
        🤖 Ask AI for more help
      </button>
    )}

    {open && (
      <div
        className={`
          mt-5 z-20 w-full h-80 rounded-xl shadow-xl flex flex-col border
          ${
            isDark
              ? "bg-gray-900 border-gray-700 text-gray-100"
              : "bg-white border-gray-300 text-gray-900"
          }
        `}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-3 border-b ${isDark ? "border-gray-700" : ""}`}>
          <h3 className="font-semibold text-sm">Interview Helper 🤖</h3>
        </div>

        {/* Messages */}
        <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`
                p-2 rounded-lg whitespace-pre-wrap
                ${
                  msg.role === "user"
                    ? isDark
                      ? "bg-blue-900 text-right self-end"
                      : "bg-blue-100 text-right self-end"
                    : isDark
                      ? "bg-gray-800"
                      : "bg-gray-100"
                }
              `}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className={`p-3 border-t flex gap-2 ${isDark ? "border-gray-700" : ""}`}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this question..."
            className={`
              flex-1 rounded-lg px-2 py-1 text-sm border
              ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  : "bg-white border-gray-300"
              }
            `}
          />

          <button
            onClick={handleSend}
            className="bg-blue-500 hover:bg-blue-700 text-white px-3 rounded-lg text-sm cursor-pointer"
          >
            Send
          </button>

          <button
            onClick={() => setMessages([])}
            className="bg-gray-500 hover:bg-gray-700 text-white px-3 rounded-lg text-sm cursor-pointer"
          >
            Clear
          </button>
          
          <button
            onClick={() => setOpen(false)}
            className="bg-red-500 hover:bg-red-700 text-white px-3 rounded-lg text-sm cursor-pointer"
          >
            Close
          </button>
          
        </div>
      </div>
    )}
  </>
);

}

export default InlineAIHelper;

