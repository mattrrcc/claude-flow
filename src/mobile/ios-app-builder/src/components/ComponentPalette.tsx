import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { ComponentType, ComponentCategory } from '../types';
import { COMPONENT_DEFINITIONS, ALL_CATEGORIES } from '../utils/componentDefaults';

interface ComponentPaletteProps {
  onAddComponent: (type: ComponentType) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface CategorySectionProps {
  category: ComponentCategory;
  onAddComponent: (type: ComponentType) => void;
}

const CATEGORY_ICONS: Record<ComponentCategory, string> = {
  Layout: '▣',
  Content: '✦',
  Input: '◉',
  Lists: '≡',
};

const PaletteItem: React.FC<{
  icon: string;
  label: string;
  onPress: () => void;
}> = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.paletteItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.paletteItemIcon}>
      <Text style={styles.paletteItemIconText}>{icon}</Text>
    </View>
    <Text style={styles.paletteItemLabel} numberOfLines={1}>
      {label}
    </Text>
  </TouchableOpacity>
);

const CategorySection: React.FC<CategorySectionProps> = ({ category, onAddComponent }) => {
  const [collapsed, setCollapsed] = useState(false);
  const items = COMPONENT_DEFINITIONS.filter(def => def.category === category);

  return (
    <View style={styles.categorySection}>
      <TouchableOpacity
        style={styles.categoryHeader}
        onPress={() => setCollapsed(prev => !prev)}
        activeOpacity={0.7}
      >
        <Text style={styles.categoryIcon}>{CATEGORY_ICONS[category]}</Text>
        <Text style={styles.categoryTitle}>{category}</Text>
        <Text style={styles.categoryChevron}>{collapsed ? '›' : '⌄'}</Text>
      </TouchableOpacity>

      {!collapsed && (
        <View style={styles.itemGrid}>
          {items.map(def => (
            <PaletteItem
              key={def.type}
              icon={getCategoryItemIcon(def.type)}
              label={def.label}
              onPress={() => onAddComponent(def.type)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

function getCategoryItemIcon(type: ComponentType): string {
  const icons: Partial<Record<ComponentType, string>> = {
    [ComponentType.View]: '□',
    [ComponentType.ScrollView]: '⇕',
    [ComponentType.SafeAreaView]: '⧈',
    [ComponentType.Text]: 'T',
    [ComponentType.Image]: '🖼',
    [ComponentType.Icon]: '★',
    [ComponentType.Button]: '⬭',
    [ComponentType.TextInput]: '▭',
    [ComponentType.Switch]: '⟺',
    [ComponentType.Slider]: '—',
    [ComponentType.FlatList]: '☰',
    [ComponentType.SectionList]: '⋮',
    [ComponentType.Picker]: '▾',
  };
  return icons[type] || '◇';
}

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({
  onAddComponent,
  isCollapsed,
  onToggleCollapse,
}) => {
  return (
    <View style={[styles.container, isCollapsed && styles.containerCollapsed]}>
      <TouchableOpacity
        style={styles.header}
        onPress={onToggleCollapse}
        activeOpacity={0.7}
      >
        <Text style={styles.headerTitle}>
          {isCollapsed ? '◀' : 'Components'}
        </Text>
        {!isCollapsed && (
          <Text style={styles.collapseIcon}>◀</Text>
        )}
      </TouchableOpacity>

      {!isCollapsed && (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {ALL_CATEGORIES.map(category => (
            <CategorySection
              key={category}
              category={category}
              onAddComponent={onAddComponent}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    backgroundColor: '#2C2C2E',
    borderRightWidth: 1,
    borderRightColor: '#3A3A3C',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: { elevation: 4 },
    }),
  },
  containerCollapsed: {
    width: 36,
  },
  header: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  headerTitle: {
    color: '#EBEBF5',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  collapseIcon: {
    color: '#636366',
    fontSize: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  categorySection: {
    marginBottom: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#1C1C1E',
  },
  categoryIcon: {
    color: '#007AFF',
    fontSize: 11,
    marginRight: 6,
  },
  categoryTitle: {
    flex: 1,
    color: '#8E8E93',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  categoryChevron: {
    color: '#636366',
    fontSize: 14,
  },
  itemGrid: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  paletteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 2,
  },
  paletteItemIcon: {
    width: 28,
    height: 28,
    backgroundColor: '#3A3A3C',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  paletteItemIconText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  paletteItemLabel: {
    flex: 1,
    color: '#EBEBF5',
    fontSize: 12,
    fontWeight: '400',
  },
});
