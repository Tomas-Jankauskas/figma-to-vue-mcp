import { FigmaNode } from './figma';

export class ComponentGenerator {
  generateComponent(designData: FigmaNode, componentName: string): string {
    const template = this.generateTemplate(designData);
    const script = this.generateScript(designData, componentName);
    const style = this.generateStyle(designData);

    return `<template>
${template}
</template>

<script setup lang="ts">
${script}
</script>

<style lang="scss" scoped>
${style}
</style>`;
  }

  private generateTemplate(node: FigmaNode): string {
    let template = '';

    // Convert Figma node to Vue template
    switch (node.type) {
      case 'FRAME':
      case 'GROUP':
        template = this.generateContainerElement(node);
        break;
      case 'TEXT':
        template = this.generateTextElement(node);
        break;
      case 'RECTANGLE':
      case 'VECTOR':
        template = this.generateShapeElement(node);
        break;
      default:
        template = this.generateDefaultElement(node);
    }

    return template;
  }

  private generateContainerElement(node: FigmaNode): string {
    const className = this.generateClassName(node.name);
    let template = `<div class="${className}">`;

    if (node.children) {
      node.children.forEach(child => {
        template += '\n  ' + this.generateTemplate(child).split('\n').join('\n  ');
      });
    }

    template += '\n</div>';
    return template;
  }

  private generateTextElement(node: FigmaNode): string {
    const className = this.generateClassName(node.name);
    const text = node.characters || '';
    return `<span class="${className}">${text}</span>`;
  }

  private generateShapeElement(node: FigmaNode): string {
    const className = this.generateClassName(node.name);
    return `<div class="${className}"></div>`;
  }

  private generateDefaultElement(node: FigmaNode): string {
    const className = this.generateClassName(node.name);
    return `<div class="${className}"></div>`;
  }

  private generateScript(node: FigmaNode, componentName: string): string {
    // Extract props and data from Figma design
    const props = this.extractProps(node);
    const imports = this.generateImports(node);

    return `${imports}

defineProps<{
${props}
}>();`;
  }

  private generateStyle(node: FigmaNode): string {
    return this.generateStyleRules(node);
  }

  private generateClassName(name: string): string {
    // Convert Figma node name to BEM-style class name
    return name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private extractProps(node: FigmaNode): string {
    // Extract component props from Figma node
    const props: string[] = [];

    // Add common props
    if (node.type === 'TEXT') {
      props.push('  text?: string');
    }

    // Add custom props based on node properties
    if (node.style) {
      // Add props based on style variations
    }

    return props.join('\n');
  }

  private generateImports(node: FigmaNode): string {
    const imports: string[] = [];

    // Add necessary imports based on node type and properties
    if (this.requiresHComponents(node)) {
      imports.push('import { HButton, HIcon } from \'@hcomponents\'');
    }

    return imports.join('\n');
  }

  private generateStyleRules(node: FigmaNode): string {
    let styles = '';

    // Generate CSS rules based on Figma styles
    if (node.style) {
      const className = this.generateClassName(node.name);
      styles += `.${className} {\n`;

      // Convert Figma styles to CSS
      if (node.style.fill) {
        styles += '  background-color: ' + this.convertColor(node.style.fill) + ';\n';
      }

      if (node.style.fontSize) {
        styles += '  font-size: ' + node.style.fontSize + 'px;\n';
      }

      // Add more style conversions as needed

      styles += '}\n';
    }

    // Process children recursively
    if (node.children) {
      node.children.forEach(child => {
        styles += this.generateStyleRules(child);
      });
    }

    return styles;
  }

  private convertColor(fill: any): string {
    // Convert Figma color to CSS color
    if (fill.r !== undefined && fill.g !== undefined && fill.b !== undefined) {
      const r = Math.round(fill.r * 255);
      const g = Math.round(fill.g * 255);
      const b = Math.round(fill.b * 255);
      const a = fill.a !== undefined ? fill.a : 1;
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    return 'transparent';
  }

  private requiresHComponents(node: FigmaNode): boolean {
    // Check if the node or its children require HComponents
    if (node.name.toLowerCase().includes('button') || node.name.toLowerCase().includes('icon')) {
      return true;
    }

    if (node.children) {
      return node.children.some(child => this.requiresHComponents(child));
    }

    return false;
  }
}