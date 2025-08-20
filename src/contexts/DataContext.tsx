import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Event status type
export type EventStatus = 'draft' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

// Team size configuration
export interface TeamSize {
  min: number;
  max: number;
}

// Prize breakdown
export interface PrizeBreakdown {
  place: string;
  amount: string;
  description: string;
}

// Event interface with judges property
export interface EventItem {
  id: number;
  title: string;
  description: string;
  longDescription?: string;
  startDate: string;
  endDate: string;
  venue?: string;
  address?: string;
  type: 'online' | 'offline' | 'hybrid';
  maxParticipants: number;
  registrationDeadline: string;
  submissionDeadline?: string;
  totalPrizePool?: string;
  prizeBreakdown?: PrizeBreakdown[];
  sponsors?: { name: string; tier: string }[];
  rules?: string[];
  requirements?: string[];
  tracks?: { name: string; description: string }[];
  image?: string;
  organizerId: string;
  organizerName?: string;
  participants: string[];
  teams?: { id: string; name: string; members: string[]; leaderId: string }[];
  registrationType: 'individual' | 'team' | 'both';
  teamSize?: TeamSize;
  status: EventStatus;
  currentRegistrations: number;
  tags: string[];
  judges?: { name: string; expertise: string[]; avatar?: string }[];
}

// Submission interface with judge scoring
export interface SubmissionItem {
  id: number;
  eventId: number;
  teamId?: string;
  userId: string;
  projectName: string;
  description: string;
  repositoryUrl?: string;
  liveUrl?: string;
  videoUrl?: string;
  submittedAt: string;
  status: 'draft' | 'submitted' | 'under_review' | 'reviewed';
  score?: number;
  feedback?: string;
  judgeScore?: number;
  judgeFeedback?: string;
}

