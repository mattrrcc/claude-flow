import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Platform,
} from 'react-native';
import { ComponentNode, ComponentType, ComponentStyle } from '../types';
import { BuilderStore } from '../store/builderStore';

interface PropertiesPanelProps {
  store: BuilderStore;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface PropRowProps {
  label: string;
  value: string;
  onChangeText: (val: string) => void;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  placeholder?: string;
}

const PropRow: React.FC<PropRowProps> = ({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
  placeholder,
}) => (
  <View style={styles.propRow}>
    <Text style={styles.propLabel}>{label}</Text>
    <TextInput
      style={styles.propInput}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      placeholder={placeholder || '—'}
      placeholderTextColor="#636366"
      selectTextOnFocus
    />
  </View>
);

interface ColorRowProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

const ColorRow: React.FC<ColorRowProps> = ({ label, value, onChange }) => {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(value || '');

  const handleSubmit = () => {
    const hex = inputVal.startsWith('#') ? inputVal : `#${inputVal}`;
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      onChange(hex);
    }
    setEditing(false);
  };

  return (
    <View style={styles.propRow}>
      <Text style={styles.propLabel}>{label}</Text>
      <View style={styles.colorRow}>
        <View style={[styles.colorSwatch, { backgroundColor: value || '#3A3A3C' }]} />
        {editing ? (
          <TextInput
            style={[styles.propInput, styles.colorInput]}
            value={inputVal}
            onChangeText={setInputVal}
            onBlur={handleSubmit}
            onSubmitEditing={handleSubmit}
            autoFocus
            placeholder="#RRGGBB"
            placeholderTextColor="#636366"
            maxLength={7}
          />
        ) : (
          <TouchableOpacity onPress={() => { setInputVal(value || ''); setEditing(true); }}>
            <Text style={styles.colorValue}>{value || 'None'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setCollapsed(p => !p)}
        activeOpacity={0.7}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionChevron}>{collapsed ? '›' : '⌄'}</Text>
      </TouchableOpacity>
      {!collapsed && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
};

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  store,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { getSelectedNode, updateProps, updateStyle, removeComponent } = store;
  const node = getSelectedNode();

  const handleNumericProp = (key: keyof ComponentNode['props'], val: string) => {
    const num = parseFloat(val);
    if (!isNaN(num)) updateProps(node!.id, { [key]: num } as any);
  };

  const handleStringProp = (key: keyof ComponentNode['props'], val: string) => {
    updateProps(node!.id, { [key]: val } as any);
  };

  const handleStyleNum = (key: keyof ComponentStyle, val: string) => {
    const num = parseFloat(val);
    if (!isNaN(num)) updateStyle(node!.id, { [key]: num } as any);
  };

  const handleStyleStr = (key: keyof ComponentStyle, val: string) => {
    updateStyle(node!.id, { [key]: val } as any);
  };

  return (
    <View style={[styles.container, isCollapsed && styles.containerCollapsed]}>
      <TouchableOpacity
        style={styles.header}
        onPress={onToggleCollapse}
        activeOpacity={0.7}
      >
        <Text style={styles.headerTitle}>
          {isCollapsed ? '▶' : 'Properties'}
        </Text>
        {!isCollapsed && <Text style={styles.collapseIcon}>▶</Text>}
      </TouchableOpacity>

      {!isCollapsed && (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {!node ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Select a component</Text>
              <Text style={styles.emptyStateSubtext}>to edit its properties</Text>
            </View>
          ) : (
            <>
              <View style={styles.nodeInfo}>
                <Text style={styles.nodeType}>{node.type}</Text>
                <Text style={styles.nodeId}>{node.id.slice(0, 12)}</Text>
              </View>

              <Section title="Position & Size">
                <View style={styles.twoCol}>
                  <View style={styles.halfCol}>
                    <PropRow
                      label="X"
                      value={String(node.props.x)}
                      onChangeText={val => handleNumericProp('x', val)}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.halfCol}>
                    <PropRow
                      label="Y"
                      value={String(node.props.y)}
                      onChangeText={val => handleNumericProp('y', val)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <View style={styles.twoCol}>
                  <View style={styles.halfCol}>
                    <PropRow
                      label="W"
                      value={String(node.props.width)}
                      onChangeText={val => handleNumericProp('width', val)}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.halfCol}>
                    <PropRow
                      label="H"
                      value={String(node.props.height)}
                      onChangeText={val => handleNumericProp('height', val)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </Section>

              <Section title="Style">
                <ColorRow
                  label="Background"
                  value={node.props.style.backgroundColor || ''}
                  onChange={val => handleStyleStr('backgroundColor', val)}
                />
                <PropRow
                  label="Radius"
                  value={String(node.props.style.borderRadius ?? '')}
                  onChangeText={val => handleStyleNum('borderRadius', val)}
                  keyboardType="numeric"
                />
                <PropRow
                  label="Padding"
                  value={String(node.props.style.padding ?? '')}
                  onChangeText={val => handleStyleNum('padding', val)}
                  keyboardType="numeric"
                />
                <PropRow
                  label="Margin"
                  value={String(node.props.style.margin ?? '')}
                  onChangeText={val => handleStyleNum('margin', val)}
                  keyboardType="numeric"
                />
                <PropRow
                  label="Opacity"
                  value={String(node.props.style.opacity ?? '')}
                  onChangeText={val => handleStyleNum('opacity', val)}
                  keyboardType="decimal-pad"
                  placeholder="0.0 – 1.0"
                />
                <ColorRow
                  label="Border Color"
                  value={node.props.style.borderColor || ''}
                  onChange={val => handleStyleStr('borderColor', val)}
                />
                <PropRow
                  label="Border W"
                  value={String(node.props.style.borderWidth ?? '')}
                  onChangeText={val => handleStyleNum('borderWidth', val)}
                  keyboardType="numeric"
                />
              </Section>

              {(node.type === ComponentType.Text) && (
                <Section title="Text">
                  <PropRow
                    label="Content"
                    value={node.props.text || ''}
                    onChangeText={val => handleStringProp('text', val)}
                  />
                  <ColorRow
                    label="Color"
                    value={node.props.style.color || ''}
                    onChange={val => handleStyleStr('color', val)}
                  />
                  <PropRow
                    label="Font Size"
                    value={String(node.props.style.fontSize ?? '')}
                    onChangeText={val => handleStyleNum('fontSize', val)}
                    keyboardType="numeric"
                  />
                </Section>
              )}

              {node.type === ComponentType.Button && (
                <Section title="Button">
                  <PropRow
                    label="Label"
                    value={node.props.label || ''}
                    onChangeText={val => handleStringProp('label', val)}
                  />
                </Section>
              )}

              {node.type === ComponentType.TextInput && (
                <Section title="Input">
                  <PropRow
                    label="Placeholder"
                    value={node.props.placeholder || ''}
                    onChangeText={val => handleStringProp('placeholder', val)}
                  />
                </Section>
              )}

              {node.type === ComponentType.Switch && (
                <Section title="Switch">
                  <PropRow
                    label="Label"
                    value={node.props.label || ''}
                    onChangeText={val => handleStringProp('label', val)}
                  />
                  <View style={styles.propRow}>
                    <Text style={styles.propLabel}>On</Text>
                    <Switch
                      value={!!node.props.value}
                      onValueChange={val => updateProps(node.id, { value: val })}
                      trackColor={{ false: '#48484A', true: '#34C759' }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                </Section>
              )}

              {node.type === ComponentType.Slider && (
                <Section title="Slider">
                  <PropRow
                    label="Min"
                    value={String(node.props.minimumValue ?? 0)}
                    onChangeText={val => handleNumericProp('minimumValue', val)}
                    keyboardType="numeric"
                  />
                  <PropRow
                    label="Max"
                    value={String(node.props.maximumValue ?? 100)}
                    onChangeText={val => handleNumericProp('maximumValue', val)}
                    keyboardType="numeric"
                  />
                  <PropRow
                    label="Step"
                    value={String(node.props.step ?? 1)}
                    onChangeText={val => handleNumericProp('step', val)}
                    keyboardType="numeric"
                  />
                </Section>
              )}

              {(node.type === ComponentType.Image || node.type === ComponentType.Icon) && (
                <Section title="Image">
                  <PropRow
                    label="SF Symbol"
                    value={node.props.systemIconName || ''}
                    onChangeText={val => handleStringProp('systemIconName', val)}
                    placeholder="e.g. star.fill"
                  />
                  <ColorRow
                    label="Tint"
                    value={node.props.style.color || ''}
                    onChange={val => handleStyleStr('color', val)}
                  />
                </Section>
              )}

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeComponent(node.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.deleteButtonText}>Delete Component</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 190,
    backgroundColor: '#2C2C2E',
    borderLeftWidth: 1,
    borderLeftColor: '#3A3A3C',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: -2, height: 0 }, shadowOpacity: 0.2, shadowRadius: 4 },
      android: { elevation: 4 },
    }),
  },
  containerCollapsed: { width: 36 },
  header: { height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#3A3A3C' },
  headerTitle: { color: '#EBEBF5', fontSize: 13, fontWeight: '600', letterSpacing: 0.5 },
  collapseIcon: { color: '#636366', fontSize: 12 },
  scrollView: { flex: 1 },
  emptyState: { padding: 20, alignItems: 'center' },
  emptyStateText: { color: '#636366', fontSize: 13, marginBottom: 4 },
  emptyStateSubtext: { color: '#48484A', fontSize: 12 },
  nodeInfo: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#3A3A3C' },
  nodeType: { color: '#007AFF', fontSize: 14, fontWeight: '600' },
  nodeId: { color: '#636366', fontSize: 10, marginTop: 2, fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }) },
  section: { borderBottomWidth: 1, borderBottomColor: '#3A3A3C' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#1C1C1E' },
  sectionTitle: { color: '#8E8E93', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6 },
  sectionChevron: { color: '#636366', fontSize: 14 },
  sectionContent: { paddingVertical: 4 },
  propRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6 },
  propLabel: { width: 64, color: '#8E8E93', fontSize: 12 },
  propInput: { flex: 1, color: '#FFFFFF', fontSize: 12, backgroundColor: '#3A3A3C', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4, fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }) },
  twoCol: { flexDirection: 'row' },
  halfCol: { flex: 1 },
  colorRow: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  colorSwatch: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#48484A', marginRight: 6 },
  colorValue: { color: '#EBEBF5', fontSize: 11, fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }) },
  colorInput: { flex: 1 },
  deleteButton: { margin: 12, padding: 10, backgroundColor: '#3A0000', borderRadius: 8, borderWidth: 1, borderColor: '#FF3B30', alignItems: 'center' },
  deleteButtonText: { color: '#FF3B30', fontSize: 13, fontWeight: '600' },
});
