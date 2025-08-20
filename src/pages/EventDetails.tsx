import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, MapPin, Users, Trophy, Clock, Share2, Heart,
  Github, ExternalLink, Award, Target, CheckCircle, UserPlus
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { events, registerForEvent, unregisterFromEvent } = useData();
  const { user } = useAuth();
  
  const numericId = Number(id);
  const dataEvent = useMemo(() => events.find(e => e.id === numericId), [events, numericId]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showRegistrationMessage, setShowRegistrationMessage] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationType, setRegistrationType] = useState<'individual' | 'team'>('individual');
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState<string[]>(['']);

  // Prefer in-memory event; fallback to mock
  if (!dataEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Event Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">The event you're looking for doesn't exist.</p>
          <Link to="/events" className="btn-primary px-6 py-3">
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  const event = {
    id: dataEvent.id,
    title: dataEvent.title,
    description: dataEvent.description,
    longDescription: dataEvent.longDescription ?? dataEvent.description,
    date: `${new Date(dataEvent.startDate).toLocaleDateString()} - ${new Date(dataEvent.endDate).toLocaleDateString()}`,
    startDate: new Date(dataEvent.startDate).toLocaleDateString(),
    endDate: new Date(dataEvent.endDate).toLocaleDateString(),
    location: dataEvent.type === 'online' ? 'Online' : (dataEvent.venue || dataEvent.address || 'TBA'),
    venue: dataEvent.venue || dataEvent.address || 'TBA',
    type: dataEvent.type,
    participants: dataEvent.currentRegistrations,
    maxParticipants: dataEvent.maxParticipants,
    prizes: dataEvent.totalPrizePool || '$0',
    tags: dataEvent.tags,
    image: dataEvent.image || 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: dataEvent.status,
    organizer: { name: dataEvent.organizerName || 'Organizer', logo: '🏢', description: 'Event organizer' },
    prizes_breakdown: dataEvent.prizeBreakdown || [],
    tracks: dataEvent.tracks?.map(t => ({ name: t.name, description: t.description, icon: '💡' })) || [],
    schedule: [
      { time: new Date(dataEvent.startDate).toLocaleTimeString(), activity: 'Registration & Check-in' },
      { time: '10:00 AM', activity: 'Opening Ceremony' },
      { time: '11:00 AM', activity: 'Hacking Begins' },
      { time: new Date(dataEvent.endDate).toLocaleTimeString(), activity: 'Final Presentations' }
    ],
    judges: dataEvent.judges || [],
    sponsors: dataEvent.sponsors || [],
    requirements: dataEvent.requirements || [],
    rules: dataEvent.rules || [],
    registrationType: dataEvent.registrationType,
    teamSize: dataEvent.teamSize,
    submissionDeadline: dataEvent.submissionDeadline,
    perks: [
      'Free meals and snacks throughout the event',
      'Swag bag with tech goodies',
      'Mentorship from industry experts',
      'Networking opportunities with top companies',
      'Certificate of participation',
      'Access to premium development tools'
    ],
  };

  const isRegistered = !!(user && dataEvent && dataEvent.participants.includes(user.id));
  
  const handleRegisterClick = () => {
    if (!user) {
      window.location.href = '/auth';
      return;
    }
    
    if (isRegistered) {
      unregisterFromEvent(dataEvent!.id, user.id);
      setShowRegistrationMessage(true);
      setTimeout(() => setShowRegistrationMessage(false), 3000);
    } else if (dataEvent?.registrationType === 'individual') {
      registerForEvent(dataEvent.id, user.id);
      setShowRegistrationMessage(true);
      setTimeout(() => setShowRegistrationMessage(false), 3000);
    } else {
      setShowRegistrationModal(true);
    }
  };

  const handleRegistrationSubmit = () => {
    if (!user || !dataEvent) return;
    
    if (registrationType === 'individual') {
      registerForEvent(dataEvent.id, user.id);
    } else {
      // For team registration, we would normally create a team first
      // For now, just register the user as team lead
      registerForEvent(dataEvent.id, user.id);
    }
    
    setShowRegistrationModal(false);
    setShowRegistrationMessage(true);
    setTimeout(() => setShowRegistrationMessage(false), 3000);
  };

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, '']);
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const updateTeamMember = (index: number, email: string) => {
    const updated = [...teamMembers];
    updated[index] = email;
    setTeamMembers(updated);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Registration Success Message */}
        {showRegistrationMessage && (
          <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>
                {isRegistered ? 'Successfully registered for event!' : 'Successfully unregistered from event!'}
              </span>
            </div>
          </div>
        )}
        {/* Hero Section */}
        <div className="relative mb-8">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-96 object-cover rounded-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-xl"></div>
          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {event.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm rounded-full border border-blue-500/20 dark:border-blue-500/30"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{event.title}</h1>
            <p className="text-xl text-gray-200 mb-6 max-w-3xl">{event.description}</p>
            <div className="flex flex-wrap gap-4 text-gray-200">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>{event.participants}/{event.maxParticipants} participants</span>
              </div>
              <div className="flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                <span>{event.prizes} in prizes</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <div className="card p-1 mb-8">
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'tracks', label: 'Tracks' },
                  { id: 'schedule', label: 'Schedule' },
                  { id: 'judges', label: 'Judges' },
                  { id: 'prizes', label: 'Prizes' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[rgb(var(--color-accent))] text-slate-900'
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="card p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About This Event</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{event.longDescription}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">What You'll Get</h3>
                      <ul className="space-y-2">
                        {event.perks.map((perk, index) => (
                          <li key={index} className="flex items-start text-gray-600 dark:text-gray-300">
                            <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Requirements</h3>
                      <ul className="space-y-2">
                        {event.requirements.map((requirement, index) => (
                          <li key={index} className="flex items-start text-gray-600 dark:text-gray-300">
                            <Target className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Event Organizer</h3>
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{event.organizer.logo}</div>
                    <div>
                      <h4 className="text-gray-900 dark:text-white font-semibold">{event.organizer.name}</h4>
                      <p className="text-gray-600 dark:text-gray-300">{event.organizer.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tracks' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {event.tracks.map((track, index) => (
                  <div key={index} className="card p-6">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-4">{track.icon}</span>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{track.name}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{track.description}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-4">
                {event.schedule.map((item, index) => (
                  <div key={index} className="card p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.activity}</h3>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-600 dark:text-gray-300 flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {item.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'judges' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {event.judges.map((judge, index) => (
                  <div key={index} className="card p-6 text-center">
                    <div className="text-6xl mb-4">{judge.avatar || '👨‍💼'}</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{judge.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{judge.expertise?.join(', ') || 'Expert Judge'}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'prizes' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {event.prizes_breakdown.map((prize, index) => (
                    <div key={index} className="card p-6 text-center">
                      <div className="mb-4">
                        <Award className={`h-12 w-12 mx-auto ${
                          index === 0 ? 'text-yellow-400' : 
                          index === 1 ? 'text-gray-300' : 'text-orange-400'
                        }`} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{prize.amount}</h3>
                      <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">{prize.place}</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{prize.description}</p>
                    </div>
                  ))}
                </div>

                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sponsored By</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {event.sponsors.map((sponsor, index) => (
                      <div key={index} className="flex items-center justify-center space-x-3 bg-black/5 dark:bg-white/5 p-4 rounded-lg border border-black/10 dark:border-white/10">
                        <span className="text-2xl">{sponsor.logo}</span>
                        <div>
                          <p className="text-gray-900 dark:text-white font-semibold">{sponsor.name}</p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{sponsor.tier} Sponsor</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className="card p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{event.prizes}</div>
                <p className="text-gray-600 dark:text-gray-300">in total prizes</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Start Date:</span>
                  <span className="text-gray-900 dark:text-white">{event.startDate.split(' ').slice(0, 3).join(' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">End Date:</span>
                  <span className="text-gray-900 dark:text-white">{event.endDate.split(' ').slice(0, 3).join(' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Location:</span>
                  <span className="text-gray-900 dark:text-white">{event.venue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Participants:</span>
                  <span className="text-gray-900 dark:text-white">{event.participants}/{event.maxParticipants}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleRegisterClick}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                    isRegistered
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'btn-primary'
                  }`}
                >
                  {isRegistered ? '✓ Registered' : 'Register Now'}
                </button>
                
                <div className="flex gap-2">
                  <button className="flex-1 btn-ghost py-2 px-4 flex items-center justify-center">
                    <Heart className="h-4 w-4 mr-2" />
                    Save
                  </button>
                  <button className="flex-1 btn-ghost py-2 px-4 flex items-center justify-center">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  <Github className="h-4 w-4 mr-3" />
                  Project Submission Portal
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
                <a
                  href="#"
                  className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  <Users className="h-4 w-4 mr-3" />
                  Join Discord Community
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
                <Link
                  to="/dashboard/participant"
                  className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  <Target className="h-4 w-4 mr-3" />
                  Participant Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Modal */}
        {showRegistrationModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Register for {dataEvent?.title}
              </h3>
              
              {dataEvent?.registrationType === 'both' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Registration Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setRegistrationType('individual')}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        registrationType === 'individual'
                          ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <UserPlus className="h-5 w-5 mx-auto mb-1" />
                      Individual
                    </button>
                    <button
                      onClick={() => setRegistrationType('team')}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        registrationType === 'team'
                          ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <Users className="h-5 w-5 mx-auto mb-1" />
                      Team
                    </button>
                  </div>
                </div>
              )}

              {registrationType === 'team' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Team Name
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter team name"
                  />
                  
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-4 mb-2">
                    Team Members (Email addresses)
                  </label>
                  {teamMembers.map((member, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="email"
                        value={member}
                        onChange={(e) => updateTeamMember(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="member@example.com"
                      />
                      {teamMembers.length > 1 && (
                        <button
                          onClick={() => removeTeamMember(index)}
                          className="px-3 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {(!dataEvent?.teamSize?.max || teamMembers.length < dataEvent.teamSize.max) && (
                    <button
                      onClick={addTeamMember}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      + Add Team Member
                    </button>
                  )}
                  
                  {dataEvent?.teamSize && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Team size: {dataEvent.teamSize.min}-{dataEvent.teamSize.max} members
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRegistrationModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRegistrationSubmit}
                  className="flex-1 btn-primary px-4 py-2"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;