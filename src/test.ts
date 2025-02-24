import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function testComponentGeneration() {
  try {
    // Test data using your existing Figma file
    const testData = {
      figmaUrl: `https://www.figma.com/file/${process.env.FIGMA_FILE_ID}?node-id=${process.env.FIGMA_NODE_ID}`,
      componentName: 'YoutubeLinks'
    };

    // Make request to local MCP server
    const response = await axios.post('http://localhost:3002/generate-component', testData);
    
    // Save the generated component to a file for comparison
    const outputDir = path.join(__dirname, '../test-output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const outputPath = path.join(outputDir, 'GeneratedYoutubeLinks.vue');
    fs.writeFileSync(outputPath, response.data.component);

    console.log('Test completed successfully!');
    console.log('Generated component saved to:', outputPath);
    console.log('\nComponent preview:');
    console.log('----------------------------------------');
    console.log(response.data.component.slice(0, 500) + '...');
    console.log('----------------------------------------');

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testComponentGeneration();