"use client";

import { MessageSquare } from 'lucide-react';

export function ModelTestingPanel() {
  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Testing & Interaction</h3>
        <p className="text-sm text-foreground/70">
          Test your model and interact with it in real-time
        </p>
      </div>

      {/* Placeholder content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="rounded-lg border border-dashed border-matrix-primary/30 p-6 text-center bg-matrix-primary/5 max-w-md w-full">
          <MessageSquare className="w-8 h-8 mx-auto text-matrix-primary/50 mb-3" />
          <h4 className="text-sm font-medium mb-1">Testing Panel</h4>
          <p className="text-xs text-foreground/50">
            This panel will be implemented in TASK-1.1.3
          </p>
        </div>
      </div>
    </div>
  );
}
