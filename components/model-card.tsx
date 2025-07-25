"use client";

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ModelStatusBadge } from './model-status-badge';

export interface ModelMetrics {
  accuracy: number;
  latency: number;
  requests: string;
  costper1k: number; 
  contextLength: number;
  dailyQuota: number;
}

export interface ModelCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: string;
  provider: string;
  metrics: ModelMetrics;
  capabilities?: string[];
  bestFor?: string[];
  limitations?: string[];
}

export function ModelCard({
  id,
  title,
  description,
  icon: Icon,
  category,
  provider,
  metrics,
  capabilities = []
}: ModelCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 rounded-lg border border-border bg-card hover:border-matrix-secondary/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon className="w-8 h-8 text-matrix-secondary" />
          <div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-sm text-matrix-primary">{provider}</p>
          </div>
        </div>
        <ModelStatusBadge modelId={id} />
      </div>

      <p className="text-sm text-foreground/70 mb-6">{description}</p>

      <div className="grid grid-cols-3 gap-4 text-sm mb-6">
        <div>
          <p className="text-foreground/50">Accuracy</p>
          <p className="font-semibold text-matrix-primary">{metrics.accuracy}%</p>
        </div>
        <div>
          <p className="text-foreground/50">Latency</p>
          <p className="font-semibold text-matrix-secondary">{metrics.latency}ms</p>
        </div>
        <div>
          <p className="text-foreground/50">Requests</p>
          <p className="font-semibold text-matrix-tertiary">{metrics.requests}</p>
        </div>
      </div>

      {capabilities.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">Capabilities</p>
          <div className="flex flex-wrap gap-2">
            {capabilities.map((capability) => (
              <span
                key={capability}
                className="px-2 py-1 text-xs rounded-full bg-matrix-primary/10 text-matrix-primary"
              >
                {capability}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}