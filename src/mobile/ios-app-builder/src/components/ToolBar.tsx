import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { BuilderStore } from '../store/builderStore';

interface ToolBarProps {
  store: BuilderStore;
  onOpenCodePreview: () => void;
  onOpenLibrary: () => void;
}

interface ToolButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  accent?: boolean;
}

const ToolButton: React.FC<ToolButtonProps> = ({ label, onPress, disabled, accent }) => (
  <TouchableOpacity
    style={[styles.toolButton, disabled && styles.toolButtonDisabled, accent && styles.toolButtonAccent]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.7}
  >
    <Text style={[styles.toolButtonText, disabled && styles.toolButtonTextDisabled, accent && styles.toolButtonTextAccent]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const ZoomControls: React.FC<{ zoom: number; onZoom: (zoom: number) => void }> = ({ zoom, onZoom }) => (
  <View style={styles.zoomContainer}>
    <TouchableOpacity style={styles.zoomBtn} onPress={() => onZoom(zoom - 0.1)} activeOpacity={0.7}>
      <Text style={styles.zoomBtnText}>−</Text>
    </TouchableOpacity>
    <Text style={styles.zoomLabel}>{Math.round(zoom * 100)}%</Text>
    <TouchableOpacity style={styles.zoomBtn} onPress={() => onZoom(zoom + 0.1)} activeOpacity={0.7}>
      <Text style={styles.zoomBtnText}>+</Text>
    </TouchableOpacity>
  </View>
);

export const ToolBar: React.FC<ToolBarProps> = ({ store, onOpenCodePreview, onOpenLibrary }) => {
  const { state, undo, redo, toggleDeviceFrame, setZoom, clearCanvas } = store;
  const canUndo = state.undoStack.length > 0;
  const canRedo = state.redoStack.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.appTitle}>iOS Builder</Text>
        <View style={styles.separator} />
        <ToolButton label="Undo" onPress={undo} disabled={!canUndo} />
        <ToolButton label="Redo" onPress={redo} disabled={!canRedo} />
        <ToolButton label="Clear" onPress={clearCanvas} disabled={state.components.length === 0} />
      </View>

      <View style={styles.centerSection}>
        <ZoomControls zoom={state.zoom} onZoom={setZoom} />
        <TouchableOpacity
          style={[styles.frameToggle, state.showDeviceFrame && styles.frameToggleActive]}
          onPress={toggleDeviceFrame}
          activeOpacity={0.7}
        >
          <Text style={[styles.frameToggleText, state.showDeviceFrame && styles.frameToggleTextActive]}>
            Frame
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rightSection}>
        <ToolButton label="Library" onPress={onOpenLibrary} />
        <ToolButton label="</>  Code" onPress={onOpenCodePreview} accent />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 52,
    backgroundColor: '#2C2C2E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  centerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  appTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
    ...Platform.select({
      ios: { fontFamily: 'System' },
      android: { fontFamily: 'Roboto' },
    }),
  },
  separator: {
    width: 1,
    height: 24,
    backgroundColor: '#3A3A3C',
    marginHorizontal: 6,
  },
  toolButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#3A3A3C',
  },
  toolButtonDisabled: {
    opacity: 0.4,
  },
  toolButtonAccent: {
    backgroundColor: '#007AFF',
  },
  toolButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  toolButtonTextDisabled: {
    color: '#8E8E93',
  },
  toolButtonTextAccent: {
    color: '#FFFFFF',
  },
  zoomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A3A3C',
    borderRadius: 6,
    overflow: 'hidden',
  },
  zoomBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 20,
  },
  zoomLabel: {
    color: '#EBEBF5',
    fontSize: 12,
    fontWeight: '500',
    minWidth: 40,
    textAlign: 'center',
  },
  frameToggle: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#3A3A3C',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  frameToggleActive: {
    borderColor: '#007AFF',
  },
  frameToggleText: {
    color: '#8E8E93',
    fontSize: 13,
    fontWeight: '500',
  },
  frameToggleTextActive: {
    color: '#007AFF',
  },
});
