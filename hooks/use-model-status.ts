"use client";

import { useState, useEffect } from 'react';

export type ModelStatus = 'online' | 'offline' | 'degraded' | 'maintenance';

interface ModelHealth {
  id: string;
  status: ModelStatus;
  latency: number;
  uptime: number;
  lastChecked: Date;
}

const mockModelStatus: Record<string, ModelHealth> = {
  'gpt-4': {
    id: 'gpt-4',
    status: 'online',
    latency: 150,
    uptime: 99.9,
    lastChecked: new Date(),
  },
  'claude-3': {
    id: 'claude-3',
    status: 'online',
    latency: 145,
    uptime: 99.8,
    lastChecked: new Date(),
  },
  'llama-3': {
    id: 'llama-3',
    status: 'online',
    latency: 120,
    uptime: 99.7,
    lastChecked: new Date(),
  },
  'dall-e-3': {
    id: 'dall-e-3',
    status: 'online',
    latency: 250,
    uptime: 99.5,
    lastChecked: new Date(),
  },
  'midjourney-v6': {
    id: 'midjourney-v6',
    status: 'online',
    latency: 280,
    uptime: 99.4,
    lastChecked: new Date(),
  },
  'stable-diffusion-3': {
    id: 'stable-diffusion-3',
    status: 'online',
    latency: 200,
    uptime: 99.6,
    lastChecked: new Date(),
  },
  'whisper-v3': {
    id: 'whisper-v3',
    status: 'online',
    latency: 90,
    uptime: 99.8,
    lastChecked: new Date(),
  },
  'palm-2': {
    id: 'palm-2',
    status: 'online',
    latency: 160,
    uptime: 99.7,
    lastChecked: new Date(),
  }
};

export function useModelStatus(modelId: string) {
  const [health, setHealth] = useState<ModelHealth | null>(null);

  useEffect(() => {
    // Initialize with mock data
    setHealth(mockModelStatus[modelId] || {
      id: modelId,
      status: 'offline',
      latency: 0,
      uptime: 0,
      lastChecked: new Date(),
    });

    // Simulate status updates
    const interval = setInterval(() => {
      setHealth((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          latency: Math.max(1, prev.latency + (Math.random() - 0.5) * 2),
          lastChecked: new Date(),
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [modelId]);

  return { health };
}