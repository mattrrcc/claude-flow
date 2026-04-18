import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { useBuilderStore } from '../store/builderStore';
import { Canvas } from '../components/Canvas';
import { ComponentPalette } from '../components/ComponentPalette';
import { PropertiesPanel } from '../components/PropertiesPanel';
import { HierarchyTree } from '../components/HierarchyTree';
import { ToolBar } from '../components/ToolBar';
import { generateCode } from '../utils/codeGenerator';
import { ComponentType, RootStackParamList } from '../types';

type BuilderScreenProps = StackScreenProps<RootStackParamList, 'Builder'>;

const BuilderScreen: React.FC<BuilderScreenProps> = ({ navigation }) => {
  const store = useBuilderStore();
  const [paletteCollapsed, setPaletteCollapsed] = useState(false);
  const [propertiesCollapsed, setPropertiesCollapsed] = useState(false);
  const [hierarchyExpanded, setHierarchyExpanded] = useState(false);

  const handleOpenCodePreview = useCallback(() => {
    const code = generateCode(store.state.components);
    navigation.navigate('CodePreview', { code });
  }, [store.state.components, navigation]);

  const handleOpenLibrary = useCallback(() => {
    navigation.navigate('ComponentLibrary');
  }, [navigation]);

  const handleAddComponent = useCallback((type: ComponentType) => {
    const canvasCenter = {
      x: Math.round(store.state.canvasSize.width / 2 - 100),
      y: Math.round(store.state.canvasSize.height / 2 - 30),
    };
    store.addComponent(type, canvasCenter);
  }, [store]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ToolBar
        store={store}
        onOpenCodePreview={handleOpenCodePreview}
        onOpenLibrary={handleOpenLibrary}
      />

      <View style={styles.workArea}>
        <ComponentPalette
          onAddComponent={handleAddComponent}
          isCollapsed={paletteCollapsed}
          onToggleCollapse={() => setPaletteCollapsed(prev => !prev)}
        />

        <View style={styles.canvasContainer}>
          <Canvas store={store} />
        </View>

        <PropertiesPanel
          store={store}
          isCollapsed={propertiesCollapsed}
          onToggleCollapse={() => setPropertiesCollapsed(prev => !prev)}
        />
      </View>

      <HierarchyTree
        store={store}
        isExpanded={hierarchyExpanded}
        onToggleExpand={() => setHierarchyExpanded(prev => !prev)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    ...Platform.select({
      android: { paddingTop: 0 },
    }),
  },
  workArea: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  canvasContainer: {
    flex: 1,
    overflow: 'hidden',
  },
});

export default BuilderScreen;
