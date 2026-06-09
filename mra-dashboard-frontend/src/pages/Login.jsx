import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, ChevronRight } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('ceo@mragroup.co.id')
  const [password, setPassword] = useState('••••••••')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => navigate('/'), 800)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans antialiased text-slate-800">
      
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20 border-r border-slate-900 relative overflow-hidden">
        {/* Subtle glow lights */}
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-12 right-12 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-orange-500/20">M</div>
          <div>
            <div className="text-white font-extrabold text-sm tracking-wide">MRA Group</div>
            <div className="text-amber-400 text-[9px] font-bold uppercase tracking-widest mt-0.5">Executive Dashboard</div>
          </div>
        </div>

        <div className="relative z-10">
          <h2 className="text-5xl font-black text-white mb-6 leading-tight tracking-tight">
            Centralized<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Executive</span><br />
            Intelligence
          </h2>
          <p className="text-slate-450 text-slate-400 max-w-sm text-sm font-medium leading-relaxed">
            Real-time analytics and monitoring across all MRA Holding business units — F&B, Retail, and Media in one consolidated view.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { label: 'Business Units', value: '11' },
              { label: 'Revenue (YTD)', value: 'IDR 1.7T' },
              { label: 'Headcount', value: '1,248' },
            ].map(s => (
              <div key={s.label} className="bg-slate-900/40 rounded-2xl p-4 border border-slate-800/80 backdrop-blur-sm">
                <div className="text-2xl font-black text-amber-400 tracking-tight">{s.value}</div>
                <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        <p className="text-slate-600 text-xs font-semibold relative z-10">© 2026 MRA Holding Group. Strictly Confidential.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 lg:max-w-md flex items-center justify-center p-8 bg-white/95 backdrop-blur-md">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black text-sm">M</div>
            <span className="font-extrabold text-slate-800 text-sm tracking-tight">MRA Group</span>
          </div>

          <h3 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">Welcome back</h3>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-8">Access Executive Dashboard</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100/40 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:bg-white focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100/40 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:bg-white focus:border-transparent transition-all"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-450 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-bold">
              <label className="flex items-center gap-2 text-slate-500 cursor-pointer select-none">
                <input type="checkbox" className="rounded-md accent-amber-450 h-3.5 w-3.5 border-slate-200" defaultChecked /> Remember me
              </label>
              <a href="#" className="text-amber-600 hover:underline">Forgot password?</a>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black rounded-xl text-xs uppercase tracking-widest transition-all duration-300 shadow-md shadow-orange-500/10 hover:shadow-lg hover:shadow-orange-500/15 disabled:opacity-75 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <ChevronRight size={13} />}
            </button>
          </form>

          <div className="mt-8 p-4 bg-slate-50/70 border border-slate-150 border-slate-100 rounded-2xl">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2.5">Available Demo Accounts:</p>
            {[
              ['CEO/COO/CFO', 'ceo@mragroup.co.id', 'Full Access'],
              ['Finance Team', 'finance@mragroup.co.id', 'Financial Module'],
              ['HR Team', 'hr@mragroup.co.id', 'HR Module'],
            ].map(([role, email, access]) => (
              <div key={role} className="flex items-center justify-between py-1 text-xs">
                <span className="font-bold text-slate-600">{role}</span>
                <span className="text-slate-450 text-[10px] text-slate-400 font-bold uppercase">{access}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
