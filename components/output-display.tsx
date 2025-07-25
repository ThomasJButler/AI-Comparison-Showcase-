"use client";

import { motion } from 'framer-motion';
import { Download, RefreshCw, ChevronDown } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface OutputDisplayProps {
  output: any;
  isProcessing: boolean;
  VisualisationType: 'json' | 'chart' | 'text';
}

export function OutputDisplay({
  output,
  isProcessing,
  VisualisationType,
}: OutputDisplayProps) {
  const renderVisualisation = () => {
    if (!output) return null;
    
    // Extract content from output if it's an object with content property
    const outputContent = output.content !== undefined ? output.content : 
                         output.error !== undefined ? output.error : 
                         output;

    switch (VisualisationType) {
      case 'chart':
        if (!Array.isArray(outputContent)) return null;
        return (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={outputContent}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#00ff00"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      case 'json':
        return (
          <pre className="text-sm font-mono overflow-auto">
            {typeof outputContent === 'object' 
              ? JSON.stringify(outputContent, null, 2)
              : outputContent}
          </pre>
        );
      default:
        return (
          <pre className="text-sm font-mono whitespace-pre-wrap">
            {typeof outputContent === 'object' 
              ? JSON.stringify(outputContent, null, 2)
              : String(outputContent)}
          </pre>
        );
    }
  };

  const downloadOutput = () => {
    // Extract content from output if it's an object with content property
    const outputContent = output.content !== undefined ? output.content : 
                         output.error !== undefined ? output.error : 
                         output;
    
    const data =
      VisualisationType === 'json' || typeof outputContent === 'object'
        ? JSON.stringify(outputContent, null, 2)
        : String(outputContent);
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Output</h3>
        {output && !isProcessing && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadOutput}
            className="p-2 rounded-lg bg-card border border-border hover:border-matrix-secondary/50 text-foreground/70"
          >
            <Download className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      <div className="min-h-[24rem] p-4 rounded-lg bg-card border border-border">
        {isProcessing ? (
          <div className="h-full flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-matrix-primary" />
          </div>
        ) : output ? (
          renderVisualisation()
        ) : (
          <div className="h-full flex items-center justify-center text-foreground/50">
            Output will appear here...
          </div>
        )}
      </div>
    </div>
  );
}
