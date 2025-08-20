import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Trophy, Plus, X, Upload } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [eventData, setEventData] = useState({
    // Basic Information
    title: '',
    description: '',
    longDescription: '',
    category: '',
    tags: [],
    
    // Event Details
    startDate: '',
    endDate: '',
    timezone: 'PST',
    type: 'offline',
    venue: '',
    address: '',
    
    // Participation
    maxParticipants: '',
    teamSize: { min: 1, max: 4 },
    registrationDeadline: '',
    
    // Prizes & Sponsors
    totalPrizePool: '',
    prizeBreakdown: [
      { place: '1st', amount: '', description: '' },
      { place: '2nd', amount: '', description: '' },
      { place: '3rd', amount: '', description: '' }
    ],
    sponsors: [],
    
    // Rules & Requirements
    rules: [],
    requirements: [],
    tracks: [],
    
    // Judges
    judges: [],
    
    // Additional Settings
    allowTeamFormation: true,
    publicEvent: true,
    requireApproval: false
  });

  const [newTag, setNewTag] = useState('');
  const [newRule, setNewRule] = useState('');
  const [newRequirement, setNewRequirement] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setEventData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !eventData.tags.includes(newTag.trim())) {
      setEventData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setEventData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addRule = () => {
    if (newRule.trim()) {
      setEventData(prev => ({
        ...prev,
        rules: [...prev.rules, newRule.trim()]
      }));
      setNewRule('');
    }
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setEventData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const { createEvent } = useData();

  const handleSubmit = () => {
    try {
      const created = createEvent({
        title: eventData.title,
        description: eventData.description,
        longDescription: eventData.longDescription,
        category: eventData.category,
        tags: eventData.tags as string[],
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        timezone: eventData.timezone,
        type: eventData.type as any,
        venue: eventData.venue,
        address: eventData.address,
        maxParticipants: Number(eventData.maxParticipants || 0),
        registrationDeadline: eventData.registrationDeadline,
        totalPrizePool: eventData.totalPrizePool,
        prizeBreakdown: eventData.prizeBreakdown as any,
        sponsors: eventData.sponsors as any,
        rules: eventData.rules as any,
        requirements: eventData.requirements as any,
        tracks: eventData.tracks as any,
        image: undefined,
        organizerName: undefined,
        organizerId: undefined as any,
        participants: undefined as any,
        status: undefined as any,
      } as any);
      alert(`Event "${created.title}" created successfully! You can now view it in the events list.`);
      navigate('/events');
    } catch (e) {
      alert('Failed to create event');
    }
  };

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Event title and description' },
    { id: 2, title: 'Details', description: 'Date, time, and location' },
    { id: 3, title: 'Participation', description: 'Team size and registration' },
    { id: 4, title: 'Prizes', description: 'Prize pool and sponsors' },
    { id: 5, title: 'Rules', description: 'Guidelines and requirements' },
    { id: 6, title: 'Review', description: 'Final review and publish' }
  ];

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              currentStep >= step.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-white/10 text-gray-400 border border-white/20'
            }`}>
              {step.id}
            </div>
            <div className="ml-3 hidden sm:block">
              <p className={`text-sm font-medium ${
                currentStep >= step.id ? 'text-white' : 'text-gray-400'
              }`}>
                {step.title}
              </p>
              <p className="text-xs text-gray-400">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-4 ${
                currentStep > step.id ? 'bg-blue-600' : 'bg-white/20'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">Event Title *</label>
        <input
          type="text"
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your event title"
          value={eventData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">Short Description *</label>
        <textarea
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
          placeholder="Brief description of your event"
          value={eventData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">Detailed Description</label>
        <textarea
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
          placeholder="Detailed description, objectives, and what participants can expect"
          value={eventData.longDescription}
          onChange={(e) => handleInputChange('longDescription', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">Category *</label>
        <select
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={eventData.category}
          onChange={(e) => handleInputChange('category', e.target.value)}
        >
          <option value="" className="bg-gray-900">Select a category</option>
          <option value="ai-ml" className="bg-gray-900">AI & Machine Learning</option>
          <option value="web-dev" className="bg-gray-900">Web Development</option>
          <option value="mobile" className="bg-gray-900">Mobile Apps</option>
          <option value="blockchain" className="bg-gray-900">Blockchain & Web3</option>
          <option value="iot" className="bg-gray-900">IoT & Hardware</option>
          <option value="sustainability" className="bg-gray-900">Sustainability</option>
          <option value="fintech" className="bg-gray-900">FinTech</option>
          <option value="healthtech" className="bg-gray-900">HealthTech</option>
          <option value="gaming" className="bg-gray-900">Gaming</option>
          <option value="open" className="bg-gray-900">Open Innovation</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">Tags</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {eventData.tags.map((tag) => (
            <span
              key={tag}
              className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm border border-blue-500/30 flex items-center"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-2 hover:text-blue-300"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTag()}
          />
          <button
            onClick={addTag}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderEventDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Start Date & Time *</label>
          <input
            type="datetime-local"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={eventData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">End Date & Time *</label>
          <input
            type="datetime-local"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={eventData.endDate}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">Event Type *</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleInputChange('type', 'online')}
            className={`p-4 rounded-lg border text-center transition-colors ${
              eventData.type === 'online'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'
            }`}
          >
            <div className="text-2xl mb-2">💻</div>
            <div className="font-medium">Online</div>
            <div className="text-sm opacity-75">Virtual event</div>
          </button>
          <button
            onClick={() => handleInputChange('type', 'offline')}
            className={`p-4 rounded-lg border text-center transition-colors ${
              eventData.type === 'offline'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'
            }`}
          >
            <div className="text-2xl mb-2">🏢</div>
            <div className="font-medium">In-Person</div>
            <div className="text-sm opacity-75">Physical venue</div>
          </button>
        </div>
      </div>

      {eventData.type === 'offline' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Venue Name *</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Convention Center, University, etc."
              value={eventData.venue}
              onChange={(e) => handleInputChange('venue', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Address *</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Full address"
              value={eventData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">Cover Image</label>
        <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">Upload event cover image</p>
          <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Choose File
          </button>
        </div>
      </div>
    </div>
  );

  const renderParticipation = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Maximum Participants *</label>
          <input
            type="number"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="500"
            value={eventData.maxParticipants}
            onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Registration Deadline *</label>
          <input
            type="datetime-local"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={eventData.registrationDeadline}
            onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">Team Size</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-2">Minimum</label>
            <input
              type="number"
              min="1"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={eventData.teamSize.min}
              onChange={(e) => handleInputChange('teamSize', { ...eventData.teamSize, min: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-2">Maximum</label>
            <input
              type="number"
              min="1"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={eventData.teamSize.max}
              onChange={(e) => handleInputChange('teamSize', { ...eventData.teamSize, max: parseInt(e.target.value) })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-medium text-white">Registration Settings</h4>
        
        <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/10">
          <div>
            <p className="text-white font-medium">Allow Team Formation</p>
            <p className="text-sm text-gray-400">Participants can form teams after registration</p>
          </div>
          <button
            onClick={() => handleInputChange('allowTeamFormation', !eventData.allowTeamFormation)}
            className={`w-12 h-6 rounded-full transition-colors ${
              eventData.allowTeamFormation ? 'bg-blue-600' : 'bg-gray-600'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
              eventData.allowTeamFormation ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/10">
          <div>
            <p className="text-white font-medium">Public Event</p>
            <p className="text-sm text-gray-400">Anyone can discover and register for this event</p>
          </div>
          <button
            onClick={() => handleInputChange('publicEvent', !eventData.publicEvent)}
            className={`w-12 h-6 rounded-full transition-colors ${
              eventData.publicEvent ? 'bg-blue-600' : 'bg-gray-600'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
              eventData.publicEvent ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/10">
          <div>
            <p className="text-white font-medium">Require Approval</p>
            <p className="text-sm text-gray-400">Manual approval required for each registration</p>
          </div>
          <button
            onClick={() => handleInputChange('requireApproval', !eventData.requireApproval)}
            className={`w-12 h-6 rounded-full transition-colors ${
              eventData.requireApproval ? 'bg-blue-600' : 'bg-gray-600'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
              eventData.requireApproval ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderPrizes = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">Total Prize Pool</label>
        <input
          type="text"
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="$50,000"
          value={eventData.totalPrizePool}
          onChange={(e) => handleInputChange('totalPrizePool', e.target.value)}
        />
      </div>

      <div>
        <h4 className="text-lg font-medium text-white mb-4">Prize Breakdown</h4>
        <div className="space-y-4">
          {eventData.prizeBreakdown.map((prize, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/5 p-4 rounded-lg border border-white/10">
              <div>
                <label className="block text-xs text-gray-400 mb-2">Place</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                  value={prize.place}
                  onChange={(e) => {
                    const newBreakdown = [...eventData.prizeBreakdown];
                    newBreakdown[index].place = e.target.value;
                    handleInputChange('prizeBreakdown', newBreakdown);
                  }}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-2">Amount</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                  placeholder="$25,000"
                  value={prize.amount}
                  onChange={(e) => {
                    const newBreakdown = [...eventData.prizeBreakdown];
                    newBreakdown[index].amount = e.target.value;
                    handleInputChange('prizeBreakdown', newBreakdown);
                  }}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-2">Description</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                  placeholder="Grand Prize Winner"
                  value={prize.description}
                  onChange={(e) => {
                    const newBreakdown = [...eventData.prizeBreakdown];
                    newBreakdown[index].description = e.target.value;
                    handleInputChange('prizeBreakdown', newBreakdown);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium text-white mb-4">Sponsors</h4>
        <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">🏢</div>
          <p className="text-gray-400 mb-2">Add sponsor logos and information</p>
          <p className="text-sm text-gray-500">Upload logos and add sponsor details</p>
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add Sponsor
          </button>
        </div>
      </div>
    </div>
  );

  const renderRules = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">Event Rules</label>
        <div className="space-y-2 mb-4">
          {eventData.rules.map((rule, index) => (
            <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded border border-white/10">
              <span className="text-gray-300">{rule}</span>
              <button
                onClick={() => {
                  const newRules = eventData.rules.filter((_, i) => i !== index);
                  handleInputChange('rules', newRules);
                }}
                className="text-red-400 hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a rule"
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addRule()}
          />
          <button
            onClick={addRule}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">Requirements</label>
        <div className="space-y-2 mb-4">
          {eventData.requirements.map((requirement, index) => (
            <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded border border-white/10">
              <span className="text-gray-300">{requirement}</span>
              <button
                onClick={() => {
                  const newRequirements = eventData.requirements.filter((_, i) => i !== index);
                  handleInputChange('requirements', newRequirements);
                }}
                className="text-red-400 hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a requirement"
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
          />
          <button
            onClick={addRequirement}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium text-white mb-4">Event Tracks</h4>
        <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">🎯</div>
          <p className="text-gray-400 mb-2">Add different tracks or themes</p>
          <p className="text-sm text-gray-500">Participants can choose which track to compete in</p>
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add Track
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium text-white mb-4">Judges</h4>
        <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">⚖️</div>
          <p className="text-gray-400 mb-2">Add judges for your event</p>
          <p className="text-sm text-gray-500">Invite industry experts to evaluate submissions</p>
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add Judge
          </button>
        </div>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-4">Event Summary</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-white mb-2">{eventData.title}</h4>
            <p className="text-gray-300">{eventData.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center text-gray-300">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{eventData.startDate} - {eventData.endDate}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{eventData.type === 'online' ? 'Online Event' : `${eventData.venue}, ${eventData.address}`}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Users className="h-5 w-5 mr-2" />
              <span>Max {eventData.maxParticipants} participants</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Trophy className="h-5 w-5 mr-2" />
              <span>{eventData.totalPrizePool} in prizes</span>
            </div>
          </div>

          {eventData.tags.length > 0 && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {eventData.tags.map((tag) => (
                  <span key={tag} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm border border-blue-500/30">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {eventData.rules.length > 0 && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Rules ({eventData.rules.length}):</p>
              <ul className="text-gray-300 text-sm space-y-1">
                {eventData.rules.slice(0, 3).map((rule, index) => (
                  <li key={index}>• {rule}</li>
                ))}
                {eventData.rules.length > 3 && (
                  <li className="text-gray-500">... and {eventData.rules.length - 3} more</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <h4 className="text-yellow-400 font-medium mb-2">⚠️ Before Publishing</h4>
        <ul className="text-yellow-300 text-sm space-y-1">
          <li>• Make sure all required fields are filled</li>
          <li>• Review event dates and times</li>
          <li>• Verify prize amounts and sponsor information</li>
          <li>• Double-check venue details for in-person events</li>
        </ul>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInfo();
      case 2:
        return renderEventDetails();
      case 3:
        return renderParticipation();
      case 4:
        return renderPrizes();
      case 5:
        return renderRules();
      case 6:
        return renderReview();
      default:
        return renderBasicInfo();
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create New Event</h1>
          <p className="text-gray-600 dark:text-gray-300">Set up your hackathon or innovation challenge</p>
        </div>

        {renderStepIndicator()}

        <div className="card p-6 md:p-8">
          {renderCurrentStep()}

          <div className="flex justify-between mt-8 pt-6 border-t border-black/10 dark:border-white/20">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg transition-colors ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-600'
                  : 'btn-ghost'
              }`}
            >
              Previous
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => navigate('/dashboard/organizer')}
                className="px-6 py-2 btn-ghost"
              >
                Save Draft
              </button>
              
              {currentStep === 6 ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 btn-primary"
                >
                  Publish Event
                </button>
              ) : (
                <button
                  onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}
                  className="px-6 py-2 btn-primary"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;