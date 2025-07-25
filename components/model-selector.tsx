"use client";

import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface Model {
  id: string;
  name: string;
  description: string;
  icon: typeof LucideIcon;
}

interface ModelSelectorProps {
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  models: Model[];
}

export function ModelSelector({ selectedModel, onSelectModel, models }: ModelSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {models.map((model) => {
        const Icon = model.icon;
        const isSelected = model.id === selectedModel;
        
        return (
          <button
            key={model.id}
            onClick={() => onSelectModel(model.id)}
            className={`p-4 rounded-lg border ${
              isSelected
                ? 'border-matrix-primary bg-matrix-primary/10'
                : 'border-border bg-card hover:border-matrix-primary/50'
            } transition-colors text-left`}
          >
            <Icon className={`w-6 h-6 mb-2 ${
              isSelected ? 'text-matrix-primary' : 'text-foreground/70'
            }`} />
            <h3 className="font-semibold mb-1">{model.name}</h3>
            <p className="text-sm text-foreground/70">{model.description}</p>
          </button>
        );
      })}
    </div>
  );
}