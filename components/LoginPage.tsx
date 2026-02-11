
import React, { useState } from 'react';
import { Button } from './Button';
import { db } from '../services/databaseService';
import { UserProfile } from '../types';
import { Atom, UserCircle, GraduationCap, School, Binary, User } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: 'Male',
    age: '',
    education: 'Undergraduate',
    university: '',
    fieldOfStudy: 'Science stream',
    country: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const existingUser = db.getUser();
    const newSessionCount = (existingUser?.email === formData.email) 
      ? (existingUser?.sessionCount || 0) + 1 
      : 1;

    const newUser: UserProfile = {
      id: existingUser?.id || crypto.randomUUID(),
      name: formData.name,
      email: formData.email,
      gender: formData.gender,
      age: parseInt(formData.age),
      education: formData.education,
      university: formData.university,
      fieldOfStudy: formData.fieldOfStudy,
      country: formData.country,
      loginTime: Date.now(),
      sessionCount: newSessionCount
    };

    await db.saveUser(newUser);
    onLoginSuccess();
  };

  const handleGuestLogin = async () => {
    const guestUser: UserProfile = {
      id: 'guest-' + crypto.randomUUID(),
      name: 'Guest Explorer',
      email: '',
      gender: 'N/A',
      age: 0,
      education: 'N/A',
      university: 'N/A',
      fieldOfStudy: 'N/A',
      country: 'N/A',
      loginTime: Date.now(),
      sessionCount: 1,
      learningStyle: 'Multi-Sensory',
      learningScores: { visual: 0, auditory: 0, kinesthetic: 0 }
    };
    await db.saveUser(guestUser);
    onLoginSuccess();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-space-900 flex items-center justify-center p-4 py-12">
      <div className="max-w-xl w-full bg-space-800 rounded-2xl border border-space-700 shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.5)] mx-auto mb-4">
               <Atom size={40} className="text-white animate-spin-slow" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Relativity In Motion</h1>
            <p className="text-slate-400">Complete your researcher profile to begin.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                <input 
                  required
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-space-900 border border-space-600 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                  placeholder="Albert Einstein"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                <input 
                  required
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-space-900 border border-space-600 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                  placeholder="albert@physics.edu"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Age</label>
                  <input 
                    required
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full bg-space-900 border border-space-600 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Country</label>
                  <input 
                    required
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full bg-space-900 border border-space-600 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                    placeholder="Switzerland"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Gender</label>
                <div className="flex gap-4">
                  {['Male', 'Female'].map((g) => (
                    <label key={g} className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg border cursor-pointer transition-all ${formData.gender === g ? 'bg-cyan-900/50 border-cyan-500 text-white' : 'bg-space-900 border-space-600 text-slate-500'}`}>
                      <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange} className="hidden" />
                      <User size={14} />
                      {g}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Academic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Education Level</label>
                <select 
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="w-full bg-space-900 border border-space-600 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                >
                    <option>Foundation</option>
                    <option>Undergraduate</option>
                    <option>Postgraduate</option>
                    <option>PhD</option>
                    <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">University</label>
                <div className="relative">
                  <School className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    required
                    name="university"
                    type="text"
                    value={formData.university}
                    onChange={handleChange}
                    className="w-full bg-space-900 border border-space-600 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                    placeholder="University of..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Field of Study</label>
                <div className="space-y-2">
                  <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${formData.fieldOfStudy === 'Science stream' ? 'bg-cyan-900/50 border-cyan-500 text-white' : 'bg-space-900 border-space-600 text-slate-500'}`}>
                    <input type="radio" name="fieldOfStudy" value="Science stream" checked={formData.fieldOfStudy === 'Science stream'} onChange={handleChange} className="hidden" />
                    <Binary size={18} />
                    <div className="text-xs">
                      <div className="font-bold">Science stream</div>
                      <div className="opacity-60">(eg: Physics, Biomedical Science, ...)</div>
                    </div>
                  </label>
                  <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${formData.fieldOfStudy === 'Non-Science stream' ? 'bg-purple-900/50 border-purple-500 text-white' : 'bg-space-900 border-space-600 text-slate-500'}`}>
                    <input type="radio" name="fieldOfStudy" value="Non-Science stream" checked={formData.fieldOfStudy === 'Non-Science stream'} onChange={handleChange} className="hidden" />
                    <GraduationCap size={18} />
                    <div className="text-xs">
                      <div className="font-bold">Non-Science stream</div>
                      <div className="opacity-60">(eg: Marketing, Public Relations, ...)</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full py-4 text-lg">
             Proceed to Learning Style &rarr;
          </Button>

          <button 
            type="button" 
            onClick={handleGuestLogin}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-transparent hover:bg-space-700/50 text-slate-500 rounded-lg transition-colors text-xs font-medium"
          >
            <UserCircle size={14} />
            Skip & Enter as Guest
          </button>
        </form>
      </div>
    </div>
  );
};
