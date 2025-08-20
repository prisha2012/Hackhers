import React, { useState } from 'react';
import { 
  ClipboardCheck, Star, MessageCircle, Calendar, 
  Award, FileText, Eye, Download, CheckCircle 
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

const JudgeDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { events, submissions } = useData();
  const { user } = useAuth();

  // Filter events where this user is assigned as judge
  const judgeEvents = events.filter(event => 
    event.judges?.some(judge => judge.name === user?.name)
  );
  
  // Filter submissions for events this judge is assigned to
  const judgeSubmissions = submissions.filter(submission =>
    judgeEvents.some(event => event.id === submission.eventId)
  );

  const pendingReviews = judgeSubmissions.filter(sub => !sub.judgeScore);
  const completedReviews = judgeSubmissions.filter(sub => sub.judgeScore);

  const judgeData = {
    name: user?.name || "Judge",
    expertise: ["AI/ML", "Data Science", "Computer Vision"],
    eventsJudged: judgeEvents.length,
    projectsEvaluated: completedReviews.length,
    averageScore: completedReviews.length > 0 ? 
      completedReviews.reduce((sum, sub) => sum + (sub.judgeScore || 0), 0) / completedReviews.length : 0,
    currentAssignments: judgeEvents.map(event => ({
      id: event.id,
      eventName: event.title,
      projectsToReview: judgeSubmissions.filter(sub => sub.eventId === event.id && !sub.judgeScore).length,
      deadline: new Date(event.submissionDeadline || event.endDate).toLocaleDateString(),
      status: event.status
    })),
    pendingReviews: pendingReviews.map(sub => ({
      id: sub.id,
      projectName: sub.title,
      teamName: sub.teamName || sub.submitterName || "Individual",
      submittedDate: new Date(sub.createdAt).toLocaleDateString(),
      category: judgeEvents.find(e => e.id === sub.eventId)?.category || "General",
      priority: "medium"
    })),
    completedReviews: completedReviews.map(sub => ({
      id: sub.id,
      projectName: sub.title,
      teamName: sub.teamName || sub.submitterName || "Individual",
      score: sub.judgeScore || 0,
      category: judgeEvents.find(e => e.id === sub.eventId)?.category || "General",
      reviewDate: new Date(sub.createdAt).toLocaleDateString()
    }))
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: <ClipboardCheck className="h-5 w-5" /> },
    { id: 'assignments', label: 'Assignments', icon: <Calendar className="h-5 w-5" /> },
    { id: 'reviews', label: 'Reviews', icon: <Star className="h-5 w-5" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Award className="h-5 w-5" /> },
    { id: 'feedback', label: 'Feedback', icon: <MessageCircle className="h-5 w-5" /> },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Events Judged</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{judgeData.eventsJudged}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Projects Reviewed</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{judgeData.projectsEvaluated}</p>
            </div>
            <FileText className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Average Score</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{judgeData.averageScore}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Pending Reviews</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{judgeData.pendingReviews.length}</p>
            </div>
            <ClipboardCheck className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      {/* Judge Profile */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Judge Profile</h3>
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-[rgb(var(--color-accent))] to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-2xl">👩‍💻</span>
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{judgeData.name}</h4>
            <p className="text-gray-600 dark:text-gray-400 mb-3">Expert Judge</p>
            <div className="flex flex-wrap gap-2">
              {judgeData.expertise.map((skill, index) => (
                <span key={index} className="bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm border border-blue-500/20 dark:border-blue-500/30">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Current Assignments & Pending Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Assignments</h3>
          <div className="space-y-3">
            {judgeData.currentAssignments.map((assignment) => (
              <div key={assignment.id} className="border border-black/10 dark:border-white/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{assignment.eventName}</h4>
                  <span className="bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-1 rounded text-xs border border-green-500/20 dark:border-green-500/30">
                    {assignment.status}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  {assignment.projectsToReview} projects to review
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  Deadline: {assignment.deadline}
                </p>
                <button className="btn-primary px-4 py-2 text-sm">
                  Start Reviewing
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pending Reviews</h3>
          <div className="space-y-3">
            {judgeData.pendingReviews.map((project) => (
              <div key={project.id} className="border border-black/10 dark:border-white/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{project.projectName}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    project.priority === 'high' 
                      ? 'bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 dark:border-red-500/30'
                      : 'bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20 dark:border-yellow-500/30'
                  }`}>
                    {project.priority}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Team: {project.teamName}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Category: {project.category}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  Submitted: {project.submittedDate}
                </p>
                <div className="flex gap-2">
                  <button className="btn-primary px-3 py-2 text-sm flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>Review</span>
                  </button>
                  <button className="btn-ghost px-3 py-2 text-sm flex items-center space-x-1">
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mr-3" />
            <span className="text-gray-600 dark:text-gray-300">Completed review for "EcoTracker" project</span>
            <span className="text-gray-500 ml-auto">2h ago</span>
          </div>
          <div className="flex items-center text-sm">
            <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-3" />
            <span className="text-gray-600 dark:text-gray-300">Assigned to judge AI Innovation Challenge</span>
            <span className="text-gray-500 ml-auto">1d ago</span>
          </div>
          <div className="flex items-center text-sm">
            <MessageCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-3" />
            <span className="text-gray-600 dark:text-gray-300">Provided feedback for 3 projects</span>
            <span className="text-gray-500 ml-auto">2d ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Project Reviews</h2>
        <div className="flex gap-2">
          <select className="bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20">
            <option value="all" className="bg-gray-900">All Categories</option>
            <option value="ai" className="bg-gray-900">AI/ML</option>
            <option value="web" className="bg-gray-900">Web Development</option>
            <option value="mobile" className="bg-gray-900">Mobile Apps</option>
          </select>
        </div>
      </div>

      {/* Pending Reviews */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Pending Reviews ({judgeData.pendingReviews.length})</h3>
        <div className="grid grid-cols-1 gap-4">
          {judgeData.pendingReviews.map((project) => (
            <div key={project.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-white mb-2">{project.projectName}</h4>
                  <p className="text-gray-400 mb-1">Team: {project.teamName}</p>
                  <p className="text-gray-400 mb-1">Category: {project.category}</p>
                  <p className="text-gray-400">Submitted: {project.submittedDate}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  project.priority === 'high' 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                  {project.priority} priority
                </span>
              </div>

              {/* Review Form */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-4">
                <h5 className="text-white font-medium mb-3">Quick Review</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Innovation (1-10)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="10" 
                      className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                      placeholder="8"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Technical (1-10)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="10" 
                      className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                      placeholder="7"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Presentation (1-10)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="10" 
                      className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                      placeholder="8"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">Feedback</label>
                  <textarea 
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white h-20"
                    placeholder="Provide detailed feedback for the team..."
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>View Project</span>
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Submit Review
                </button>
                <button className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors border border-white/20 flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Reviews */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Completed Reviews</h3>
        <div className="grid grid-cols-1 gap-4">
          {judgeData.completedReviews.map((project) => (
            <div key={project.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-white">{project.projectName}</h4>
                  <p className="text-gray-400">Team: {project.teamName}</p>
                  <p className="text-gray-400 text-sm">Category: {project.category}</p>
                  <p className="text-gray-400 text-sm">Reviewed: {project.reviewDate}</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{project.score}</div>
                  <p className="text-gray-400 text-sm">Final Score</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'assignments':
        return <div className="text-white">Assignments view coming soon...</div>;
      case 'reviews':
        return renderReviews();
      case 'leaderboard':
        return <div className="text-white">Leaderboard view coming soon...</div>;
      case 'feedback':
        return <div className="text-white">Feedback management coming soon...</div>;
      default:
        return renderOverview();
    }
  };

  return (
    <DashboardLayout
      title="Judge Dashboard"
      sidebarItems={sidebarItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default JudgeDashboard;