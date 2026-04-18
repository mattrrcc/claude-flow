export enum ComponentType {
  View = 'View',
  Text = 'Text',
  Button = 'Button',
  TextInput = 'TextInput',
  Image = 'Image',
  ScrollView = 'ScrollView',
  FlatList = 'FlatList',
  Switch = 'Switch',
  Slider = 'Slider',
  Picker = 'Picker',
  SafeAreaView = 'SafeAreaView',
  SectionList = 'SectionList',
  Icon = 'Icon',
}

export type ComponentCategory = 'Layout' | 'Content' | 'Input' | 'Lists';

export interface ComponentStyle {
  backgroundColor?: string;
  borderRadius?: number;
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  margin?: number;
  marginHorizontal?: number;
  marginVertical?: number;
  borderWidth?: number;
  borderColor?: string;
  opacity?: number;
  flex?: number;
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  flexDirection?: 'row' | 'column';
  color?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  textAlign?: 'left' | 'center' | 'right';
}

export interface ComponentProps {
  x: number;
  y: number;
  width: number;
  height: number;
  style: ComponentStyle;
  label?: string;
  text?: string;
  placeholder?: string;
  value?: string | number | boolean;
  source?: string;
  systemIconName?: string;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  data?: string[];
  selectedValue?: string;
}

export interface ComponentNode {
  id: string;
  type: ComponentType;
  props: ComponentProps;
  children: ComponentNode[];
  parentId?: string;
}

export interface CanvasSize {
  width: number;
  height: number;
}

export interface BuilderState {
  components: ComponentNode[];
  selectedId: string | null;
  canvasSize: CanvasSize;
  zoom: number;
  showDeviceFrame: boolean;
  undoStack: ComponentNode[][];
  redoStack: ComponentNode[][];
}

export interface GeneratedCode {
  swift: string;
  swiftui: string;
}

export interface ComponentDefinition {
  type: ComponentType;
  label: string;
  category: ComponentCategory;
  icon: string;
  description: string;
  defaultProps: Partial<ComponentProps>;
}

export type RootStackParamList = {
  Builder: undefined;
  CodePreview: { code: GeneratedCode };
  ComponentLibrary: undefined;
};
