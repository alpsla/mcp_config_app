import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Header from '../common/Header';
import Footer from '../common/Footer';
import ServiceCard from './ServiceCard';
import PricingTier from './PricingTier';
import ModelCard from './ModelCard';
import ExampleShowcase from './ExampleShowcase';
import TestimonialCard from './TestimonialCard';
import EmptyState from './EmptyState';
import ComingSoon from './ComingSoon';

// Import assets
import santaBeachImage from '../../assets/images/Santa.webp';
import holidayBeachMusic from '../../assets/audio/tropical-christma.wav';

const EnhancedDashboard = () => {
  // State for active example in the showcase
  const [activeExample, setActiveExample] = useState('santa-beach');
  // State for configurations (currently empty)
  const [configurations, setConfigurations] = useState([]);
  
  // Load the dashboard script when component mounts
  useEffect(() => {
    // Import the script
    import('../../scripts/dashboard.js');
  }, []);

  // Available services data
  const services = [
    {
      id: 'filesystem',
      title: 'File System Integration',
      icon: 'folder',
      description: 'Securely access local files for your AI assistant',
      bulletPoints: [
        'Secure local file access',
        'Desktop integration',
        'Directory selection'
      ],
      compatibility: 'Desktop Only'
    },
    {
      id: 'websearch',
      title: 'Web Search',
      icon: 'search',
      description: 'Enable web search capabilities for your AI assistant',
      bulletPoints: [
        'Real-time information',
        'Customizable search parameters',
        'Safe search options'
      ],
      compatibility: 'All Platforms'
    }
  ];
  
  // Pricing plans data
  const pricingPlans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      features: [
        'Web Search integration',
        'File System access',
        'Basic configurations'
      ],
      highlight: false,
      badge: null
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 2,
      features: [
        'Everything in Free',
        '3 premium models',
        'Configuration sharing'
      ],
      highlight: false,
      badge: 'Beta Price'
    },
    {
      id: 'complete',
      name: 'Complete',
      price: 5,
      features: [
        'Everything in Basic',
        '10 premium models',
        'Advanced configurations',
        'Priority support'
      ],
      highlight: true,
      badge: 'Most Popular'
    }
  ];
  
  // Premium models data
  const premiumModels = [
    {
      id: 'flux1-dev',
      name: 'Flux.1-dev-infer',
      category: 'Image Generation',
      description: 'Create stunning images from text descriptions',
      premium: true
    },
    {
      id: 'whisper-large',
      name: 'Whisper-large-v3-turbo',
      category: 'Audio Transcription',
      description: 'Transcribe audio to text with high accuracy',
      premium: true
    },
    {
      id: 'qwen2-72b',
      name: 'Qwen2-72B-Instruct',
      category: 'Language Model',
      description: 'Advanced language model for complex tasks',
      premium: true
    }
  ];
  
  // Examples for showcase
  const examples = [
    {
      id: 'santa-beach',
      title: 'Santa on the Beach',
      model: 'Flux.1-dev-infer',
      prompt: 'Santa Claus relaxing on a tropical beach, wearing sunglasses and shorts, photorealistic style',
      assetPath: santaBeachImage,
      type: 'image'
    },
    {
      id: 'holiday-music