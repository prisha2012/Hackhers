import React, { useState } from 'react';
import { 
  Calendar, Trophy, Users, Clock, 
  Award, CheckCircle, Upload, MessageSquare, Settings, User
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ParticipantDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { events, submissions, createSubmission } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Filter events where user is registered
  const registeredEvents = events.filter(event => 
    event.participants.includes(user?.id || '') || 
    event.teams?.some(team => team.members.includes(user?.id || ''))
  );

  // Filter user's submissions
  const userSubmissions = submissions.filter(sub => sub.userId === user?.id);

  const participantData = {
    name: user?.name || "Participant",
    email: user?.email || "participant@example.com",
    eventsParticipated: registeredEvents.length,
    currentTeam: registeredEvents.find(event => event.teams?.some(team => team.members.includes(user?.id || '')))?.teams?.find(team => team.members.includes(user?.id || '')) || null,
    upcomingEvents: registeredEvents.map(event => ({
      id: event.id,
      name: event.title,
      date: `${new Date(event.startDate).toLocaleDateString()} - ${new Date(event.endDate).toLocaleDateString()}`,
      status: event.status,
      role: event.teams?.find(team => team.leaderId === user?.id) ? "Team Lead" : "Member"
    })),
    submissions: userSubmissions.map(sub => ({
      id: sub.id,
      eventName: registeredEvents.find(e => e.id === sub.eventId)?.title || "Unknown Event",
      projectName: sub.projectName,
      status: sub.status,
      score: sub.score || 0,
      submittedDate: new Date(sub.submittedAt).toLocaleDateString()
    })),
    achievements: [
      { name: "First Hackathon", icon: "🎯", date: "2024" },
      { name: "Team Player", icon: "👥", date: "2024" },
      { name: "Innovation Award", icon: "🏆", date: "2024" }
    ]
  };

  const handleSubmitProject = async (eventId: number) => {
    const projectName = prompt('Enter project name:');
    const description = prompt('Enter project description:');
    const repositoryUrl = prompt('Enter repository URL (optional):');
    
    if (!projectName || !description) {
      alert('Project name and description are required!');
      return;
    }

    try {
      await createSubmission({
        eventId,
        userId: user?.id || '',
        projectName,
        description,
        repositoryUrl: repositoryUrl || undefined,
        status: 'submitted'
      });
      alert('Project submitted successfully!');
    } catch (error) {
      console.error('Failed to submit project:', error);
      alert('Failed to submit project. Please try again.');
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: <User className="h-5 w-5" /> },
    { id: 'events', label: 'My Events', icon: <Calendar className="h-5 w-5" /> },
    { id: 'team', label: 'Team Management', icon: <Users className="h-5 w-5" /> },
    { id: 'submissions', label: 'Submissions', icon: <Upload className="h-5 w-5" /> },
    { id: 'achievements', label: 'Achievements', icon: <Trophy className="h-5 w-5" /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="h-5 w-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Events Participated</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{participantData.eventsParticipated}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Active Teams</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">1</p>
            </div>
            <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Achievements</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{participantData.achievements.length}</p>
            </div>
            <Trophy className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Team</h3>
          {participantData.currentTeam ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-white">{participantData.currentTeam.name}</h4>
                <span className="bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded text-sm border border-blue-500/20 dark:border-blue-500/30">
                  Active
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{participantData.currentTeam.event}</p>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Team Members:</p>
                {participantData.currentTeam.members.map((member, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <User className="h-4 w-4 mr-2" />
                    {member}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No active team</p>
          )}
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {participantData.upcomingEvents.map((event) => (
              <div key={event.id} className="border border-black/10 dark:border-white/20 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{event.name}</h4>
                  <span className="bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-1 rounded text-xs border border-green-500/20 dark:border-green-500/30">
                    {event.status}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {event.date}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{event.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mr-3" />
            <span className="text-gray-600 dark:text-gray-300">Joined team "AI Innovators" for AI Challenge</span>
            <span className="text-gray-500 ml-auto">2 days ago</span>
          </div>
          <div className="flex items-center text-sm">
            <Upload className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-3" />
            <span className="text-gray-600 dark:text-gray-300">Submitted project "EcoTracker Pro"</span>
            <span className="text-gray-500 ml-auto">1 week ago</span>
          </div>
          <div className="flex items-center text-sm">
            <Award className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-3" />
            <span className="text-gray-600 dark:text-gray-300">Earned "Team Player" achievement</span>
            <span className="text-gray-500 ml-auto">2 weeks ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">My Events</h2>
        <button 
          onClick={() => navigate('/events')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
        >
          Browse Events
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {participantData.upcomingEvents.map((event) => (
          <div key={event.id} className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">{event.name}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                event.status === 'upcoming' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  'bg-gray-500/20 text-gray-400 border border-gray-500/30'
              }`}>
                {event.status}
              </span>
            </div>
            <div className="flex items-center text-gray-300 mb-2">
              <Clock className="h-4 w-4 mr-2" />
              {event.date}
            </div>
            <div className="flex items-center text-gray-300 mb-4">
              <User className="h-4 w-4 mr-2" />
              Role: {event.role}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => navigate(`/events/${event.id}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Details
              </button>
              <button 
                className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors border border-white/20"
                onClick={() => handleSubmitProject(event.id)}
              >
                Submit Project
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTeam = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Team Management</h2>
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors">
          Create Team
        </button>
      </div>

      {participantData.currentTeam && (
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">{participantData.currentTeam.name}</h3>
            <div className="flex gap-2">
              <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Invite Members
              </button>
              <button className="bg-white/10 text-white px-3 py-2 rounded-lg hover:bg-white/20 transition-colors border border-white/20 text-sm">
                Team Settings
              </button>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-400 mb-2">Event:</p>
            <p className="text-white">AI Innovation Challenge 2025</p>
          </div>

          <div>
            <p className="text-gray-400 mb-3">Team Members ({participantData.currentTeam.members.length})</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {participantData.currentTeam.members.map((member, index) => (
                <div key={index} className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/10">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{member}</p>
                      <p className="text-gray-400 text-sm">
                        {index === 0 ? 'Team Lead' : 'Member'}
                      </p>
                    </div>
                  </div>
                  {index !== 0 && (
                    <button className="text-red-400 hover:text-red-300 transition-colors">
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSubmissions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Project Submissions</h2>
        <button
          className="btn-primary px-4 py-2"
          onClick={() => {
            if (!user) return;
            createSubmission({
              eventId: 1,
              userId: user?.id || '',
              projectName: 'My Awesome Project',
              description: 'Quick submission created from dashboard',
              repositoryUrl: 'https://github.com/example/repo',
              liveUrl: 'https://example.com/demo',
              status: 'submitted'
            });
            alert('Submission created');
          }}
        >
          New Submission
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {participantData.submissions.map((submission) => (
          <div key={submission.id} className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">{submission.projectName}</h4>
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm border border-green-500/30">
                {submission.status}
              </span>
            </div>
            <p className="text-gray-400">Event: {submission.eventName}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">{submission.score}</p>
                <p className="text-gray-400 text-sm">Score</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">#{submission.score > 90 ? '1st' : submission.score > 80 ? '2nd' : '3rd'}</div>
                <p className="text-gray-400 text-sm">Rank</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">✓</p>
                <p className="text-gray-400 text-sm">Completed</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="btn-primary px-4 py-2">
                View Project
              </button>
              <button className="btn-ghost px-4 py-2">
                Feedback
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Achievements</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {participantData.achievements.map((achievement, index) => (
          <div key={index} className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 text-center">
            <div className="text-4xl mb-4">{achievement.icon}</div>
            <h3 className="text-lg font-semibold text-white mb-2">{achievement.name}</h3>
            <p className="text-gray-400 text-sm">Earned in {achievement.date}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'events':
        return renderEvents();
      case 'team':
        return renderTeam();
      case 'submissions':
        return renderSubmissions();
      case 'achievements':
        return renderAchievements();
      case 'messages':
        return <div className="text-white">Messages feature coming soon...</div>;
      case 'settings':
        return <div className="text-white">Settings feature coming soon...</div>;
      default:
        return renderOverview();
    }
  };

  return (
    <DashboardLayout
      title="Participant Dashboard"
      sidebarItems={sidebarItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default ParticipantDashboard;