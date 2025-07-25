"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { generateSystemMetrics } from '@/lib/data';

export default function RealTimeMetrics() {
  const [data, setData] = useState<Array<any>>([]);

  useEffect(() => {
    // Initialize with some data
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (19 - i) * 1000).toISOString(),
      ...generateSystemMetrics()
    }));

    setData(initialData);

    // Update data every second
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData.slice(1), {
          time: new Date().toISOString(),
          ...generateSystemMetrics()
        }];
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[400px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="time"
            stroke="#666"
            tickFormatter={(value) => new Date(value).toLocaleTimeString()}
          />
          <YAxis
            stroke="#666"
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '8px',
            }}
            labelFormatter={(value) => new Date(value).toLocaleTimeString()}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="cpu"
            name="CPU Usage"
            stroke="#00ff00"
            dot={false}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="memory"
            name="Memory Usage"
            stroke="#00ffff"
            dot={false}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="network"
            name="Network Usage"
            stroke="#ff00ff"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}