import { ComponentNode, ComponentType, GeneratedCode } from '../types';

const indent = (level: number): string => '    '.repeat(level);

function generateSwiftUIComponent(node: ComponentNode, level: number): string {
  const i = indent(level);
  const { type, props } = node;
  const children = node.children || [];
  const childrenCode = children.map(child => generateSwiftUIComponent(child, level + 1)).join('\n');
  const modifiers = buildModifiers(node, level);

  switch (type) {
    case ComponentType.View:
      return [
        `${i}ZStack {`,
        childrenCode || `${indent(level + 1)}EmptyView()`,
        `${i}}`,
        modifiers,
      ].filter(Boolean).join('\n');

    case ComponentType.SafeAreaView:
      return [
        `${i}VStack {`,
        childrenCode || `${indent(level + 1)}EmptyView()`,
        `${i}}`,
        `${i}.ignoresSafeArea(.all, edges: .bottom)`,
        modifiers,
      ].filter(Boolean).join('\n');

    case ComponentType.ScrollView:
      return [
        `${i}ScrollView {`,
        `${indent(level + 1)}VStack {`,
        childrenCode || `${indent(level + 2)}EmptyView()`,
        `${indent(level + 1)}}`,
        `${i}}`,
        modifiers,
      ].filter(Boolean).join('\n');

    case ComponentType.Text:
      return [
        `${i}Text("${props.text || 'Hello, World!'}")`,
        modifiers,
      ].filter(Boolean).join('\n');

    case ComponentType.Button:
      return [
        `${i}Button("${props.label || 'Button'}") {`,
        `${indent(level + 1)}// Action`,
        `${i}}`,
        `${i}.buttonStyle(.borderedProminent)`,
        modifiers,
      ].filter(Boolean).join('\n');

    case ComponentType.TextInput:
      return [
        `${i}TextField("${props.placeholder || 'Enter text...'}", text: $text)`,
        `${i}.textFieldStyle(.roundedBorder)`,
        modifiers,
      ].filter(Boolean).join('\n');

    case ComponentType.Image:
      if (props.systemIconName) {
        return [
          `${i}Image(systemName: "${props.systemIconName}")`,
          `${i}.resizable()`,
          `${i}.scaledToFit()`,
          modifiers,
        ].filter(Boolean).join('\n');
      }
      return [
        `${i}Image("placeholder")`,
        `${i}.resizable()`,
        `${i}.scaledToFit()`,
        modifiers,
      ].filter(Boolean).join('\n');

    case ComponentType.Icon:
      return [
        `${i}Image(systemName: "${props.systemIconName || 'star.fill'}")`,
        modifiers,
      ].filter(Boolean).join('\n');

    case ComponentType.Switch:
      return [
        `${i}Toggle("${props.label || 'Toggle'}", isOn: $isOn)`,
        modifiers,
      ].filter(Boolean).join('\n');

    case ComponentType.Slider:
      return [
        `${i}Slider(`,
        `${indent(level + 1)}value: $sliderValue,`,
        `${indent(level + 1)}in: ${props.minimumValue ?? 0}...${props.maximumValue ?? 100},`,
        `${indent(level + 1)}step: ${props.step ?? 1}`,
        `${i})`,
        modifiers,
      ].filter(Boolean).join('\n');

    case ComponentType.FlatList: {
      const items = props.data || ['Item 1', 'Item 2', 'Item 3'];
      const dataArray = items.map(item => `"${item}"`).join(', ');
      return [
        `${i}List([${dataArray}], id: \\.self) { item in`,
        `${indent(level + 1)}Text(item)`,
        `${i}}`,
        modifiers,
      ].filter(Boolean).join('\n');
    }

    case ComponentType.SectionList:
      return [
        `${i}List {`,
        `${indent(level + 1)}Section(header: Text("Section")) {`,
        `${indent(level + 2)}Text("Item 1")`,
        `${indent(level + 2)}Text("Item 2")`,
        `${indent(level + 1)}}`,
        `${i}}`,
        modifiers,
      ].filter(Boolean).join('\n');

    case ComponentType.Picker: {
      const options = props.data || ['Option 1', 'Option 2', 'Option 3'];
      const pickerItems = options.map(o =>
        `${indent(level + 1)}Text("${o}").tag("${o}")`
      ).join('\n');
      return [
        `${i}Picker("Select", selection: $selected) {`,
        pickerItems,
        `${i}}`,
        `${i}.pickerStyle(.wheel)`,
        modifiers,
      ].filter(Boolean).join('\n');
    }

    default:
      return `${i}// Unknown component: ${type}`;
  }
}

