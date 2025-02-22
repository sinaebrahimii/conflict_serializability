import Graph from "react-vis-graph-wrapper";
import { Options } from "react-vis-graph-wrapper";
type GraphProp = {
  nodes: { id: number | string; label: string }[];
  edges: { from: string | number; to: string | number }[];
};

const GraphComponent = ({ graph }: { graph: GraphProp }) => {
  const options: Options = {
    layout: { hierarchical: false },
    edges: { color: "yellow" },
    nodes: {
      shape: "dot",
      size: 20,
      color: "pink",
      font: {
        color: "#ffffff", // White text color
        size: 16, // Adjust font size if needed
      },
    },
    physics: {
      enabled: true,
    },
    interaction: {
      zoomView: false, // Disable zooming with scroll
      dragView: true, // Allow panning by dragging
    },
  };

  // Define types for event data
  type GraphEvent = {
    nodes: number[]; // Array of selected node IDs
    edges: number[]; // Array of selected edge IDs
  };

  const events: Record<string, (event: GraphEvent) => void> = {
    select: ({ nodes, edges }) => {
      console.log("Selected nodes:", nodes);
      console.log("Selected edges:", edges);
    },
  };

  return (
    <Graph
      graph={graph}
      options={options}
      events={events}
      style={{ height: "500px" }}
    />
  );
};

export default GraphComponent;
