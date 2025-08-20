import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, Users, Trophy, MapPin, Clock } from 'lucide-react';
import { useData } from '../contexts/DataContext';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  type: 'online' | 'offline';
  participants: number;
  maxParticipants: number;
  prizes: string;
  tags: string[];
  image: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  registrationType?: 'individual' | 'team' | 'both';
  teamSize?: { min: number; max: number };
}

const Events: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const { events: dataEvents } = useData();
  const seedEvents: Event[] = [
    {
      id: 1,
      title: "AI Innovation Challenge 2025",
      description: "Build the next generation of AI applications that solve real-world problems. Focus on machine learning, natural language processing, and computer vision.",
      date: "Feb 15-17, 2025",
      location: "San Francisco, CA",
      type: "offline",
      participants: 250,
      maxParticipants: 500,
      prizes: "$50,000",
      tags: ["AI", "Machine Learning", "Innovation"],
      image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400",
      status: "upcoming"
    },
    {
      id: 2,
      title: "Green Tech Hackathon",
      description: "Create sustainable solutions for environmental challenges. Focus on clean energy, waste reduction, and climate change mitigation.",
      date: "Mar 8-10, 2025",
      location: "Online",
      type: "online",
      participants: 180,
      maxParticipants: 300,
      prizes: "$25,000",
      tags: ["Sustainability", "Green Tech", "Environment"],
      image: "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=400",
      status: "upcoming"
    },
    {
      id: 3,
      title: "FinTech Revolution",
      description: "Revolutionize financial services with blockchain, DeFi, and digital payment solutions.",
      date: "Mar 22-24, 2025",
      location: "New York, NY",
      type: "offline",
      participants: 320,
      maxParticipants: 400,
      prizes: "$75,000",
      tags: ["FinTech", "Blockchain", "DeFi"],
      image: "https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=400",
      status: "upcoming"
    },
    {
      id: 4,
      title: "Healthcare Innovation Summit",
      description: "Transform healthcare with digital solutions, telemedicine, and health monitoring technologies.",
      date: "Apr 5-7, 2025",
      location: "Boston, MA",
      type: "offline",
      participants: 150,
      maxParticipants: 250,
      prizes: "$40,000",
      tags: ["Healthcare", "Digital Health", "MedTech"],
      image: "https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=400",
      status: "upcoming"
    },
    {
      id: 5,
      title: "Web3 Gaming Championship",
      description: "Build the future of gaming with NFTs, metaverse, and play-to-earn mechanics.",
      date: "Jan 20-22, 2025",
      location: "Online",
      type: "online",
      participants: 400,
      maxParticipants: 600,
      prizes: "$100,000",
      tags: ["Gaming", "Web3", "NFT", "Metaverse"],
      image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400",
      status: "ongoing"
    },
    {
      id: 6,
      title: "Smart City Challenge",
      description: "Design solutions for urban challenges including transportation, energy, and citizen services.",
      date: "Dec 10-12, 2024",
      location: "Chicago, IL",
      type: "offline",
      participants: 280,
      maxParticipants: 350,
      prizes: "$60,000",
      tags: ["Smart City", "IoT", "Urban Planning"],
      image: "https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?auto=compress&cs=tinysrgb&w=400",
      status: "completed"
    }
  ];

  const allEvents: Event[] = useMemo(() => {
    // Map dataEvents (from context) to this view model where possible
    const mapped = dataEvents.map(ev => ({
      id: ev.id,
      title: ev.title,
      description: ev.description,
      date: new Date(ev.startDate).toLocaleDateString(),
      location: ev.type === 'online' ? 'Online' : (ev.address || 'TBA'),
      type: ev.type,
      participants: ev.currentRegistrations,
      maxParticipants: ev.maxParticipants,
      prizes: ev.totalPrizePool || '$0',
      tags: ev.tags,
      image: ev.image || 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: ev.status,
      registrationType: ev.registrationType,
      teamSize: ev.teamSize
    }));
    
    // Only show seed events if no real events exist, or merge them avoiding duplicates
    const existingIds = new Set(mapped.map(e => e.id));
    const uniqueSeedEvents = seedEvents.filter(e => !existingIds.has(e.id));
    
    return [...mapped, ...uniqueSeedEvents];
  }, [dataEvents]);

  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || event.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'ongoing':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Discover Events</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join exciting hackathons and innovation challenges from around the world. 
            Build, learn, and compete with the best developers and creators.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events, technologies, or topics..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-black/10 dark:bg-white/10 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              className="px-4 py-3 bg-white border border-black/10 dark:bg-white/10 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all" className="bg-white dark:bg-gray-900">All Events</option>
              <option value="upcoming" className="bg-white dark:bg-gray-900">Upcoming</option>
              <option value="ongoing" className="bg-white dark:bg-gray-900">Ongoing</option>
              <option value="completed" className="bg-white dark:bg-gray-900">Completed</option>
            </select>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="card overflow-hidden hover:transform hover:scale-105 transition-all duration-200 group"
            >
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-200"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    event.type === 'online' 
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  }`}>
                    {event.type === 'online' ? 'Online' : 'In-Person'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {event.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                  {event.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{event.participants}/{event.maxParticipants} registered</span>
                  </div>
                  {event.registrationType && (
                    <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                      <span className="mr-2">📋</span>
                      <span>
                        {event.registrationType === 'individual' ? 'Individual only' : 
                         event.registrationType === 'team' ? `Team (${event.teamSize?.min}-${event.teamSize?.max} members)` :
                         `Individual or Team (1-${event.teamSize?.max} members)`}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                    <Trophy className="h-4 w-4 mr-2" />
                    <span>{event.prizes} in prizes</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs rounded-full border border-blue-500/20 dark:border-blue-500/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/events/${event.id}`}
                    className="flex-1 btn-primary py-2 px-4 text-sm"
                  >
                    View Details
                  </Link>
                  {event.status === 'upcoming' && (
                    <Link
                      to={`/events/${event.id}`}
                      className="px-4 py-2 btn-ghost text-sm"
                    >
                      Register
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">No Events Found</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your search terms or filters to find more events.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;