function buildModifiers(node: ComponentNode, level: number): string {
  const i = indent(level);
  const { style, props } = node;
  const modifiers: string[] = [];

  if (style?.backgroundColor) {
    const color = swiftColor(style.backgroundColor);
    modifiers.push(`${i}.background(${color})`);
  }
  if (style?.borderRadius) {
    modifiers.push(`${i}.cornerRadius(${style.borderRadius})`);
  }
  if (style?.padding) {
    modifiers.push(`${i}.padding(${style.padding})`);
  }
  if (style?.opacity !== undefined) {
    modifiers.push(`${i}.opacity(${style.opacity})`);
  }
  if (props.width && props.height) {
    modifiers.push(`${i}.frame(width: ${props.width}, height: ${props.height})`);
  }
  if (style?.color) {
    const color = swiftColor(style.color);
    modifiers.push(`${i}.foregroundColor(${color})`);
  }
  if (style?.fontSize) {
    modifiers.push(`${i}.font(.system(size: ${style.fontSize}))`);
  }
  if (style?.fontWeight === 'bold') {
    modifiers.push(`${i}.fontWeight(.bold)`);
  }

  return modifiers.join('\n');
}

function swiftColor(hex: string): string {
  const namedColors: Record<string, string> = {
    '#007AFF': '.blue',
    '#FF3B30': '.red',
    '#34C759': '.green',
    '#FF9500': '.orange',
    '#FFFFFF': '.white',
    '#000000': '.black',
    '#1C1C1E': 'Color(red: 0.11, green: 0.11, blue: 0.12)',
    '#2C2C2E': 'Color(red: 0.17, green: 0.17, blue: 0.18)',
    '#3A3A3C': 'Color(red: 0.23, green: 0.23, blue: 0.24)',
  };
  if (namedColors[hex]) return namedColors[hex];

  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return `Color(red: ${r.toFixed(2)}, green: ${g.toFixed(2)}, blue: ${b.toFixed(2)})`;
}

function collectStateVars(nodes: ComponentNode[]): string[] {
  const vars: string[] = [];
  const traverse = (node: ComponentNode) => {
    switch (node.type) {
      case ComponentType.TextInput:
        vars.push('@State private var text: String = ""');
        break;
      case ComponentType.Switch:
        vars.push('@State private var isOn: Bool = true');
        break;
      case ComponentType.Slider:
        vars.push('@State private var sliderValue: Double = 50');
        break;
      case ComponentType.Picker:
        vars.push('@State private var selected: String = ""');
        break;
    }
    node.children?.forEach(traverse);
  };
  nodes.forEach(traverse);
  return [...new Set(vars)];
}

export function generateSwiftUICode(components: ComponentNode[]): string {
  if (components.length === 0) {
    return `import SwiftUI

struct ContentView: View {
    var body: some View {
        Text("Add components to get started")
            .foregroundColor(.secondary)
    }
}

#Preview {
    ContentView()
}`;
  }

  const stateVars = collectStateVars(components);
  const stateSection = stateVars.length > 0
    ? stateVars.map(v => `    ${v}`).join('\n') + '\n\n'
    : '';

  const bodyContent = components
    .map(comp => generateSwiftUIComponent(comp, 2))
    .join('\n');

  return `import SwiftUI

struct ContentView: View {
${stateSection}    var body: some View {
        ZStack {
${bodyContent}
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(red: 0.11, green: 0.11, blue: 0.12))
    }
}

#Preview {
    ContentView()
}`;
}

