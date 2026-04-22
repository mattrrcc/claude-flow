import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { ComponentDefinition } from '../types';

interface ComponentItemProps {
  definition: ComponentDefinition;
  onAdd: () => void;
  showDescription?: boolean;
}

const CATEGORY_ACCENT: Record<string, string> = {
  Layout: '#5E5CE6',
  Content: '#FF9F0A',
  Input: '#007AFF',
  Lists: '#FF6961',
};

const PREVIEW_ICONS: Record<string, string> = {
  View: '□',
  ScrollView: '⇕',
  SafeAreaView: '⧈',
  Text: 'T',
  Image: '▣',
  Icon: '★',
  Button: '⬭',
  'Text Input': '▭',
  Switch: '⟺',
  Slider: '—',
  'Flat List': '☰',
  'Section List': '⋮',
  Picker: '▾',
};

export const ComponentItem: React.FC<ComponentItemProps> = ({
  definition,
  onAdd,
  showDescription = false,
}) => {
  const accentColor = CATEGORY_ACCENT[definition.category] || '#007AFF';
  const icon = PREVIEW_ICONS[definition.label] || '◇';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onAdd}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${accentColor}22`, borderColor: `${accentColor}44` }]}>
        <Text style={[styles.icon, { color: accentColor }]}>{icon}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.label}>{definition.label}</Text>
        {showDescription && (
          <Text style={styles.description} numberOfLines={2}>
            {definition.description}
          </Text>
        )}
        <View style={[styles.categoryBadge, { backgroundColor: `${accentColor}22` }]}>
          <Text style={[styles.categoryText, { color: accentColor }]}>
            {definition.category}
          </Text>
        </View>
      </View>

      <View style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#3A3A3C',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: { elevation: 2 },
    }),
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    color: '#8E8E93',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 6,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '300',
    lineHeight: 24,
    marginTop: -2,
  },
});
