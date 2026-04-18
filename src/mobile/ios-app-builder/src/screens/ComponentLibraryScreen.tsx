import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { ComponentItem } from '../components/ComponentItem';
import { COMPONENT_DEFINITIONS, ALL_CATEGORIES } from '../utils/componentDefaults';
import { ComponentDefinition, ComponentCategory, RootStackParamList } from '../types';

type ComponentLibraryScreenProps = StackScreenProps<RootStackParamList, 'ComponentLibrary'>;

const CATEGORY_DESCRIPTIONS: Record<ComponentCategory, string> = {
  Layout: 'Structure and container components for building layouts',
  Content: 'Components for displaying content like text, images, and icons',
  Input: 'Interactive controls for user input and actions',
  Lists: 'Efficient components for rendering lists and collections',
};

const ComponentLibraryScreen: React.FC<ComponentLibraryScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | 'All'>('All');

  const filteredComponents = useMemo(() => {
    let items = COMPONENT_DEFINITIONS;

    if (selectedCategory !== 'All') {
      items = items.filter(def => def.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      items = items.filter(
        def =>
          def.label.toLowerCase().includes(query) ||
          def.description.toLowerCase().includes(query) ||
          def.category.toLowerCase().includes(query)
      );
    }

    return items;
  }, [searchQuery, selectedCategory]);

  const groupedComponents = useMemo(() => {
    if (selectedCategory !== 'All' || searchQuery.trim()) {
      return [{ category: selectedCategory, items: filteredComponents }];
    }
    return ALL_CATEGORIES.map(category => ({
      category,
      items: COMPONENT_DEFINITIONS.filter(def => def.category === category),
    }));
  }, [filteredComponents, selectedCategory, searchQuery]);

  const renderComponent = ({ item }: { item: ComponentDefinition }) => (
    <ComponentItem
      definition={item}
      onAdd={() => navigation.goBack()}
      showDescription
    />
  );

  const renderHeader = () => (
    <View style={styles.listHeader}>
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search components..."
          placeholderTextColor="#636366"
          clearButtonMode="while-editing"
        />
      </View>

      <View style={styles.filterBar}>
        <TouchableOpacity
          style={[styles.filterChip, selectedCategory === 'All' && styles.filterChipActive]}
          onPress={() => setSelectedCategory('All')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterChipText, selectedCategory === 'All' && styles.filterChipTextActive]}>
            All ({COMPONENT_DEFINITIONS.length})
          </Text>
        </TouchableOpacity>

        {ALL_CATEGORIES.map(category => {
          const count = COMPONENT_DEFINITIONS.filter(d => d.category === category).length;
          const isActive = selectedCategory === category;
          return (
            <TouchableOpacity
              key={category}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setSelectedCategory(category)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {category} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedCategory !== 'All' && !searchQuery.trim() && (
        <View style={styles.categoryDescription}>
          <Text style={styles.categoryDescriptionText}>
            {CATEGORY_DESCRIPTIONS[selectedCategory as ComponentCategory]}
          </Text>
        </View>
      )}

      {searchQuery.trim() && (
        <Text style={styles.resultCount}>
          {filteredComponents.length} result{filteredComponents.length !== 1 ? 's' : ''}
        </Text>
      )}
    </View>
  );

  const data = selectedCategory !== 'All' || searchQuery.trim()
    ? filteredComponents
    : groupedComponents.flatMap(g => g.items);

  const renderSectionHeader = (category: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{category}</Text>
      <Text style={styles.sectionSubtitle}>
        {CATEGORY_DESCRIPTIONS[category as ComponentCategory]}
      </Text>
    </View>
  );

  const renderGrouped = () => (
    <FlatList
      data={groupedComponents}
      keyExtractor={item => item.category}
      renderItem={({ item }) => (
        <View>
          {renderSectionHeader(item.category)}
          {item.items.map(def => (
            <ComponentItem
              key={def.type}
              definition={def}
              onAdd={() => navigation.goBack()}
              showDescription
            />
          ))}
        </View>
      )}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );

  const renderFlat = () => (
    <FlatList
      data={filteredComponents}
      keyExtractor={item => item.type}
      renderItem={renderComponent}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>◇</Text>
          <Text style={styles.emptyStateText}>No components found</Text>
          <Text style={styles.emptyStateSubtext}>
            Try a different search term or category
          </Text>
        </View>
      }
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Component Library</Text>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.statsBanner}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{COMPONENT_DEFINITIONS.length}</Text>
          <Text style={styles.statLabel}>Components</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{ALL_CATEGORIES.length}</Text>
          <Text style={styles.statLabel}>Categories</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>iOS 16+</Text>
          <Text style={styles.statLabel}>Target</Text>
        </View>
      </View>

      {selectedCategory !== 'All' || searchQuery.trim() ? renderFlat() : renderGrouped()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
    backgroundColor: '#2C2C2E',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3A3A3C',
    borderRadius: 16,
  },
  closeButtonText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 32,
  },
  statsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C2C2E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: '#007AFF',
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: '#636366',
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#3A3A3C',
  },
  listHeader: {
    paddingBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    margin: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  searchIcon: {
    color: '#636366',
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    padding: 0,
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  filterChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterChipText: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  categoryDescription: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  categoryDescriptionText: {
    color: '#8E8E93',
    fontSize: 13,
    lineHeight: 18,
  },
  resultCount: {
    color: '#636366',
    fontSize: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: '#636366',
    fontSize: 13,
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    color: '#3A3A3C',
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    color: '#636366',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: '#48484A',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ComponentLibraryScreen;
