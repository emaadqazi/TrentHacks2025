import { motion } from 'framer-motion';
import { Blocks, Sparkles, FileText, Zap, Download, TrendingUp } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl shadow-2xl"
            >
              <Blocks className="w-16 h-16 text-white" />
            </motion.div>
          </div>

          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Resu<span className="text-indigo-600">Blocks</span>
          </h1>
          
          <p className="text-2xl text-gray-600 mb-8 font-medium">
            Build Your Resume Like Building with Blocks
          </p>

          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            The AI-powered resume builder that makes creating tailored resumes as intuitive as Scratch made coding. 
            Drag, drop, and optimize your way to your dream job.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert('Builder coming soon!')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-4 rounded-full text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Get Started →
          </motion.button>

          <p className="text-sm text-gray-500 mt-4">
            Free for students • No credit card required
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-24"
        >
          <FeatureCard
            icon={<Blocks className="w-8 h-8" />}
            title="Block-Based Editor"
            description="Drag and drop resume sections like building blocks. Reorder, swap, and customize with satisfying animations."
            color="from-blue-500 to-cyan-500"
          />
          <FeatureCard
            icon={<Sparkles className="w-8 h-8" />}
            title="AI-Powered Critique"
            description="Upload a job description and get instant feedback. See your match score and what to improve."
            color="from-purple-500 to-pink-500"
          />
          <FeatureCard
            icon={<FileText className="w-8 h-8" />}
            title="Smart Suggestions"
            description="Get 2-3 AI-generated alternatives for each bullet point. Drag to swap instantly."
            color="from-orange-500 to-red-500"
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Job Market Insights"
            description="Analyzed 100+ real job postings. Get personalized recommendations based on market data."
            color="from-green-500 to-teal-500"
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="Real-time Updates"
            description="See your resume score improve in real-time as you make changes. Instant visual feedback."
            color="from-yellow-500 to-orange-500"
          />
          <FeatureCard
            icon={<Download className="w-8 h-8" />}
            title="Instant PDF Export"
            description="Export to professional, ATS-friendly PDF in seconds. Multiple templates available."
            color="from-indigo-500 to-purple-500"
          />
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-24 bg-white rounded-3xl shadow-2xl p-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number="100+" label="Job Postings Analyzed" />
            <StatCard number="500+" label="AI-Optimized Bullets" />
            <StatCard number="35+" label="Avg. Score Improvement" />
            <StatCard number="<5 min" label="Resume Tailoring Time" />
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-24 text-center"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Build Your Perfect Resume?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of students landing their dream jobs
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert('Builder coming soon!')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-4 rounded-full text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Start Building Now →
          </motion.button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white mt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">Built for TrentHacks 2025</p>
            <p className="text-sm">
              By Emaad Qazi, Ahmad Yahya, and Digvijay Jondhale
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div className={`bg-gradient-to-br ${color} p-4 rounded-xl inline-block mb-4 text-white`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}

interface StatCardProps {
  number: string;
  label: string;
}

function StatCard({ number, label }: StatCardProps) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-indigo-600 mb-2">{number}</div>
      <div className="text-gray-600 text-sm">{label}</div>
    </div>
  );
}

export default App;
