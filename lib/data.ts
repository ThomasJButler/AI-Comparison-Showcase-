// Define types for the objects
type NodeItem = {
  id: string;
  group: number;
  value: number;
};

type LinkItem = {
  source: string;
  target: string;
  value: number;
};

type NeuralNode = {
  id: number;
  x: number;
  y: number;
  layer: number;
};

type NeuralEdge = {
  source: number;
  target: number;
  weight: number;
};

// Utility functions for generating realistic fake data
export function generateTimeSeriesData(points = 24) {
  const data = [];
  const now = Date.now();
  const hour = 3600000; // 1 hour in milliseconds

  for (let i = 0; i < points; i++) {
    data.push({
      timestamp: new Date(now - (points - 1 - i) * hour).toISOString(),
      value1: Math.floor(Math.random() * 1000) + 500, // Base load
      value2: Math.floor(Math.random() * 800) + 300,  // API calls
      value3: Math.floor(Math.random() * 600) + 200,  // Active users
    });
  }
  return data;
}

export function generateSystemMetrics() {
  return {
    cpu: Math.random() * 100,
    memory: Math.random() * 100,
    network: Math.random() * 100,
    disk: Math.random() * 100,
  };
}

export function generateNetworkData(nodes = 20, density = 0.3) {
  const data = {
    nodes: [] as NodeItem[],
    links: [] as LinkItem[]
  };

  // Generate nodes
  for (let i = 0; i < nodes; i++) {
    data.nodes.push({
      id: `node-${i}`,
      group: Math.floor(Math.random() * 3),
      value: Math.random() * 100
    });
  }

  // Generate links with specified density
  for (let i = 0; i < nodes; i++) {
    const numConnections = Math.floor(Math.random() * (nodes * density));
    for (let j = 0; j < numConnections; j++) {
      const target = Math.floor(Math.random() * nodes);
      if (target !== i) {
        data.links.push({
          source: `node-${i}`,
          target: `node-${target}`,
          value: Math.random()
        });
      }
    }
  }

  return data;
}

export function generatePrivacyData() {
  const sensitiveTypes = [
    'SSN', 'Credit Card', 'Email', 'Phone', 'Address',
    'Password', 'API Key', 'Token', 'Private Key'
  ];

  return Array.from({ length: 10 }, (_, i) => ({
    id: `data-${i}`,
    type: Math.random() > 0.7 ? 'sensitive' : Math.random() > 0.5 ? 'warning' : 'clean',
    value: Math.random() > 0.7 
      ? '********' 
      : `Sample data point ${i}`,
    reason: Math.random() > 0.7 
      ? `${sensitiveTypes[Math.floor(Math.random() * sensitiveTypes.length)]} detected`
      : undefined
  }));
}

export function generateNeuralNetworkData() {
  const layers = [4, 6, 6, 3];
  const data = {
    nodes: [] as NeuralNode[],
    connections: [] as NeuralEdge[]
  };

  let nodeId = 0;
  layers.forEach((size, layerIndex) => {
    const layerX = (layerIndex + 1) * (1 / (layers.length + 1));
    
    for (let i = 0; i < size; i++) {
      const layerY = (i + 1) * (1 / (size + 1));
      data.nodes.push({
        id: nodeId,
        x: layerX,
        y: layerY,
        layer: layerIndex
      });

      // Connect to previous layer
      if (layerIndex > 0) {
        const prevLayerSize = layers[layerIndex - 1];
        for (let j = nodeId - prevLayerSize; j < nodeId; j++) {
          if (j >= 0) {
            data.connections.push({
              source: j,
              target: nodeId,
              weight: Math.random()
            });
          }
        }
      }
      nodeId++;
    }
  });

  return data;
}

export function generateDataFlowMetrics() {
  return {
    throughput: Math.floor(Math.random() * 1000) + 500,
    latency: Math.floor(Math.random() * 100) + 10,
    errorRate: Math.random() * 2,
    successRate: 98 + Math.random() * 2
  };
}