import React, { useState } from 'react';
import { Trophy, Medal, Award, Star } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const WinnerAnnouncement: React.FC = () => {
  const { events, submissions } = useData();
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  // Calculate winners for each event
  const getEventWinners = (eventId: number) => {
    const eventSubmissions = submissions
      .filter(sub => sub.eventId === eventId && sub.judgeScore)
      .sort((a, b) => (b.judgeScore || 0) - (a.judgeScore || 0));
    
    return {
      first: eventSubmissions[0] || null,
      second: eventSubmissions[1] || null,
      third: eventSubmissions[2] || null,
      allSubmissions: eventSubmissions
    };
  };

  const completedEvents = events.filter(event => 
    event.status === 'completed' || 
    submissions.some(sub => sub.eventId === event.id && sub.judgeScore)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1b3a] to-[#1a202c] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Trophy className="h-10 w-10 text-yellow-400" />
            Winner Announcements
          </h1>
          <p className="text-gray-400">Celebrating our hackathon champions!</p>
        </div>

        {/* Event Selection */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {completedEvents.map(event => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event.id)}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  selectedEvent === event.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {event.title}
              </button>
            ))}
          </div>
        </div>

        {selectedEvent && (() => {
          const event = events.find(e => e.id === selectedEvent);
          const winners = getEventWinners(selectedEvent);
          
          return (
            <div className="space-y-8">
              {/* Event Header */}
              <div className="text-center bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <h2 className="text-3xl font-bold text-white mb-2">{event?.title}</h2>
                <p className="text-gray-400">
                  {winners.allSubmissions.length} submissions • 
                  {event?.participants.length || 0} participants
                </p>
              </div>

              {/* Winners Podium */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* First Place */}
                {winners.first && (
                  <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-md rounded-xl p-6 border border-yellow-500/30 text-center">
                    <div className="flex justify-center mb-4">
                      <Trophy className="h-16 w-16 text-yellow-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-yellow-400 mb-2">1st Place</h3>
                    <h4 className="text-xl font-semibold text-white mb-2">{winners.first.projectName}</h4>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <span className="text-2xl font-bold text-white">{winners.first.judgeScore}/10</span>
                    </div>
                    {winners.first.judgeFeedback && (
                      <p className="text-gray-300 text-sm italic">"{winners.first.judgeFeedback}"</p>
                    )}
                  </div>
                )}

                {/* Second Place */}
                {winners.second && (
                  <div className="bg-gradient-to-br from-gray-400/20 to-gray-500/20 backdrop-blur-md rounded-xl p-6 border border-gray-400/30 text-center">
                    <div className="flex justify-center mb-4">
                      <Medal className="h-16 w-16 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-400 mb-2">2nd Place</h3>
                    <h4 className="text-xl font-semibold text-white mb-2">{winners.second.projectName}</h4>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-gray-400" />
                      <span className="text-2xl font-bold text-white">{winners.second.judgeScore}/10</span>
                    </div>
                    {winners.second.judgeFeedback && (
                      <p className="text-gray-300 text-sm italic">"{winners.second.judgeFeedback}"</p>
                    )}
                  </div>
                )}

                {/* Third Place */}
                {winners.third && (
                  <div className="bg-gradient-to-br from-amber-600/20 to-amber-700/20 backdrop-blur-md rounded-xl p-6 border border-amber-600/30 text-center">
                    <div className="flex justify-center mb-4">
                      <Award className="h-16 w-16 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-amber-600 mb-2">3rd Place</h3>
                    <h4 className="text-xl font-semibold text-white mb-2">{winners.third.projectName}</h4>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-amber-600" />
                      <span className="text-2xl font-bold text-white">{winners.third.judgeScore}/10</span>
                    </div>
                    {winners.third.judgeFeedback && (
                      <p className="text-gray-300 text-sm italic">"{winners.third.judgeFeedback}"</p>
                    )}
                  </div>
                )}
              </div>

              {/* All Submissions Leaderboard */}
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Complete Leaderboard</h3>
                <div className="space-y-4">
                  {winners.allSubmissions.map((submission, index) => (
                    <div
                      key={submission.id}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        index < 3
                          ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30'
                          : 'bg-white/5 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-gray-400 text-black' :
                          index === 2 ? 'bg-amber-600 text-black' :
                          'bg-white/20 text-white'
                        }`}>
                          #{index + 1}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">{submission.projectName}</h4>
                          <p className="text-gray-400 text-sm">
                            Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{submission.judgeScore}/10</div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.round((submission.judgeScore || 0) / 2)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {!selectedEvent && completedEvents.length > 0 && (
          <div className="text-center text-gray-400">
            <p>Select an event above to view winners</p>
          </div>
        )}

        {completedEvents.length === 0 && (
          <div className="text-center text-gray-400">
            <Trophy className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>No completed events with judged submissions yet.</p>
            <p className="text-sm">Winners will appear here once judges complete their reviews.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WinnerAnnouncement;
