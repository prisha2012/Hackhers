import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Trophy, Zap, ArrowRight, Star, Globe, Clock } from 'lucide-react';

const Landing: React.FC = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: "AI Innovation Challenge 2025",
      date: "Feb 15-17, 2025",
      participants: 250,
      prizes: "$50,000",
      image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      id: 2,
      title: "Green Tech Hackathon",
      date: "Mar 8-10, 2025",
      participants: 180,
      prizes: "$25,000",
      image: "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      id: 3,
      title: "FinTech Revolution",
      date: "Mar 22-24, 2025",
      participants: 320,
      prizes: "$75,000",
      image: "https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=400"
    }
  ];

  const sponsors = [
    { name: "TechCorp", logo: "🏢" },
    { name: "InnovateLabs", logo: "🚀" },
    { name: "FutureTech", logo: "⚡" },
    { name: "CodeMasters", logo: "💻" },
  ];

  const features = [
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Event Management",
      description: "Create and manage hackathons with ease. Configure themes, tracks, rules, and prizes."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Team Collaboration",
      description: "Form teams, invite members, and collaborate seamlessly throughout the event."
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Project Evaluation",
      description: "Submit projects and get evaluated by expert judges with detailed feedback."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Real-time Updates",
      description: "Stay updated with announcements, notifications, and live leaderboards."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[rgb(var(--color-accent))]/10 dark:bg-gradient-to-r dark:from-blue-600/20 dark:to-purple-600/20"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Host Amazing
              <span className="bg-[rgb(var(--color-accent))] bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-blue-400 dark:to-purple-400"> Hackathons</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Empower innovation with our comprehensive platform. Create, participate, and judge hackathons 
              with cutting-edge tools designed for the future of collaborative development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/events"
                className="btn-primary px-8 py-4 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Join Event</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/create-event"
                className="btn-ghost px-8 py-4 flex items-center justify-center space-x-2"
              >
                <span>Host Event</span>
                <Zap className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              From event creation to project evaluation, we've got you covered
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card card-hover p-6"
              >
                <div className="text-[rgb(var(--color-accent))] dark:text-blue-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Upcoming Events
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Join the most exciting hackathons and innovation challenges
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="card overflow-hidden hover:transform hover:scale-105 transition-all duration-200"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{event.title}</h3>
                  <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{event.participants} participants</span>
                    </div>
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 mr-1" />
                      <span>{event.prizes}</span>
                    </div>
                  </div>
                  <Link
                    to={`/events/${event.id}`}
                    className="w-full btn-primary py-2 px-4 font-medium text-center block"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="card p-8">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">10,000+</div>
              <div className="text-gray-600 dark:text-gray-300">Participants</div>
            </div>
            <div className="card p-8">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-300">Events Hosted</div>
            </div>
            <div className="card p-8">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">$2M+</div>
              <div className="text-gray-600 dark:text-gray-300">Prize Money</div>
            </div>
            <div className="card p-8">
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-300">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Join hundreds of companies sponsoring innovation
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {sponsors.map((sponsor, index) => (
              <div
                key={index}
                className="card card-hover p-8 text-center"
              >
                <div className="text-4xl mb-4">{sponsor.logo}</div>
                <div className="text-gray-900 dark:text-white font-semibold">{sponsor.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Ready to Start Your Innovation Journey?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Whether you're looking to participate in exciting challenges or host your own event,
            HackHub provides everything you need to succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="btn-primary px-8 py-4 font-semibold shadow-lg hover:shadow-xl"
            >
              Get Started Now
            </Link>
            <Link
              to="/events"
              className="btn-ghost px-8 py-4 font-semibold"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;