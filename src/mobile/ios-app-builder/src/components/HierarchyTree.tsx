import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { ComponentNode, ComponentType } from '../types';
import { BuilderStore } from '../store/builderStore';

interface HierarchyTreeProps {
  store: BuilderStore;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

interface TreeNodeProps {
  node: ComponentNode;
  depth: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
}

const TYPE_ICONS: Partial<Record<ComponentType, string>> = {
  [ComponentType.View]: '□',
  [ComponentType.ScrollView]: '⇕',
  [ComponentType.SafeAreaView]: '⧈',
  [ComponentType.Text]: 'T',
  [ComponentType.Image]: '▣',
  [ComponentType.Icon]: '★',
  [ComponentType.Button]: '⬭',
  [ComponentType.TextInput]: '▭',
  [ComponentType.Switch]: '⟺',
  [ComponentType.Slider]: '—',
  [ComponentType.FlatList]: '☰',
  [ComponentType.SectionList]: '⋮',
  [ComponentType.Picker]: '▾',
};

const TYPE_COLORS: Partial<Record<ComponentType, string>> = {
  [ComponentType.View]: '#5E5CE6',
  [ComponentType.ScrollView]: '#30B0C7',
  [ComponentType.SafeAreaView]: '#2FB6AC',
  [ComponentType.Text]: '#EBEBF5',
  [ComponentType.Image]: '#FF9F0A',
  [ComponentType.Icon]: '#FFD60A',
  [ComponentType.Button]: '#007AFF',
  [ComponentType.TextInput]: '#34C759',
  [ComponentType.Switch]: '#32ADE6',
  [ComponentType.Slider]: '#AC8E68',
  [ComponentType.FlatList]: '#FF6961',
  [ComponentType.SectionList]: '#FF6961',
  [ComponentType.Picker]: '#BF5AF2',
};

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  depth,
  selectedId,
  onSelect,
  expandedIds,
  onToggleExpand,
}) => {
  const isSelected = node.id === selectedId;
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const icon = TYPE_ICONS[node.type] || '◇';
  const color = TYPE_COLORS[node.type] || '#8E8E93';
  const indentWidth = depth * 16;

  const getNodeLabel = (): string => {
    switch (node.type) {
      case ComponentType.Text: return node.props.text ? `"${node.props.text.slice(0, 12)}${node.props.text.length > 12 ? '…' : ''}"` : node.type;
      case ComponentType.Button: return node.props.label ? `[${node.props.label}]` : node.type;
      case ComponentType.TextInput: return node.props.placeholder ? node.props.placeholder.slice(0, 14) : node.type;
      default: return node.type;
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.treeNode, isSelected && styles.treeNodeSelected]}
        onPress={() => onSelect(node.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.indent, { width: indentWidth }]} />

        {hasChildren ? (
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => onToggleExpand(node.id)}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          >
            <Text style={styles.expandIcon}>{isExpanded ? '▾' : '›'}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.leafSpacer} />
        )}

        <View style={[styles.nodeIcon, { backgroundColor: `${color}22` }]}>
          <Text style={[styles.nodeIconText, { color }]}>{icon}</Text>
        </View>

        <Text style={[styles.nodeLabel, isSelected && styles.nodeLabelSelected]} numberOfLines={1}>
          {getNodeLabel()}
        </Text>

        {isSelected && (
          <View style={styles.selectedIndicator} />
        )}
      </TouchableOpacity>

      {hasChildren && isExpanded && (
        <View>
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const countNodes = (nodes: ComponentNode[]): number => {
  return nodes.reduce((acc, node) => acc + 1 + countNodes(node.children || []), 0);
};

export const HierarchyTree: React.FC<HierarchyTreeProps> = ({
  store,
  isExpanded,
  onToggleExpand,
}) => {
  const { state, selectComponent } = store;
  const { components, selectedId } = state;
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleNodeExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const totalNodes = countNodes(components);

  return (
    <View style={[styles.container, isExpanded && styles.containerExpanded]}>
      <TouchableOpacity
        style={styles.header}
        onPress={onToggleExpand}
        activeOpacity={0.7}
      >
        <Text style={styles.headerTitle}>Hierarchy</Text>
        <View style={styles.headerRight}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{totalNodes}</Text>
          </View>
          <Text style={styles.expandIcon}>{isExpanded ? '⌄' : '›'}</Text>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <ScrollView
          horizontal
          style={styles.treeScrollHorizontal}
          showsHorizontalScrollIndicator={false}
        >
          <ScrollView
            style={styles.treeScrollVertical}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.treeContent}
          >
            {components.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No components yet</Text>
              </View>
            ) : (
              components.map(node => (
                <TreeNode
                  key={node.id}
                  node={node}
                  depth={0}
                  selectedId={selectedId}
                  onSelect={selectComponent}
                  expandedIds={expandedIds}
                  onToggleExpand={toggleNodeExpand}
                />
              ))
            )}
          </ScrollView>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2C2C2E',
    borderTopWidth: 1,
    borderTopColor: '#3A3A3C',
    maxHeight: 44,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: { elevation: 4 },
    }),
  },
  containerExpanded: {
    maxHeight: 200,
  },
  header: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#EBEBF5',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: '#3A3A3C',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#8E8E93',
    fontSize: 11,
    fontWeight: '600',
  },
  expandIcon: {
    color: '#636366',
    fontSize: 14,
  },
  treeScrollHorizontal: {
    flex: 1,
  },
  treeScrollVertical: {
    flex: 1,
  },
  treeContent: {
    paddingBottom: 8,
    minWidth: '100%',
  },
  treeNode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingRight: 16,
    minWidth: 200,
  },
  treeNodeSelected: {
    backgroundColor: '#007AFF1A',
  },
  indent: {
    flexShrink: 0,
  },
  expandButton: {
    width: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  leafSpacer: {
    width: 20,
  },
  nodeIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  nodeIconText: {
    fontSize: 10,
    fontWeight: '700',
  },
  nodeLabel: {
    flex: 1,
    color: '#EBEBF5',
    fontSize: 12,
  },
  nodeLabelSelected: {
    color: '#007AFF',
    fontWeight: '500',
  },
  selectedIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#007AFF',
    marginLeft: 6,
  },
  emptyState: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emptyText: {
    color: '#48484A',
    fontSize: 12,
  },
});