// Data context interface
interface DataContextType {
  events: EventItem[];
  submissions: SubmissionItem[];
  createEvent: (event: Omit<EventItem, 'id' | 'participants' | 'teams' | 'currentRegistrations'>) => Promise<EventItem>;
  updateEvent: (id: number, updates: Partial<EventItem>) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
  registerForEvent: (eventId: number, userId: string, teamData?: { name: string; members: string[] }) => Promise<void>;
  unregisterFromEvent: (eventId: number, userId: string) => Promise<void>;
  createSubmission: (submission: Omit<SubmissionItem, 'id' | 'submittedAt'>) => Promise<SubmissionItem>;
  updateSubmission: (id: number, updates: Partial<SubmissionItem>) => Promise<void>;
  submitJudgeScore: (submissionId: number, score: number, feedback: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Seed data function
const getSeedEvents = (): EventItem[] => {
  const now = new Date();
  const nowYear = now.getFullYear();
  
  return [
    {
      id: 1,
      title: 'AI Innovation Challenge 2025',
      description: 'Join the most exciting AI hackathon of the year! Build innovative AI applications that solve real-world problems.',
      longDescription: 'The AI Innovation Challenge 2025 is a premier hackathon that brings together the brightest minds in artificial intelligence to tackle some of the world\'s most pressing challenges. Over the course of 48 hours, participants will work in teams to develop innovative solutions using state-of-the-art AI technologies.',
      startDate: `${nowYear}-02-15T09:00:00.000Z`,
      endDate: `${nowYear}-02-17T18:00:00.000Z`,
      venue: 'Moscone Convention Center',
      address: 'San Francisco, CA',
      type: 'offline',
      maxParticipants: 500,
      registrationDeadline: `${nowYear}-02-10T23:59:00.000Z`,
      submissionDeadline: `${nowYear}-02-17T18:00:00.000Z`,
      totalPrizePool: '$50,000',
      prizeBreakdown: [
        { place: '1st', amount: '$25,000', description: 'Grand Prize Winner' },
        { place: '2nd', amount: '$15,000', description: 'Runner-up' },
        { place: '3rd', amount: '$10,000', description: 'Third Place' },
      ],
      sponsors: [{ name: 'Google Cloud', tier: 'Platinum' }, { name: 'Microsoft Azure', tier: 'Gold' }],
      rules: ['All code must be written during the event', 'Teams of 2-4 members', 'Open source solutions preferred'],
      requirements: ['Bring your own laptop', 'Valid ID required', 'Basic programming knowledge'],
      tracks: [
        { name: 'Healthcare AI', description: 'AI solutions for medical diagnosis and treatment' },
        { name: 'Smart Cities', description: 'Urban planning and traffic management solutions' },
        { name: 'Education Tech', description: 'AI-powered learning and teaching tools' }
      ],
      image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
      organizerId: 'organizer-1',
      organizerName: 'TechCorp Innovations',
      participants: [],
      teams: [],
      registrationType: 'both',
      teamSize: { min: 2, max: 4 },
      status: 'upcoming',
      currentRegistrations: 250,
      tags: ['AI', 'Machine Learning', 'Innovation'],
      judges: [
        { name: 'Dr. Sarah Chen', expertise: ['AI', 'Machine Learning'], avatar: '👩‍💻' },
        { name: 'Marcus Rodriguez', expertise: ['Deep Learning', 'Computer Vision'], avatar: '👨‍🔬' },
        { name: 'Prof. Lisa Wang', expertise: ['NLP', 'Robotics'], avatar: '👩‍🏫' }
      ]
    },
    {
      id: 2,
      title: 'Web3 & Blockchain Summit',
      description: 'Build the future of decentralized applications and explore blockchain technology.',
      longDescription: 'Join developers, entrepreneurs, and blockchain enthusiasts in this intensive 3-day hackathon focused on Web3 technologies, DeFi protocols, and decentralized applications.',
      startDate: `${nowYear}-03-20T10:00:00.000Z`,
      endDate: `${nowYear}-03-22T20:00:00.000Z`,
      venue: 'Online',
      type: 'online',
      maxParticipants: 1000,
      registrationDeadline: `${nowYear}-03-15T23:59:00.000Z`,
      submissionDeadline: `${nowYear}-03-22T20:00:00.000Z`,
      totalPrizePool: '$75,000',
      prizeBreakdown: [
        { place: '1st', amount: '$40,000', description: 'Best DeFi Innovation' },
        { place: '2nd', amount: '$25,000', description: 'Best NFT Platform' },
        { place: '3rd', amount: '$10,000', description: 'Best Web3 Tool' },
      ],
      sponsors: [{ name: 'Ethereum Foundation', tier: 'Platinum' }, { name: 'Polygon', tier: 'Gold' }],
      rules: ['Smart contracts must be deployed on testnet', 'Open source required', 'Teams up to 6 members'],
      requirements: ['Solidity knowledge preferred', 'Web3 wallet required', 'GitHub account needed'],
      tracks: [
        { name: 'DeFi Protocols', description: 'Decentralized finance applications' },
        { name: 'NFT Platforms', description: 'Non-fungible token marketplaces and tools' },
        { name: 'Web3 Infrastructure', description: 'Developer tools and infrastructure' }
      ],
      image: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=800',
      organizerId: 'organizer-2',
      organizerName: 'Blockchain Developers Guild',
      participants: [],
      teams: [],
      registrationType: 'both',
      teamSize: { min: 1, max: 6 },
      status: 'upcoming',
      currentRegistrations: 420,
      tags: ['Blockchain', 'Web3', 'DeFi', 'Smart Contracts'],
      judges: [
        { name: 'Alex Thompson', expertise: ['Blockchain', 'Smart Contracts'], avatar: '👨‍💼' },
        { name: 'Maria Garcia', expertise: ['DeFi', 'Tokenomics'], avatar: '👩‍💼' },
        { name: 'David Kim', expertise: ['Web3', 'dApps'], avatar: '👨‍💻' }
      ]
    },
    {
      id: 3,
      title: 'Smart City Innovation Hackathon',
      description: 'Design solutions for urban challenges using IoT, AI, and sustainable technologies.',
      longDescription: 'A collaborative hackathon focused on creating smart city solutions that improve urban living through technology, sustainability, and citizen engagement.',
      startDate: `${nowYear}-11-10T08:00:00.000Z`,
      endDate: `${nowYear}-11-12T19:00:00.000Z`,
      venue: 'Innovation Hub',
      address: 'Austin, TX',
      type: 'hybrid',
      maxParticipants: 300,
      registrationDeadline: `${nowYear}-11-05T23:59:00.000Z`,
      submissionDeadline: `${nowYear}-11-12T19:00:00.000Z`,
      totalPrizePool: '$40,000',
      prizeBreakdown: [
        { place: '1st', amount: '$20,000', description: 'Best Overall Solution' },
        { place: '2nd', amount: '$12,000', description: 'Most Innovative Approach' },
        { place: '3rd', amount: '$8,000', description: 'Best Sustainability Impact' },
      ],
      sponsors: [{ name: 'Cisco', tier: 'Platinum' }, { name: 'IBM', tier: 'Gold' }],
      rules: ['Focus on real urban problems', 'Sustainability considerations required', 'Prototype demonstration needed'],
      requirements: ['Urban planning knowledge helpful', 'IoT or AI experience preferred', 'Team collaboration skills'],
      tracks: [
        { name: 'Transportation', description: 'Smart mobility and traffic solutions' },
        { name: 'Energy Management', description: 'Smart grid and renewable energy' },
        { name: 'Waste Management', description: 'Circular economy and waste reduction' }
      ],
      image: 'https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?auto=compress&cs=tinysrgb&w=800',
      organizerId: 'organizer-1',
      organizerName: 'Urban Innovation Lab',
      participants: [],
      teams: [],
      registrationType: 'both',
      teamSize: { min: 2, max: 8 },
      status: 'completed',
      currentRegistrations: 280,
      tags: ['Smart Cities', 'IoT', 'Sustainability', 'Urban Planning'],
      judges: [
        { name: 'Jennifer Liu', expertise: ['Urban Planning', 'Smart Cities'], avatar: '👩‍🏗️' },
        { name: 'Robert Chen', expertise: ['IoT', 'Sensors'], avatar: '👨‍🔧' },
        { name: 'Anna Rodriguez', expertise: ['Sustainability', 'Green Tech'], avatar: '👩‍🌾' }
      ]
    },
    {
      id: 4,
      title: 'FinTech Revolution 2025',
      description: 'Transform financial services with cutting-edge technology and innovative payment solutions.',
      longDescription: 'Join the FinTech Revolution and build the next generation of financial applications. Focus on digital banking, payment systems, and financial inclusion technologies.',
      startDate: `${nowYear}-04-05T09:00:00.000Z`,
      endDate: `${nowYear}-04-07T18:00:00.000Z`,
      venue: 'Financial District Center',
      address: 'New York, NY',
      type: 'offline',
      maxParticipants: 400,
      registrationDeadline: `${nowYear}-03-30T23:59:00.000Z`,
      submissionDeadline: `${nowYear}-04-07T18:00:00.000Z`,
      totalPrizePool: '$60,000',
      prizeBreakdown: [
        { place: '1st', amount: '$30,000', description: 'Best FinTech Innovation' },
        { place: '2nd', amount: '$20,000', description: 'Best Payment Solution' },
        { place: '3rd', amount: '$10,000', description: 'Best Financial Inclusion App' },
      ],
      sponsors: [{ name: 'JPMorgan Chase', tier: 'Platinum' }, { name: 'Stripe', tier: 'Gold' }],
      rules: ['Must integrate with real APIs', 'Security-first approach required', 'Teams of 2-5 members'],
      requirements: ['Financial services knowledge helpful', 'API integration experience', 'Security awareness'],
      tracks: [
        { name: 'Digital Banking', description: 'Next-gen banking applications and services' },
        { name: 'Payment Innovation', description: 'Revolutionary payment and transfer solutions' },
        { name: 'Financial Inclusion', description: 'Accessible financial services for underserved communities' }
      ],
      image: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=800',
      organizerId: 'organizer-3',
      organizerName: 'FinTech Innovators',
      participants: [],
      teams: [],
      registrationType: 'both',
      teamSize: { min: 2, max: 5 },
      status: 'upcoming',
      currentRegistrations: 180,
      tags: ['FinTech', 'Banking', 'Payments', 'API'],
      judges: [
        { name: 'Jennifer Liu', expertise: ['FinTech', 'Digital Banking'], avatar: '👩‍💼' },
        { name: 'Robert Singh', expertise: ['Payment Systems', 'Security'], avatar: '👨‍💼' },
        { name: 'Amanda Foster', expertise: ['Financial Inclusion', 'UX'], avatar: '👩‍💻' }
      ]
    },
    {
      id: 5,
      title: 'Gaming & VR Experience Jam',
      description: 'Create immersive gaming experiences using VR, AR, and cutting-edge game development technologies.',
      longDescription: 'Dive into the world of immersive gaming and virtual reality. Build games, VR experiences, and interactive entertainment that pushes the boundaries of digital experiences.',
      startDate: `${nowYear}-05-12T10:00:00.000Z`,
      endDate: `${nowYear}-05-14T20:00:00.000Z`,
      venue: 'Gaming Arena Complex',
      address: 'Los Angeles, CA',
      type: 'offline',
      maxParticipants: 350,
      registrationDeadline: `${nowYear}-05-07T23:59:00.000Z`,
      submissionDeadline: `${nowYear}-05-14T20:00:00.000Z`,
      totalPrizePool: '$45,000',
      prizeBreakdown: [
        { place: '1st', amount: '$25,000', description: 'Best Overall Game' },
        { place: '2nd', amount: '$12,000', description: 'Best VR Experience' },
        { place: '3rd', amount: '$8,000', description: 'Most Creative Concept' },
      ],
      sponsors: [{ name: 'Unity Technologies', tier: 'Platinum' }, { name: 'Oculus', tier: 'Gold' }],
      rules: ['Original game concepts only', 'Must be playable demo', 'Teams up to 4 members'],
      requirements: ['Game development experience', 'Unity or Unreal Engine knowledge', 'VR headset access preferred'],
      tracks: [
        { name: 'VR Gaming', description: 'Immersive virtual reality game experiences' },
        { name: 'Mobile Gaming', description: 'Innovative mobile game concepts' },
        { name: 'AR Experiences', description: 'Augmented reality interactive applications' }
      ],
      image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800',
      organizerId: 'organizer-4',
      organizerName: 'Game Developers United',
      participants: [],
      teams: [],
      registrationType: 'both',
      teamSize: { min: 1, max: 4 },
      status: 'upcoming',
      currentRegistrations: 220,
      tags: ['Gaming', 'VR', 'AR', 'Unity', 'Game Development'],
      judges: [
        { name: 'Chris Martinez', expertise: ['Game Design', 'VR Development'], avatar: '👨‍🎮' },
        { name: 'Sophie Chen', expertise: ['3D Graphics', 'AR'], avatar: '👩‍🎨' },
        { name: 'Tyler Johnson', expertise: ['Game Programming', 'Unity'], avatar: '👨‍💻' }
      ]
    },
    {
      id: 6,
      title: 'HealthTech Innovation Challenge',
      description: 'Develop healthcare solutions that improve patient outcomes and medical efficiency.',
      longDescription: 'Join healthcare professionals and developers to create technology solutions that address critical healthcare challenges, from telemedicine to medical device integration.',
      startDate: `${nowYear}-06-18T08:00:00.000Z`,
      endDate: `${nowYear}-06-20T17:00:00.000Z`,
      venue: 'Medical Innovation Center',
      address: 'Boston, MA',
      type: 'hybrid',
      maxParticipants: 280,
      registrationDeadline: `${nowYear}-06-13T23:59:00.000Z`,
      submissionDeadline: `${nowYear}-06-20T17:00:00.000Z`,
      totalPrizePool: '$55,000',
      prizeBreakdown: [
        { place: '1st', amount: '$30,000', description: 'Best Healthcare Innovation' },
        { place: '2nd', amount: '$15,000', description: 'Best Telemedicine Solution' },
        { place: '3rd', amount: '$10,000', description: 'Best Patient Experience App' },
      ],
      sponsors: [{ name: 'Mayo Clinic', tier: 'Platinum' }, { name: 'Philips Healthcare', tier: 'Gold' }],
      rules: ['HIPAA compliance required', 'Patient privacy paramount', 'Teams of 2-6 members'],
      requirements: ['Healthcare domain knowledge helpful', 'Data security awareness', 'Medical API familiarity'],
      tracks: [
        { name: 'Telemedicine', description: 'Remote healthcare delivery solutions' },
        { name: 'Medical Devices', description: 'IoT and connected medical device integration' },
        { name: 'Patient Care', description: 'Apps improving patient experience and outcomes' }
      ],
      image: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=800',
      organizerId: 'organizer-5',
      organizerName: 'HealthTech Pioneers',
      participants: [],
      teams: [],
      registrationType: 'both',
      teamSize: { min: 2, max: 6 },
      status: 'upcoming',
      currentRegistrations: 160,
      tags: ['HealthTech', 'Telemedicine', 'Medical Devices', 'Patient Care'],
      judges: [
        { name: 'Dr. Michael Brown', expertise: ['Digital Health', 'Telemedicine'], avatar: '👨‍⚕️' },
        { name: 'Dr. Rachel Green', expertise: ['Medical Devices', 'IoT'], avatar: '👩‍⚕️' },
        { name: 'James Wilson', expertise: ['Healthcare IT', 'Data Security'], avatar: '👨‍💼' }
      ]
    },
    {
      id: 7,
      title: 'Climate Tech Solutions Summit',
      description: 'Build technology solutions to combat climate change and promote environmental sustainability.',
      longDescription: 'Address the climate crisis through innovative technology solutions. Focus on renewable energy, carbon tracking, sustainable agriculture, and environmental monitoring.',
      startDate: `${nowYear}-07-25T09:00:00.000Z`,
      endDate: `${nowYear}-07-27T18:00:00.000Z`,
      venue: 'Green Tech Campus',
      address: 'Seattle, WA',
      type: 'offline',
      maxParticipants: 320,
      registrationDeadline: `${nowYear}-07-20T23:59:00.000Z`,
      submissionDeadline: `${nowYear}-07-27T18:00:00.000Z`,
      totalPrizePool: '$70,000',
      prizeBreakdown: [
        { place: '1st', amount: '$35,000', description: 'Best Climate Impact Solution' },
        { place: '2nd', amount: '$20,000', description: 'Best Renewable Energy App' },
        { place: '3rd', amount: '$15,000', description: 'Best Sustainability Tool' },
      ],
      sponsors: [{ name: 'Tesla', tier: 'Platinum' }, { name: 'Microsoft Sustainability', tier: 'Gold' }],
      rules: ['Focus on environmental impact', 'Measurable sustainability metrics', 'Teams of 2-5 members'],
      requirements: ['Environmental science knowledge helpful', 'Data visualization skills', 'IoT sensor experience preferred'],
      tracks: [
        { name: 'Renewable Energy', description: 'Solar, wind, and clean energy solutions' },
        { name: 'Carbon Tracking', description: 'Carbon footprint monitoring and reduction' },
        { name: 'Smart Agriculture', description: 'Sustainable farming and food production' }
      ],
      image: 'https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=800',
      organizerId: 'organizer-6',
      organizerName: 'Climate Tech Alliance',
      participants: [],
      teams: [],
      registrationType: 'both',
      teamSize: { min: 2, max: 5 },
      status: 'upcoming',
      currentRegistrations: 195,
      tags: ['Climate Tech', 'Sustainability', 'Renewable Energy', 'Environment'],
      judges: [
        { name: 'Dr. Emma Watson', expertise: ['Climate Science', 'Renewable Energy'], avatar: '👩‍🔬' },
        { name: 'Carlos Rodriguez', expertise: ['Sustainability', 'IoT'], avatar: '👨‍🌾' },
        { name: 'Lisa Park', expertise: ['Environmental Data', 'Carbon Tracking'], avatar: '👩‍💻' }
      ]
    }
  ];
};

// Seed submissions data
const getSeedSubmissions = (): SubmissionItem[] => {
  return [
    {
      id: 1,
      eventId: 1,
      userId: 'participant-1',
      projectName: 'MediAI Assistant',
      description: 'AI-powered medical diagnosis assistant using computer vision',
      repositoryUrl: 'https://github.com/user/mediai-assistant',
      liveUrl: 'https://mediai-demo.vercel.app',
      submittedAt: '2025-02-17T17:30:00.000Z',
      status: 'reviewed',
      score: 95,
      feedback: 'Excellent implementation with strong medical accuracy',
      judgeScore: 95,
      judgeFeedback: 'Outstanding work on the AI model training and user interface'
    },
    {
      id: 2,
      eventId: 2,
      userId: 'participant-2',
      projectName: 'DeFi Yield Optimizer',
      description: 'Smart contract platform for optimizing DeFi yield farming strategies',
      repositoryUrl: 'https://github.com/user/defi-optimizer',
      submittedAt: '2025-03-22T19:45:00.000Z',
      status: 'submitted',
      score: 88,
      feedback: 'Good technical implementation, could improve UI/UX'
    }
  ];
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);

  // Load events with backend integration
  const loadEvents = useCallback(async () => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      if (apiBaseUrl) {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${apiBaseUrl}/events`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });
        
        if (response.ok) {
          const apiEvents = await response.json();
          setEvents(apiEvents);
          localStorage.setItem('events', JSON.stringify(apiEvents));
          return;
        }
      }
    } catch (error) {
      console.warn('Failed to load events from API, using localStorage:', error);
    }
    
    // Fallback to localStorage or seed data
    const stored = localStorage.getItem('events');
    if (stored) {
      setEvents(JSON.parse(stored));
    } else {
      const seedEvents = getSeedEvents();
      setEvents(seedEvents);
      localStorage.setItem('events', JSON.stringify(seedEvents));
    }
  }, []);

  // Load submissions with backend integration
  const loadSubmissions = useCallback(async () => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      if (apiBaseUrl) {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${apiBaseUrl}/submissions`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });
        
        if (response.ok) {
          const apiSubmissions = await response.json();
          setSubmissions(apiSubmissions);
          localStorage.setItem('submissions', JSON.stringify(apiSubmissions));
          return;
        }
      }
    } catch (error) {
      console.warn('Failed to load submissions from API, using localStorage:', error);
    }
    
    // Fallback to localStorage or seed data
    const stored = localStorage.getItem('submissions');
    if (stored) {
      setSubmissions(JSON.parse(stored));
    } else {
      const seedSubmissions = getSeedSubmissions();
      setSubmissions(seedSubmissions);
      localStorage.setItem('submissions', JSON.stringify(seedSubmissions));
    }
  }, []);

  useEffect(() => {
    loadEvents();
    loadSubmissions();
  }, [loadEvents, loadSubmissions]);

  // Create event with backend integration
  const createEvent = async (eventData: Omit<EventItem, 'id' | 'participants' | 'teams' | 'currentRegistrations'>): Promise<EventItem> => {
    const newEvent: EventItem = {
      ...eventData,
      id: Date.now(),
      participants: [],
      teams: [],
      currentRegistrations: 0
    };

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      if (apiBaseUrl) {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${apiBaseUrl}/events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify(newEvent),
        });
        
        if (response.ok) {
          const createdEvent = await response.json();
          setEvents(prev => [...prev, createdEvent]);
          localStorage.setItem('events', JSON.stringify([...events, createdEvent]));
          return createdEvent;
        }
      }
    } catch (error) {
      console.warn('Failed to create event via API, using localStorage:', error);
    }

    // Fallback to localStorage
    setEvents(prev => [...prev, newEvent]);
    const updatedEvents = [...events, newEvent];
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    return newEvent;
  };

  // Update event with backend integration
  const updateEvent = async (id: number, updates: Partial<EventItem>): Promise<void> => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      if (apiBaseUrl) {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${apiBaseUrl}/events/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify(updates),
        });
        
        if (response.ok) {
          setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
          const updatedEvents = events.map(e => e.id === id ? { ...e, ...updates } : e);
          localStorage.setItem('events', JSON.stringify(updatedEvents));
          return;
        }
      }
    } catch (error) {
      console.warn('Failed to update event via API, using localStorage:', error);
    }

    // Fallback to localStorage
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    const updatedEvents = events.map(e => e.id === id ? { ...e, ...updates } : e);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };

  // Delete event with backend integration
  const deleteEvent = async (id: number): Promise<void> => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      if (apiBaseUrl) {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${apiBaseUrl}/events/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });
        
        if (response.ok) {
          setEvents(prev => prev.filter(e => e.id !== id));
          const updatedEvents = events.filter(e => e.id !== id);
          localStorage.setItem('events', JSON.stringify(updatedEvents));
          return;
        }
      }
    } catch (error) {
      console.warn('Failed to delete event via API, using localStorage:', error);
    }

    // Fallback to localStorage
    setEvents(prev => prev.filter(e => e.id !== id));
    const updatedEvents = events.filter(e => e.id !== id);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };

  // Register for event with backend integration
  const registerForEvent = async (eventId: number, userId: string, teamData?: { name: string; members: string[] }): Promise<void> => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      if (apiBaseUrl) {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${apiBaseUrl}/events/${eventId}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({ userId, teamData }),
        });
        
        if (response.ok) {
          setEvents(prev => prev.map(e => 
            e.id === eventId 
              ? { 
                  ...e, 
                  participants: [...e.participants, userId],
                  currentRegistrations: e.currentRegistrations + 1
                }
              : e
          ));
          const updatedEvents = events.map(e => 
            e.id === eventId 
              ? { 
                  ...e, 
                  participants: [...e.participants, userId],
                  currentRegistrations: e.currentRegistrations + 1
                }
              : e
          );
          localStorage.setItem('events', JSON.stringify(updatedEvents));
          return;
        }
      }
    } catch (error) {
      console.warn('Failed to register for event via API, using localStorage:', error);
    }

    // Fallback to localStorage
    setEvents(prev => prev.map(e => 
      e.id === eventId 
        ? { 
            ...e, 
            participants: [...e.participants, userId],
            currentRegistrations: e.currentRegistrations + 1
          }
        : e
    ));
    const updatedEvents = events.map(e => 
      e.id === eventId 
        ? { 
            ...e, 
            participants: [...e.participants, userId],
            currentRegistrations: e.currentRegistrations + 1
          }
        : e
    );
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };

  // Unregister from event with backend integration
  const unregisterFromEvent = async (eventId: number, userId: string): Promise<void> => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      if (apiBaseUrl) {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${apiBaseUrl}/events/${eventId}/unregister`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({ userId }),
        });
        
        if (response.ok) {
          setEvents(prev => prev.map(e => 
            e.id === eventId 
              ? { 
                  ...e, 
                  participants: e.participants.filter(p => p !== userId),
                  currentRegistrations: Math.max(0, e.currentRegistrations - 1)
                }
              : e
          ));
          const updatedEvents = events.map(e => 
            e.id === eventId 
              ? { 
                  ...e, 
                  participants: e.participants.filter(p => p !== userId),
                  currentRegistrations: Math.max(0, e.currentRegistrations - 1)
                }
              : e
          );
          localStorage.setItem('events', JSON.stringify(updatedEvents));
          return;
        }
      }
    } catch (error) {
      console.warn('Failed to unregister from event via API, using localStorage:', error);
    }

    // Fallback to localStorage
    setEvents(prev => prev.map(e => 
      e.id === eventId 
        ? { 
            ...e, 
            participants: e.participants.filter(p => p !== userId),
            currentRegistrations: Math.max(0, e.currentRegistrations - 1)
          }
        : e
    ));
    const updatedEvents = events.map(e => 
      e.id === eventId 
        ? { 
            ...e, 
            participants: e.participants.filter(p => p !== userId),
            currentRegistrations: Math.max(0, e.currentRegistrations - 1)
          }
        : e
    );
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };

  // Create submission with backend integration
  const createSubmission = async (submissionData: Omit<SubmissionItem, 'id' | 'submittedAt'>): Promise<SubmissionItem> => {
    const newSubmission: SubmissionItem = {
      ...submissionData,
      id: Date.now(),
      submittedAt: new Date().toISOString()
    };

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      if (apiBaseUrl) {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${apiBaseUrl}/submissions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify(newSubmission),
        });
        
        if (response.ok) {
          const createdSubmission = await response.json();
          setSubmissions(prev => [...prev, createdSubmission]);
          localStorage.setItem('submissions', JSON.stringify([...submissions, createdSubmission]));
          return createdSubmission;
        }
      }
    } catch (error) {
      console.warn('Failed to create submission via API, using localStorage:', error);
    }

    // Fallback to localStorage
    setSubmissions(prev => [...prev, newSubmission]);
    const updatedSubmissions = [...submissions, newSubmission];
    localStorage.setItem('submissions', JSON.stringify(updatedSubmissions));
    return newSubmission;
  };

  // Update submission with backend integration
  const updateSubmission = async (id: number, updates: Partial<SubmissionItem>): Promise<void> => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      if (apiBaseUrl) {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${apiBaseUrl}/submissions/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify(updates),
        });
        
        if (response.ok) {
          setSubmissions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
          const updatedSubmissions = submissions.map(s => s.id === id ? { ...s, ...updates } : s);
          localStorage.setItem('submissions', JSON.stringify(updatedSubmissions));
          return;
        }
      }
    } catch (error) {
      console.warn('Failed to update submission via API, using localStorage:', error);
    }

    // Fallback to localStorage
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    const updatedSubmissions = submissions.map(s => s.id === id ? { ...s, ...updates } : s);
    localStorage.setItem('submissions', JSON.stringify(updatedSubmissions));
  };

  // Submit judge score with backend integration
  const submitJudgeScore = async (submissionId: number, score: number, feedback: string): Promise<void> => {
    const updates = { judgeScore: score, judgeFeedback: feedback, status: 'reviewed' as const };
    
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      if (apiBaseUrl) {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${apiBaseUrl}/submissions/${submissionId}/judge-score`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({ score, feedback }),
        });
        
        if (response.ok) {
          setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, ...updates } : s));
          const updatedSubmissions = submissions.map(s => s.id === submissionId ? { ...s, ...updates } : s);
          localStorage.setItem('submissions', JSON.stringify(updatedSubmissions));
          return;
        }
      }
    } catch (error) {
      console.warn('Failed to submit judge score via API, using localStorage:', error);
    }

    // Fallback to localStorage
    setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, ...updates } : s));
    const updatedSubmissions = submissions.map(s => s.id === submissionId ? { ...s, ...updates } : s);
    localStorage.setItem('submissions', JSON.stringify(updatedSubmissions));
  };

  const value: DataContextType = {
    events,
    submissions,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    unregisterFromEvent,
    createSubmission,
    updateSubmission,
    submitJudgeScore,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
