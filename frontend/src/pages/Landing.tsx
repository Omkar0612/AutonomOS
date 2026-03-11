import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Sparkles, Zap, Users, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      
      {/* Header */}
      <motion.header 
        className="glass-strong sticky top-0 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div 
              className="gradient-primary p-2 rounded-xl"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-2xl font-bold gradient-text">AutonomOS</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="btn-ghost">Features</a>
            <Link to="/login" className="btn-ghost">Login</Link>
            <Link to="/signup" className="btn-primary">Get Started</Link>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <span className="status-dot active" />
              <span className="text-sm font-medium">Now in Production • v1.0.0</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
              Build AI Agents
              <br />
              <span className="gradient-text">Visually</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Design powerful autonomous AI workflows with drag-and-drop. 
              Deploy multi-agent systems in minutes, not months.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/signup" className="btn-primary text-lg px-8 py-4 glow">
                Start Building Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <a href="#features" className="btn-secondary text-lg px-8 py-4">
                See Features
              </a>
            </div>
          </motion.div>
          
          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {[
              { label: 'Workflows Created', value: '10K+' },
              { label: 'AI Models', value: '50+' },
              { label: 'Uptime', value: '99.9%' },
              { label: 'Support', value: '24/7' },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                className="glass rounded-2xl p-6"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-4xl font-black gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-black mb-4">
              Everything You Need to
              <br />
              <span className="gradient-text">Build AI Agents</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Professional tools for AI workflow automation
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'AI-Powered Agents',
                description: 'Deploy intelligent agents that work autonomously 24/7 with cutting-edge AI models.',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: Zap,
                title: 'Visual Workflow Builder',
                description: 'Drag and drop interface makes building complex workflows intuitive and fast.',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Users,
                title: 'Multi-Agent Systems',
                description: 'Coordinate teams of AI agents with hierarchical, swarm, and council patterns.',
                color: 'from-emerald-500 to-teal-500'
              },
              {
                icon: BarChart3,
                title: 'Real-time Analytics',
                description: 'Track performance, monitor executions, and optimize your AI workflows.',
                color: 'from-amber-500 to-orange-500'
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className="card gradient-card group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <div className={`bg-gradient-to-br ${feature.color} p-4 rounded-2xl inline-block mb-6 glow`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:gradient-text transition-all">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative">
        <motion.div 
          className="max-w-4xl mx-auto glass-strong rounded-3xl p-12 text-center relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20" />
          <div className="relative z-10">
            <h2 className="text-5xl font-black mb-6">
              Ready to Build the Future?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
              Join thousands of developers building autonomous AI systems
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signup" className="btn-primary text-lg px-8 py-4 glow">
                Create Free Account
                <CheckCircle2 className="w-5 h-5 ml-2" />
              </Link>
              <p className="text-sm text-slate-500">No credit card required • Free forever</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="glass-strong py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="gradient-primary p-2 rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">AutonomOS</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            © 2026 AutonomOS. Built with ♥ for AI developers.
          </p>
        </div>
      </footer>
    </div>
  )
}
