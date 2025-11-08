// contexts/PropertyContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MOCK_PROPERTY_DATA } from '@/data/mockData';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface Property {
  id: string;
  coordinates: { latitude: number; longitude: number }[];
  tasks: Task[];
}

interface PropertyContextType {
  property: Property;
  toggleTask: (taskId: number) => void;
  userScore: number;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [property, setProperty] = useState<Property>(MOCK_PROPERTY_DATA);
  
  const toggleTask = (taskId: number) => {
    setProperty(prevProperty => ({
      ...prevProperty,
      tasks: prevProperty.tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  const userScore = property.tasks.filter(task => task.completed).length;

  return (
    <PropertyContext.Provider value={{ property, toggleTask, userScore }}>
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperty() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
}
