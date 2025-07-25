"use client";

import { motion } from 'framer-motion';
import { X, Check, Minus, AlertTriangle } from 'lucide-react';
import type { ModelCardProps } from './model-card';

interface ModelComparisonProps {
  models: ModelCardProps[];
  onClose: () => void;
}

export function ModelComparison({ models, onClose }: ModelComparisonProps) {
  const metrics = [
    { key: 'accuracy', label: 'Accuracy', format: (v: string | number) => `${v}%` },
    { key: 'latency', label: 'Latency', format: (v: string | number) => `${v}ms` },
    { key: 'requests', label: 'Total Requests', format: (v: string | number) => `${v}` },
    { key: 'costper1k', label: 'Cost per 1K', format: (v: string | number) => `$${v}` },
    { key: 'contextLength', label: 'Context Length', format: (v: string | number) => typeof v === 'number' ? v.toLocaleString() : v },
    { key: 'dailyQuota', label: 'Daily Quota', format: (v: string | number) => typeof v === 'number' ? v.toLocaleString() : v }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="absolute -top-16 right-0">
        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-background/50 backdrop-blur-sm border border-border hover:border-matrix-primary/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {models.map((model, index) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="p-6 rounded-lg border border-border bg-card"
          >
            <div className="flex items-center gap-3 mb-6">
              <model.icon className="w-8 h-8 text-matrix-secondary" />
              <div>
                <h3 className="text-xl font-semibold">{model.title}</h3>
                <p className="text-sm text-matrix-primary">{model.provider}</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Metrics */}
              <div>
                <h4 className="text-sm font-medium mb-3">Performance Metrics</h4>
                <div className="space-y-2">
                  {metrics.map(({ key, label, format }) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-sm text-foreground/70">{label}</span>
                      <span className="font-mono text-sm">
                        {format(model.metrics[key as keyof typeof model.metrics])}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Capabilities */}
              <div>
                <h4 className="text-sm font-medium mb-3">Capabilities</h4>
                <div className="space-y-2">
                  {(model.capabilities ?? []).map((capability) => (
                    <div key={capability} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-matrix-primary" />
                      <span className="text-sm">{capability}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best For */}
              <div>
                <h4 className="text-sm font-medium mb-3">Best Use Cases</h4>
                <div className="space-y-2">
                  {(model.bestFor ?? []).map((useCase) => (
                    <div key={useCase} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-matrix-secondary" />
                      <span className="text-sm">{useCase}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Limitations */}
              <div>
                <h4 className="text-sm font-medium mb-3">Limitations</h4>
                <div className="space-y-2">
                  {(model.limitations ?? []).map((limitation) => (
                    <div key={limitation} className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-matrix-tertiary" />
                      <span className="text-sm">{limitation}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}