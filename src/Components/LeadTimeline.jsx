import React, { useEffect, useState } from "react";
import { ENDPOINTS } from "../api/constraints";

// Utility: Format timestamp to readable string

const getActivityMessage = (activity) => {
  const { activitytype, data, user, performedbyid } = activity;
  const userName = user?.cFull_name || `User ${performedbyid}`;
  const rawMessage = data?.newStatus;

  const personalizeMessage = (msg) =>
    typeof msg === "string" ? msg.replace(`${performedbyid}`, userName) : msg;

  switch (activitytype) {
    case "lead_created":
      return personalizeMessage(rawMessage) || `Lead created by ${userName}.`;
    case "follow_up":
      return "Follow-up scheduled.";
    case "proposal_sent":
      return "Proposal sent to the client.";
    case "comment_added":
      return personalizeMessage(rawMessage) || `A comment was added by ${userName}.`;
    case "assigned_to_user":
      if (typeof rawMessage === "string" && rawMessage.includes("[object Object]")) {
        return `The lead was assigned by ${userName}.`;
      }
      return personalizeMessage(rawMessage) || `The lead was assigned by ${userName}.`;
    default:
      return personalizeMessage(rawMessage) ||
        activitytype.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
};

export default function LeadTimeline({ leadId }) {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  const fetchActivityLog = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${ENDPOINTS.BASE_URL_IS}/lead-activity-log/${leadId}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.message || `Failed to fetch activity log (Status: ${response.status})`);
      }

      const data = await response.json();
      console.log("API Response Data:", data);

      // Sort activities by timestamp in descending order (latest first)
      const sortedHistory = data.sort(
        (a, b) => new Date(b.activitytimestamp) - new Date(a.activitytimestamp)
      );

      setHistory(sortedHistory);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message || "Unable to fetch timeline data");
    }
  };

  useEffect(() => {
    if (leadId) fetchActivityLog();
  }, [leadId]);

  return (
    <div className="relative w-full h-[600px] overflow-y-auto px-6 py-10 bg-gray-50">
      <div className="relative w-full flex flex-col items-center">
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {history.length === 0 && !error && (
          <div className="text-gray-500">No activity found for this lead.</div>
        )}

        {history.map((entry, index) => {
          const isLeft = index % 2 === 0;
          const isLast = index === history.length - 1;
          const message = getActivityMessage(entry);
    
          const performedBy = entry.performedbyid
            ? `User ${entry.performedbyid}`
            : "System";
            
            const date = new Date(entry.activitytimestamp);
                        const humanReadable = date.toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });

          return (
            <div key={entry.id || index} className="flex w-full relative min-h-[120px]">
              {/* Left card */}
              <div className="w-1/2 flex justify-end pr-6">
                {isLeft && (
                  <div className="bg-white border rounded-xl shadow p-4 w-80 z-10">
                    <h3 className="font-bold text-lg">Activity</h3>
                    <p className="text-sm font-semibold text-gray-600 mt-1">{message}</p>
                   <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                    <img
                      src={`https://ui-avatars.com/api/?name=${performedBy.replace(" ", "+")}`}
                      alt="avatar"
                      className="w-5 h-5 rounded-full"
                    />
                    <span>{humanReadable}</span>
                  </div>
                  </div>
                )}
              </div>

              {/* Center timeline */}
              <div className="flex flex-col items-center w-0 relative">
                <div className="w-8 h-8 bg-black rounded-full border-2 border-white z-10 relative" />
                <div
                  className={`absolute top-[6px] h-0.5 w-[40px] bg-black ${
                    isLeft ? "right-[calc(100%+12px)]" : "left-[calc(100%+12px)]"
                  }`}
                />
                {!isLast && (
                  <div className="flex flex-col items-center mt-2 space-y-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="w-1 h-5 bg-black rounded-full opacity-60" />
                    ))}
                  </div>
                )}
              </div>

              {/* Right card */}
              <div className="w-1/2 flex justify-start pl-6">
                {!isLeft && (
                  <div className="bg-white border rounded-xl shadow p-4 w-80 z-10">
                    <h3 className="font-bold text-lg">Activity</h3>
                    <p className="text-sm font-semibold text-gray-600 mt-1">{message}</p>
                    <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                      <img
                        src={`https://ui-avatars.com/api/?name=${performedBy.replace(
                          " ",
                          "+"
                        )}`}
                        alt="avatar"
                        className="w-5 h-5 rounded-full"
                      />
                    <span>{humanReadable}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}