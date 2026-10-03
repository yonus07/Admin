import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { MslLogo } from '../common/MslLogo';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Trophy, 
  Users, 
  Star, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, showToast } = useTournament();

  const [email, setEmail] = useState('admin@mslcricket.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('error', 'Login Required', 'Please enter email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login(email, rememberMe);
      showToast('success', 'Welcome Back!', 'Logged into MIELLA SUPER LEAGUE Admin Portal.');
      setIsLoading(false);
    }, 400);
  };

  const handleQuickDemoLogin = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('admin123');
    setIsLoading(true);
    setTimeout(() => {
      login(roleEmail, true);
      showToast('success', 'Logged In as Administrator', 'Welcome to MSL Tournament Control.');
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F8FAFC] font-sans select-none relative overflow-hidden">
      {/* LEFT SIDE: Stadium Floodlights, Pitch, Cricket Bat & Ball Hero Section */}
      <div className="lg:w-[54%] relative bg-black flex flex-col justify-between p-8 sm:p-12 lg:p-16 text-white min-h-[480px] lg:min-h-screen overflow-hidden">
        {/* Background Image Layer: Stadium & Cricket Pitch */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-60 scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1600&auto=format&fit=crop&q=80')`
          }}
        />

        {/* Dark Vignette & Color Gradients */}
        <div className="absolute inset-0 z-1 bg-gradient-to-t from-black via-black/70 to-black/40" />
        <div className="absolute inset-0 z-1 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

        {/* Dynamic Curved Gold Divider Accent (Matching Reference Image) */}
        <div className="hidden lg:block absolute -right-20 top-0 bottom-0 w-40 z-10 pointer-events-none">
          <svg viewBox="0 0 100 800" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M0 0 Q 80 400 0 800 L 100 800 L 100 0 Z"
              fill="#F8FAFC"
            />
            <path
              d="M0 0 Q 80 400 0 800"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="5"
            />
          </svg>
        </div>

        {/* Top Header Branding on Left Banner */}
        <div className="relative z-10 space-y-4">
          <MslLogo
            size="lg"
            showText={true}
            textColor="light"
            subtitle="PLAYER REGISTRATION"
          />

          {/* Slogan */}
          <div className="pt-2 text-xs sm:text-sm font-semibold tracking-wider text-gray-300 flex items-center gap-3">
            <span>Your Game</span>
            <span className="text-[#F59E0B]">•</span>
            <span>Our League</span>
            <span className="text-[#F59E0B]">•</span>
            <span>A Bigger Tomorrow</span>
          </div>
        </div>

        {/* Middle/Bottom Visual: Cricket Pitch Vibe & 3 Pillar Badges */}
        <div className="relative z-10 space-y-8 my-auto pt-8">
          {/* 3 Pillars Row from screenshot */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-white/10 max-w-lg">
            {/* Pillar 1 */}
            <div className="flex flex-col items-center text-center space-y-2 group">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#F59E0B] shadow-lg group-hover:scale-110 transition">
                <Trophy className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-gray-200 leading-snug">
                Player<br />Registration
              </span>
            </div>

            {/* Pillar 2 */}
            <div className="flex flex-col items-center text-center space-y-2 border-x border-white/10 px-2 group">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#F59E0B] shadow-lg group-hover:scale-110 transition">
                <Users className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-gray-200 leading-snug">
                Build<br />Your Team
              </span>
            </div>

            {/* Pillar 3 */}
            <div className="flex flex-col items-center text-center space-y-2 group">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#F59E0B] shadow-lg group-hover:scale-110 transition">
                <Star className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-gray-200 leading-snug">
                Be Part<br />of MSL
              </span>
            </div>
          </div>
        </div>

        {/* Footer Tagline */}
        <div className="relative z-10 text-[11px] text-gray-400 font-medium">
          Official Tournament Portal • Powered by Valgrow Labs
        </div>
      </div>

      {/* RIGHT SIDE: Clean White Admin Login Card */}
      <div className="lg:w-[46%] flex items-center justify-center p-6 sm:p-12 lg:p-16 relative z-20">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 space-y-7">
          {/* Card Top Logo */}
          <div className="flex items-center justify-center">
            <MslLogo
              size="md"
              showText={true}
              textColor="dark"
              subtitle="PLAYER REGISTRATION"
            />
          </div>

          {/* Heading */}
          <div className="text-center space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-950 font-sans">
              Admin Login
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Sign in to access the admin dashboard and manage the tournament.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#F0F4F8] border-0 text-sm font-semibold text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:bg-white focus:ring-2 focus:ring-[#F59E0B] focus:outline-none transition"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-[#F0F4F8] border-0 text-sm font-semibold text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:bg-white focus:ring-2 focus:ring-[#F59E0B] focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#F59E0B] focus:ring-[#F59E0B] border-gray-300 accent-[#F59E0B] cursor-pointer"
                />
                <span className="font-semibold text-gray-700">Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setForgotPasswordModal(true);
                }}
                className="font-bold text-[#F59E0B] hover:text-[#D97706] transition"
              >
                Forgot password?
              </button>
            </div>

            {/* Primary Login Button (Gold with Arrow) */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-[#F59E0B] hover:bg-[#EAB308] text-gray-950 font-black text-sm tracking-wide shadow-md hover:shadow-lg transition transform active:scale-98 flex items-center justify-center gap-2 mt-2"
            >
              <span>{isLoading ? 'Signing In...' : 'Login'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </form>

          {/* OR Divider */}
          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <span className="relative bg-white px-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              OR
            </span>
          </div>

          {/* Security Badge Pill from Reference */}
          <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-gray-200/80 flex items-center justify-center gap-2 text-xs font-semibold text-gray-600">
            <ShieldCheck className="w-4 h-4 text-gray-400" />
            <span>Authorized administrators only</span>
          </div>

          {/* Quick Role Login Preset Helper */}
          <div className="pt-2 text-center">
            <p className="text-[11px] text-gray-400 mb-2">Quick Role Login:</p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin@tournament.com')}
                className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[11px] font-bold text-gray-700 transition"
              >
                Admin (Full Access)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('scorer@tournament.com')}
                className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[11px] font-bold text-gray-700 transition"
              >
                Scorer Console
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-modal border border-gray-100 space-y-4">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black uppercase text-gray-950">Password Recovery</h3>
              <p className="text-xs text-gray-500">Enter your registered email address to receive reset instructions.</p>
            </div>
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="Email address"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold focus:ring-2 focus:ring-[#F59E0B] focus:outline-none"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setForgotPasswordModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('success', 'Reset Link Sent', `Password recovery link sent to ${resetEmail || email}.`);
                  setForgotPasswordModal(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-black uppercase bg-[#F59E0B] text-black shadow-xs"
              >
                Send Reset Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
