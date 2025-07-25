"use client";

import { ModelBuilderLayout } from '@/components/model-builder/layout';
import { ModelDefinitionPanel } from '@/components/model-builder/definition-panel';
import { ModelTestingPanel } from '@/components/model-builder/testing-panel';
import { ModelVisualizationPanel } from '@/components/model-builder/visualization-panel';

export default function ModelBuilderPage() {
  return (
    <ModelBuilderLayout
      leftPanel={<ModelDefinitionPanel />}
      centerPanel={<ModelTestingPanel />}
      rightPanel={<ModelVisualizationPanel />}
    />
  );
}
