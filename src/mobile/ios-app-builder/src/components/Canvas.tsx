import React, { useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { BuilderStore } from '../store/builderStore';
import { RenderedComponent, GridBackground, DeviceFrame, DEVICE_WIDTH, DEVICE_HEIGHT } from './CanvasComponents';

interface CanvasProps {
  store: BuilderStore;
}

export const Canvas: React.FC<CanvasProps> = ({ store }) => {
  const { state, selectComponent, moveComponent } = store;
  const { components, selectedId, zoom, showDeviceFrame } = state;

  const handleCanvasPress = useCallback(() => {
    selectComponent(null);
  }, [selectComponent]);

  const canvasWidth = DEVICE_WIDTH * zoom;
  const canvasHeight = DEVICE_HEIGHT * zoom;
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={[
        styles.scrollContent,
        {
          width: Math.max(canvasWidth + 80, screenWidth),
          height: Math.max(canvasHeight + 80, screenHeight),
        },
      ]}
      showsHorizontalScrollIndicator
      showsVerticalScrollIndicator
      scrollEventThrottle={16}
    >
      <TouchableOpacity
        style={styles.canvasTouchable}
        onPress={handleCanvasPress}
        activeOpacity={1}
      >
        <View
          style={[
            styles.canvas,
            {
              width: DEVICE_WIDTH,
              height: DEVICE_HEIGHT,
              transform: [{ scale: zoom }],
            },
          ]}
        >
          <GridBackground width={DEVICE_WIDTH} height={DEVICE_HEIGHT} />

          {components.map(node => (
            <RenderedComponent
              key={node.id}
              node={node}
              isSelected={node.id === selectedId}
              onSelect={selectComponent}
              onMove={moveComponent}
              zoom={zoom}
            />
          ))}

          {showDeviceFrame && <DeviceFrame />}

          {components.length === 0 && (
            <View style={styles.emptyState} pointerEvents="none">
              <Text style={styles.emptyStateTitle}>Canvas</Text>
              <Text style={styles.emptyStateSubtitle}>
                Tap components in the palette to add them here
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#121214',
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  canvasTouchable: {
    alignSelf: 'flex-start',
  },
  canvas: {
    backgroundColor: '#1C1C1E',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
      },
      android: { elevation: 12 },
    }),
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    color: '#48484A',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    color: '#3A3A3C',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
