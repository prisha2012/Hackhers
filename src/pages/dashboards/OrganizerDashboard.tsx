import React, { useState } from 'react';
import { 
  Plus, Calendar, Users, BarChart3, Settings,
  Eye, Edit, Trash2, TrendingUp, Trophy, MessageSquare
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

const OrganizerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { events, deleteEvent } = useData();
  const { user } = useAuth();

  // Filter events created by this organizer
  const organizerEvents = events.filter((event: any) => event.organizerId === user?.id);
  const upcomingEvents = organizerEvents.filter((event: any) => event.status === 'upcoming');
  const ongoingEvents = organizerEvents.filter((event: any) => event.status === 'ongoing');
  const completedEvents = organizerEvents.filter((event: any) => event.status === 'completed');

  const organizerData = {
    name: user?.name || "Organizer",
    company: "Event Organization",
    eventsCreated: organizerEvents.length,
    totalParticipants: organizerEvents.reduce((sum: any, event: any) => sum + event.currentRegistrations, 0),
    totalPrizeMoney: organizerEvents.reduce((sum: any, event: any) => {
      const prize = event.totalPrizePool?.replace(/[^0-9]/g, '') || '0';
      return sum + parseInt(prize);
    }, 0),
    upcomingEvents: [...upcomingEvents, ...ongoingEvents].map((event: any) => ({
      id: event.id,
      name: event.title,
      date: new Date(event.startDate).toLocaleDateString(),
      participants: event.currentRegistrations,
      maxParticipants: event.maxParticipants,
      status: event.status === 'upcoming' ? 'active' : 'ongoing',
      registrationType: event.registrationType,
      teamSize: event.teamSize
    })),
    pastEvents: completedEvents.map((event: any) => ({
      id: event.id,
      name: event.title,
      date: new Date(event.startDate).toLocaleDateString(),
      participants: event.currentRegistrations,
      winners: ["Winner 1", "Winner 2", "Winner 3"], // Mock winners for now
      status: "completed"
    })),
    analytics: {
      registrations: [
        { month: 'Jan', value: 120 },
        { month: 'Feb', value: 250 },
        { month: 'Mar', value: 180 },
        { month: 'Apr', value: 320 }
      ],
      engagement: 78,
      satisfaction: 4.6
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      deleteEvent(parseInt(eventId));
    }
  };

  const handleSendAnnouncement = () => {
    // Navigate to announcements page or show modal
    setActiveTab('announcements');
    console.log('Send announcement clicked');
  };

  const handleViewAnalytics = () => {
    // Navigate to analytics page
    setActiveTab('analytics');
    console.log('View analytics clicked');
  };

  const handleManageEvent = (eventId: string) => {
    // For now, show event management options in alert
    const action = prompt('Event Management Options:\n1. Edit Event\n2. View Participants\n3. Export Data\n4. Send Announcement\n\nEnter option number (1-4):');
    
    switch(action) {
      case '1':
        alert('Edit Event functionality - Navigate to edit form');
        break;
      case '2':
        const event = events.find(e => e.id.toString() === eventId);
        alert(`Participants: ${event?.participants.length || 0}\nRegistrations: ${event?.currentRegistrations || 0}`);
        break;
      case '3':
        alert('Export Data functionality - Download CSV/Excel');
        break;
      case '4':
        const message = prompt('Enter announcement message:');
        if (message) alert(`Announcement sent: "${message}"`);
        break;
      default:
        alert('Invalid option');
    }
  };

  const handleViewEvent = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'events', label: 'My Events', icon: <Calendar className="h-5 w-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="h-5 w-5" /> },
    { id: 'participants', label: 'Participants', icon: <Users className="h-5 w-5" /> },
    { id: 'announcements', label: 'Announcements', icon: <MessageSquare className="h-5 w-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Total Events</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{organizerData.eventsCreated}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Total Participants</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{organizerData.totalParticipants.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Prize Money</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">${(organizerData.totalPrizeMoney / 1000).toFixed(0)}K</p>
            </div>
            <Trophy className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Avg Rating</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{organizerData.analytics.satisfaction}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary p-4 flex items-center justify-center space-x-2" onClick={() => navigate('/create-event')}>
            <Plus className="h-5 w-5" />
            <span>Create New Event</span>
          </button>
          <button 
            className="btn-ghost p-4 flex items-center justify-center space-x-2"
            onClick={() => handleSendAnnouncement()}
          >
            <MessageSquare className="h-5 w-5" />
            <span>Send Announcement</span>
          </button>
          <button 
            className="btn-ghost p-4 flex items-center justify-center space-x-2"
            onClick={() => handleViewAnalytics()}
          >
            <BarChart3 className="h-5 w-5" />
            <span>View Analytics</span>
          </button>
        </div>
      </div>

      {/* Recent Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {organizerData.upcomingEvents.map((event) => (
              <div key={event.id} className="border border-black/10 dark:border-white/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{event.name}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    event.status === 'active' 
                      ? 'bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/20 dark:border-green-500/30'
                      : 'bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20 dark:border-yellow-500/30'
                  }`}>
                    {event.status}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{event.date}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {event.participants}/{event.maxParticipants} participants
                </p>
                <div className="flex gap-2 mt-3">
                  <button className="btn-primary px-3 py-1 text-sm">
                    Manage
                  </button>
                  <button className="btn-ghost px-3 py-1 text-sm">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-3" />
              <span className="text-gray-600 dark:text-gray-300">25 new registrations for AI Challenge</span>
              <span className="text-gray-500 ml-auto">2h ago</span>
            </div>
            <div className="flex items-center text-sm">
              <MessageSquare className="h-4 w-4 text-green-600 dark:text-green-400 mr-3" />
              <span className="text-gray-600 dark:text-gray-300">Announcement sent to all participants</span>
              <span className="text-gray-500 ml-auto">1d ago</span>
            </div>
            <div className="flex items-center text-sm">
              <Trophy className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-3" />
              <span className="text-gray-600 dark:text-gray-300">FinTech event winners announced</span>
              <span className="text-gray-500 ml-auto">3d ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Event Management</h2>
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create Event</span>
        </button>
      </div>

      {/* Active Events */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Active Events</h3>
        <div className="grid grid-cols-1 gap-4">
          {organizerData.upcomingEvents.map((event) => (
            <div key={event.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">{event.name}</h4>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    event.status === 'active' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {event.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">{event.participants}</p>
                  <p className="text-gray-400 text-sm">Registered</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{event.maxParticipants}</p>
                  <p className="text-gray-400 text-sm">Capacity</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">
                    {Math.round((event.participants / event.maxParticipants) * 100)}%
                  </p>
                  <p className="text-gray-400 text-sm">Fill Rate</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleViewEvent(event.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
                <button 
                  onClick={() => handleManageEvent(event.id)}
                  className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors border border-white/20 flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Manage</span>
                </button>
                <button 
                  onClick={() => handleDeleteEvent(event.id)}
                  className="bg-red-600/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-600/30 transition-colors border border-red-600/30 flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Events */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Past Events</h3>
        <div className="grid grid-cols-1 gap-4">
          {organizerData.pastEvents.map((event) => (
            <div key={event.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">{event.name}</h4>
                <span className="bg-gray-500/20 text-gray-400 px-3 py-1 rounded-full text-sm border border-gray-500/30">
                  Completed
                </span>
              </div>
              <p className="text-gray-400 mb-2">{event.date}</p>
              <p className="text-gray-400 mb-4">{event.participants} participants</p>
              
              <div className="mb-4">
                <p className="text-white font-medium mb-2">Winners:</p>
                <div className="flex flex-wrap gap-2">
                  {event.winners.map((winner: any, index: number) => (
                    <span key={index} className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-sm border border-yellow-500/30">
                      #{index + 1} {winner}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  View Report
                </button>
                <button className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors border border-white/20">
                  Export Data
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Registration Trends</h3>
          <div className="space-y-4">
            {organizerData.analytics.registrations.map((item) => (
              <div key={item.month} className="flex items-center justify-between">
                <span className="text-gray-300">{item.month}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${(item.value / 320) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-medium">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Event Performance</h3>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">
                {organizerData.analytics.engagement}%
              </div>
              <p className="text-gray-400">Engagement Rate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                {organizerData.analytics.satisfaction}
              </div>
              <p className="text-gray-400">Average Rating</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Key Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center bg-white/5 p-4 rounded-lg border border-white/10">
            <div className="text-2xl font-bold text-blue-400">{organizerData.totalParticipants}</div>
            <p className="text-gray-400 text-sm">Total Participants</p>
          </div>
          <div className="text-center bg-white/5 p-4 rounded-lg border border-white/10">
            <div className="text-2xl font-bold text-green-400">
              ${(organizerData.totalPrizeMoney / 1000).toFixed(0)}K
            </div>
            <p className="text-gray-400 text-sm">Total Prizes</p>
          </div>
          <div className="text-center bg-white/5 p-4 rounded-lg border border-white/10">
            <div className="text-2xl font-bold text-purple-400">{organizerData.eventsCreated}</div>
            <p className="text-gray-400 text-sm">Events Created</p>
          </div>
          <div className="text-center bg-white/5 p-4 rounded-lg border border-white/10">
            <div className="text-2xl font-bold text-yellow-400">4.6</div>
            <p className="text-gray-400 text-sm">Avg Satisfaction</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'events':
        return renderEvents();
      case 'analytics':
        return renderAnalytics();
      case 'participants':
        return <div className="text-white">Participants management coming soon...</div>;
      case 'announcements':
        return <div className="text-white">Announcements feature coming soon...</div>;
      case 'settings':
        return <div className="text-white">Settings feature coming soon...</div>;
      default:
        return renderOverview();
    }
  };

  return (
    <DashboardLayout
      title="Organizer Dashboard"
      sidebarItems={sidebarItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default OrganizerDashboard;