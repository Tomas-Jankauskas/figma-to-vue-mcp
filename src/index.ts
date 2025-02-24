import express from 'express';
import dotenv from 'dotenv';
import { FigmaService } from './services/figma';
import { ComponentGenerator } from './services/component-generator';

dotenv.config();

const app = express();
app.use(express.json());

const figmaService = new FigmaService(process.env.FIGMA_ACCESS_TOKEN || '');
const componentGenerator = new ComponentGenerator();

app.post('/generate-component', async (req, res) => {
  try {
    const { figmaUrl, componentName } = req.body;

    if (!figmaUrl || !componentName) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Extract file key and node id from Figma URL
    const fileKey = figmaUrl.split('/')[4];
    const nodeId = figmaUrl.split('?')[0].split('/').pop();

    if (!fileKey || !nodeId) {
      return res.status(400).json({ error: 'Invalid Figma URL' });
    }

    // Get design data from Figma
    const designData = await figmaService.getDesignData(fileKey, nodeId);

    // Generate Vue component
    const vueComponent = componentGenerator.generateComponent(designData, componentName);

    res.json({ component: vueComponent });
  } catch (error) {
    console.error('Error generating component:', error);
    res.status(500).json({ error: 'Failed to generate component' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});