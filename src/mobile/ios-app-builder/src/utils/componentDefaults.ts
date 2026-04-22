import { ComponentType, ComponentDefinition, ComponentProps } from '../types';

export const DEFAULT_CANVAS_SIZE = { width: 390, height: 844 };
export const IPHONE_15_PRO = { width: 393, height: 852 };
export const DEVICE_FRAME_PADDING = 20;

const baseProps = (x: number, y: number, width: number, height: number): ComponentProps => ({
  x,
  y,
  width,
  height,
  style: {},
});

export const COMPONENT_DEFINITIONS: ComponentDefinition[] = [
  {
    type: ComponentType.View,
    label: 'View',
    category: 'Layout',
    icon: 'square',
    description: 'A container that supports layout, styling, and touch handling.',
    defaultProps: {
      ...baseProps(100, 100, 200, 120),
      style: { backgroundColor: '#3A3A3C', borderRadius: 8 },
    },
  },
  {
    type: ComponentType.ScrollView,
    label: 'Scroll View',
    category: 'Layout',
    icon: 'scroll',
    description: 'A scrollable container for content that overflows the screen.',
    defaultProps: {
      ...baseProps(50, 100, 300, 400),
      style: { backgroundColor: '#2C2C2E' },
    },
  },
  {
    type: ComponentType.SafeAreaView,
    label: 'Safe Area View',
    category: 'Layout',
    icon: 'iphone',
    description: 'Renders content within the safe area boundaries of a device.',
    defaultProps: {
      ...baseProps(0, 0, 390, 844),
      style: { backgroundColor: '#1C1C1E', flex: 1 },
    },
  },
  {
    type: ComponentType.Text,
    label: 'Text',
    category: 'Content',
    icon: 'textformat',
    description: 'A component for displaying text.',
    defaultProps: {
      ...baseProps(100, 100, 200, 44),
      text: 'Hello, World!',
      style: { color: '#FFFFFF', fontSize: 16 },
    },
  },
  {
    type: ComponentType.Image,
    label: 'Image',
    category: 'Content',
    icon: 'photo',
    description: 'A component for displaying images.',
    defaultProps: {
      ...baseProps(100, 100, 150, 150),
      systemIconName: 'photo',
      style: { backgroundColor: '#3A3A3C', borderRadius: 8 },
    },
  },
  {
    type: ComponentType.Icon,
    label: 'Icon',
    category: 'Content',
    icon: 'star',
    description: 'An SF Symbol icon component.',
    defaultProps: {
      ...baseProps(160, 160, 44, 44),
      systemIconName: 'star.fill',
      style: { color: '#007AFF' },
    },
  },
  {
    type: ComponentType.Button,
    label: 'Button',
    category: 'Input',
    icon: 'rectangle.fill',
    description: 'A touchable button component.',
    defaultProps: {
      ...baseProps(95, 100, 200, 50),
      label: 'Tap Me',
      style: {
        backgroundColor: '#007AFF',
        borderRadius: 10,
        padding: 12,
      },
    },
  },
  {
    type: ComponentType.TextInput,
    label: 'Text Input',
    category: 'Input',
    icon: 'cursor.rays',
    description: 'A single or multi-line text input field.',
    defaultProps: {
      ...baseProps(95, 100, 200, 44),
      placeholder: 'Enter text...',
      style: {
        backgroundColor: '#3A3A3C',
        borderRadius: 8,
        padding: 10,
        color: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#545458',
      },
    },
  },
  {
    type: ComponentType.Switch,
    label: 'Switch',
    category: 'Input',
    icon: 'toggle.on',
    description: 'A boolean toggle control.',
    defaultProps: {
      ...baseProps(165, 100, 60, 32),
      value: true,
      label: 'Enable',
      style: {},
    },
  },
  {
    type: ComponentType.Slider,
    label: 'Slider',
    category: 'Input',
    icon: 'slider.horizontal.3',
    description: 'A control for selecting a value from a range.',
    defaultProps: {
      ...baseProps(50, 100, 290, 40),
      minimumValue: 0,
      maximumValue: 100,
      value: 50,
      step: 1,
      style: {},
    },
  },
  {
    type: ComponentType.FlatList,
    label: 'Flat List',
    category: 'Lists',
    icon: 'list.bullet',
    description: 'A performant list component for large datasets.',
    defaultProps: {
      ...baseProps(50, 100, 290, 300),
      data: ['Item 1', 'Item 2', 'Item 3'],
      style: { backgroundColor: '#2C2C2E', borderRadius: 10 },
    },
  },
  {
    type: ComponentType.SectionList,
    label: 'Section List',
    category: 'Lists',
    icon: 'list.dash',
    description: 'A list with section headers.',
    defaultProps: {
      ...baseProps(50, 100, 290, 300),
      style: { backgroundColor: '#2C2C2E', borderRadius: 10 },
    },
  },
  {
    type: ComponentType.Picker,
    label: 'Picker',
    category: 'Input',
    icon: 'chevron.up.chevron.down',
    description: 'A dropdown/wheel picker component.',
    defaultProps: {
      ...baseProps(50, 100, 290, 120),
      data: ['Option 1', 'Option 2', 'Option 3'],
      selectedValue: 'Option 1',
      style: { backgroundColor: '#3A3A3C', borderRadius: 8 },
    },
  },
];

export const getComponentDefinition = (type: ComponentType): ComponentDefinition | undefined =>
  COMPONENT_DEFINITIONS.find(def => def.type === type);

export const getComponentsByCategory = (category: ComponentDefinition['category']): ComponentDefinition[] =>
  COMPONENT_DEFINITIONS.filter(def => def.category === category);

export const ALL_CATEGORIES: ComponentDefinition['category'][] = ['Layout', 'Content', 'Input', 'Lists'];
