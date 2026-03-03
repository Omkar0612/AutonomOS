import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Download, Star, TrendingUp, Shield } from 'lucide-react';
import axios from 'axios';

interface Skill {
  id: number;
  name: string;
  description: string;
  author_name: string;
  category: string;
  tags: string[];
  downloads: number;
  rating: number;
  review_count: number;
  verified: boolean;
  icon?: string;
}

export function Home() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [featured, setFeatured] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkills();
    loadFeatured();
    loadCategories();
  }, [selectedCategory]);

  const loadSkills = async () => {
    try {
      const params = selectedCategory ? { category: selectedCategory } : {};
      const response = await axios.get('http://localhost:8001/skills', { params });
      setSkills(response.data);
    } catch (error) {
      console.error('Error loading skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFeatured = async () => {
    try {
      const response = await axios.get('http://localhost:8001/featured');
      setFeatured(response.data);
    } catch (error) {
      console.error('Error loading featured:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8001/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await axios.get('http://localhost:8001/search', {
        params: { q: searchQuery }
      });
      setSkills(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Discover Skills for Your AI Agents
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Browse thousands of community-built skills to extend AutonomOS
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Featured Skills */}
      {featured.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-600" />
            Featured Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              !selectedCategory
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === cat.name
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      )}
    </div>
  );
}

function SkillCard({ skill }: { skill: Skill }) {
  return (
    <Link
      to={`/skill/${skill.name}`}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{skill.icon || '📦'}</span>
          <div>
            <h3 className="font-semibold text-lg">{skill.name}</h3>
            <p className="text-sm text-gray-600">by {skill.author_name}</p>
          </div>
        </div>
        {skill.verified && (
          <Shield className="w-5 h-5 text-blue-500" title="Verified" />
        )}
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {skill.description}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {skill.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            {skill.downloads.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {skill.rating.toFixed(1)}
          </span>
        </div>
        <span className="text-purple-600 font-medium">Install →</span>
      </div>
    </Link>
  );
}
