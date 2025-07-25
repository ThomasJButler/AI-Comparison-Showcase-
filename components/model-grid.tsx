"use client";

import { motion } from 'framer-motion';
import { Search, Scale } from 'lucide-react';
import { ModelCard, type ModelCardProps } from './model-card';

interface ModelGridProps {
  models: ModelCardProps[];
  onCompare: (modelId: string) => void;
}

export function ModelGrid({ models, onCompare }: ModelGridProps) {
  if (models.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <Search className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No models found</h3>
        <p className="text-foreground/50">
          Try adjusting your search or filter criteria
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {models.map((model, index) => (
        <motion.div
          key={model.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative group"
        >
          <ModelCard {...model} />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCompare(model.id)}
            className="absolute top-4 right-4 p-2 rounded-lg bg-background/50 backdrop-blur-sm border border-border hover:border-matrix-primary/50 opacity-0 group-hover:opacity-100 transition-all"
          >
            <Scale className="w-4 h-4" />
          </motion.button>
        </motion.div>
      ))}
    </div>
  );
}