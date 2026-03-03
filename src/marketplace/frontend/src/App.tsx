import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { SkillDetail } from './pages/SkillDetail';
import { MySkills } from './pages/MySkills';
import { PublishSkill } from './pages/PublishSkill';
import { Package, Search, User, Plus } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link to="/" className="flex items-center space-x-2">
                  <Package className="w-8 h-8 text-purple-600" />
                  <span className="text-xl font-bold">Skills Marketplace</span>
                </Link>
                
                <Link to="/" className="text-gray-600 hover:text-gray-900">
                  Browse
                </Link>
                <Link to="/my-skills" className="text-gray-600 hover:text-gray-900">
                  My Skills
                </Link>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link
                  to="/publish"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Publish Skill
                </Link>
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <User className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/skill/:skillName" element={<SkillDetail />} />
          <Route path="/my-skills" element={<MySkills />} />
          <Route path="/publish" element={<PublishSkill />} />
        </Routes>
        
        <ToastContainer position="bottom-right" />
      </div>
    </BrowserRouter>
  );
}
