import axios from 'axios';

export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  style?: {
    [key: string]: any;
  };
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  fills?: any[];
  strokes?: any[];
  effects?: any[];
  characters?: string;
}

export class FigmaService {
  private readonly baseUrl = 'https://api.figma.com/v1';
  private readonly headers: { [key: string]: string };

  constructor(private readonly accessToken: string) {
    this.headers = {
      'X-Figma-Token': accessToken,
    };
  }

  async getDesignData(fileKey: string, nodeId: string): Promise<FigmaNode> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/files/${fileKey}/nodes?ids=${nodeId}`,
        { headers: this.headers }
      );

      const nodes = response.data.nodes[nodeId];
      if (!nodes || !nodes.document) {
        throw new Error('Node not found');
      }

      return this.processNode(nodes.document);
    } catch (error) {
      console.error('Error fetching Figma design data:', error);
      throw error;
    }
  }

  private processNode(node: FigmaNode): FigmaNode {
    // Process styles and properties
    const processedNode: FigmaNode = {
      id: node.id,
      name: node.name,
      type: node.type,
      style: node.style,
      absoluteBoundingBox: node.absoluteBoundingBox,
      fills: node.fills,
      strokes: node.strokes,
      effects: node.effects,
      characters: node.characters,
    };

    // Process children recursively
    if (node.children) {
      processedNode.children = node.children.map(child => this.processNode(child));
    }

    return processedNode;
  }

  async getImageAssets(fileKey: string, nodeIds: string[]): Promise<{ [key: string]: string }> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/images/${fileKey}?ids=${nodeIds.join(',')}&format=svg`,
        { headers: this.headers }
      );

      return response.data.images || {};
    } catch (error) {
      console.error('Error fetching image assets:', error);
      throw error;
    }
  }
}