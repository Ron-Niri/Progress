import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      <main className="text-center space-y-6 max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-heading font-bold text-primary tracking-tight">
          Progress.
        </h1>
        <p className="text-xl md:text-2xl text-secondary font-sans leading-relaxed max-w-2xl mx-auto">
          Your journey to peak potential starts here. Focused, clear, and consistent.
        </p>
        
        <div className="pt-10 flex flex-col sm:flex-row gap-4 justify-center">
           <Link to="/login" className="px-8 py-3.5 bg-action text-white rounded-md hover:bg-blue-600 transition-colors shadow-soft font-medium text-lg text-center">
             Go to Dashboard
           </Link>
           <button className="px-8 py-3.5 bg-white text-primary border border-gray-200 rounded-md hover:bg-surface transition-colors shadow-soft font-medium text-lg">
             Documentation
           </button>
        </div>

        {/* Example Card to show aesthetic */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
           <div className="p-6 bg-white rounded-lg shadow-soft border border-gray-100">
              <h3 className="text-lg font-semibold mb-2">Goal Management</h3>
              <p className="text-secondary">Transform abstract ambitions into actionable milestones.</p>
           </div>
           <div className="p-6 bg-white rounded-lg shadow-soft border border-gray-100">
              <h3 className="text-lg font-semibold mb-2">Habit Tracking</h3>
              <p className="text-secondary">Forge lasting habits with our intelligent streak system.</p>
           </div>
           <div className="p-6 bg-white rounded-lg shadow-soft border border-gray-100">
              <h3 className="text-lg font-semibold mb-2">Analytics</h3>
              <p className="text-secondary">Visualize your evolution with calm, clear metrics.</p>
           </div>
        </div>
      </main>
    </div>
  )
}
