import React, { createContext, useContext, useState, useEffect } from 'react';
import { Testimonial } from '../types';
import { INITIAL_TESTIMONIALS } from '../constants';

interface TestimonialContextType {
  testimonials: Testimonial[];
  addTestimonial: (testimonial: Omit<Testimonial, 'id' | 'date'>) => void;
}

const TestimonialContext = createContext<TestimonialContextType | undefined>(undefined);

export const TestimonialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('testimonials');
    return saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
  });

  useEffect(() => {
    localStorage.setItem('testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  const addTestimonial = (data: Omit<Testimonial, 'id' | 'date'>) => {
    const newTestimonial: Testimonial = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      isFeatured: false // New submissions are not featured by default
    };
    setTestimonials(prev => [newTestimonial, ...prev]);
  };

  return (
    <TestimonialContext.Provider value={{ testimonials, addTestimonial }}>
      {children}
    </TestimonialContext.Provider>
  );
};

export const useTestimonials = () => {
  const context = useContext(TestimonialContext);
  if (!context) throw new Error('useTestimonials must be used within a TestimonialProvider');
  return context;
};