function generateSwiftComponent(node: ComponentNode, level: number): string {
  const i = indent(level);
  const { type, props } = node;
  const children = node.children || [];

  switch (type) {
    case ComponentType.View:
      return [
        `${i}let view${node.id.slice(0, 6)} = UIView()`,
        `${i}view${node.id.slice(0, 6)}.frame = CGRect(x: ${props.x}, y: ${props.y}, width: ${props.width}, height: ${props.height})`,
        props.style?.backgroundColor
          ? `${i}view${node.id.slice(0, 6)}.backgroundColor = UIColor(hex: "${props.style.backgroundColor}")`
          : '',
        props.style?.borderRadius
          ? `${i}view${node.id.slice(0, 6)}.layer.cornerRadius = ${props.style.borderRadius}`
          : '',
        children.map(c => generateSwiftComponent(c, level)).join('\n'),
      ].filter(Boolean).join('\n');

    case ComponentType.Text:
      return [
        `${i}let label${node.id.slice(0, 6)} = UILabel()`,
        `${i}label${node.id.slice(0, 6)}.frame = CGRect(x: ${props.x}, y: ${props.y}, width: ${props.width}, height: ${props.height})`,
        `${i}label${node.id.slice(0, 6)}.text = "${props.text || 'Hello, World!'}"`,
        props.style?.color
          ? `${i}label${node.id.slice(0, 6)}.textColor = UIColor(hex: "${props.style.color}")`
          : '',
        props.style?.fontSize
          ? `${i}label${node.id.slice(0, 6)}.font = UIFont.systemFont(ofSize: ${props.style.fontSize})`
          : '',
      ].filter(Boolean).join('\n');

    case ComponentType.Button:
      return [
        `${i}let button${node.id.slice(0, 6)} = UIButton(type: .system)`,
        `${i}button${node.id.slice(0, 6)}.frame = CGRect(x: ${props.x}, y: ${props.y}, width: ${props.width}, height: ${props.height})`,
        `${i}button${node.id.slice(0, 6)}.setTitle("${props.label || 'Button'}", for: .normal)`,
        `${i}button${node.id.slice(0, 6)}.backgroundColor = UIColor(hex: "${props.style?.backgroundColor || '#007AFF'}")`,
        `${i}button${node.id.slice(0, 6)}.layer.cornerRadius = ${props.style?.borderRadius || 8}`,
      ].filter(Boolean).join('\n');

    case ComponentType.TextInput:
      return [
        `${i}let textField${node.id.slice(0, 6)} = UITextField()`,
        `${i}textField${node.id.slice(0, 6)}.frame = CGRect(x: ${props.x}, y: ${props.y}, width: ${props.width}, height: ${props.height})`,
        `${i}textField${node.id.slice(0, 6)}.placeholder = "${props.placeholder || 'Enter text...'}"`,
        `${i}textField${node.id.slice(0, 6)}.borderStyle = .roundedRect`,
      ].filter(Boolean).join('\n');

    default:
      return `${i}// ${type} at (${props.x}, ${props.y})`;
  }
}

export function generateSwiftCode(components: ComponentNode[]): string {
  if (components.length === 0) {
    return `import UIKit

class ViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(named: "systemBackground")
    }
}`;
  }

  const setupCode = components
    .map(comp => generateSwiftComponent(comp, 2))
    .join('\n\n');

  const addSubviews = components
    .map(comp => `        view.addSubview(view${comp.id.slice(0, 6)})`)
    .join('\n');

  return `import UIKit

class ViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(red: 0.11, green: 0.11, blue: 0.12, alpha: 1)
        setupViews()
    }

    private func setupViews() {
${setupCode}

${addSubviews}
    }
}`;
}

export function generateCode(components: ComponentNode[]): GeneratedCode {
  return {
    swiftui: generateSwiftUICode(components),
    swift: generateSwiftCode(components),
  };
}
