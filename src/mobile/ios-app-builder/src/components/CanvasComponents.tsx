import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
} from 'react-native';
import { ComponentNode, ComponentType } from '../types';

export const GRID_SIZE = 10;
export const DEVICE_WIDTH = 390;
export const DEVICE_HEIGHT = 844;
const NOTCH_WIDTH = 126;
const NOTCH_HEIGHT = 34;

interface RenderedComponentProps {
  node: ComponentNode;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  zoom: number;
}

export const RenderedComponent: React.FC<RenderedComponentProps> = ({
  node,
  isSelected,
  onSelect,
  onMove,
  zoom,
}) => {
  const pan = useRef(new Animated.ValueXY({ x: node.props.x, y: node.props.y })).current;
  const isDragging = useRef(false);
  const startPos = useRef({ x: node.props.x, y: node.props.y });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) > 3 || Math.abs(gs.dy) > 3,
    onPanResponderGrant: () => {
      isDragging.current = false;
      startPos.current = { x: node.props.x, y: node.props.y };
      pan.setOffset({ x: node.props.x, y: node.props.y });
      pan.setValue({ x: 0, y: 0 });
      onSelect(node.id);
    },
    onPanResponderMove: (_, gs) => {
      isDragging.current = true;
      pan.setValue({ x: gs.dx / zoom, y: gs.dy / zoom });
    },
    onPanResponderRelease: (_, gs) => {
      pan.flattenOffset();
      if (isDragging.current) {
        const newX = Math.round((startPos.current.x + gs.dx / zoom) / GRID_SIZE) * GRID_SIZE;
        const newY = Math.round((startPos.current.y + gs.dy / zoom) / GRID_SIZE) * GRID_SIZE;
        const clampedX = Math.max(0, Math.min(DEVICE_WIDTH - node.props.width, newX));
        const clampedY = Math.max(0, Math.min(DEVICE_HEIGHT - node.props.height, newY));
        onMove(node.id, clampedX, clampedY);
        pan.setValue({ x: clampedX, y: clampedY });
      } else {
        onSelect(node.id);
      }
    },
  });

  const componentStyle = {
    backgroundColor: node.props.style.backgroundColor || 'transparent',
    borderRadius: node.props.style.borderRadius || 0,
    padding: node.props.style.padding || 0,
    opacity: node.props.style.opacity !== undefined ? node.props.style.opacity : 1,
    borderWidth: isSelected ? 0 : (node.props.style.borderWidth || 0),
    borderColor: node.props.style.borderColor || 'transparent',
  };

  return (
    <Animated.View
      style={[
        compStyles.wrapper,
        {
          left: pan.x,
          top: pan.y,
          width: node.props.width,
          height: node.props.height,
        },
        componentStyle,
        isSelected && compStyles.selectedBorder,
      ]}
      {...panResponder.panHandlers}
    >
      <ComponentContent node={node} />
      {isSelected && (
        <>
          <View style={[compStyles.handle, compStyles.handleTL]} />
          <View style={[compStyles.handle, compStyles.handleTR]} />
          <View style={[compStyles.handle, compStyles.handleBL]} />
          <View style={[compStyles.handle, compStyles.handleBR]} />
        </>
      )}
    </Animated.View>
  );
};

const ComponentContent: React.FC<{ node: ComponentNode }> = ({ node }) => {
  const { type, props } = node;

  switch (type) {
    case ComponentType.Text:
      return (
        <Text style={{ color: props.style.color || '#FFF', fontSize: props.style.fontSize || 14 }} numberOfLines={3}>
          {props.text || 'Text'}
        </Text>
      );
    case ComponentType.Button:
      return (
        <View style={[compStyles.buttonContent, { borderRadius: props.style.borderRadius || 8 }]}>
          <Text style={compStyles.buttonLabel}>{props.label || 'Button'}</Text>
        </View>
      );
    case ComponentType.TextInput:
      return (
        <View style={compStyles.inputPreview}>
          <Text style={compStyles.inputPlaceholder}>{props.placeholder || 'Enter text...'}</Text>
        </View>
      );
    case ComponentType.Switch:
      return (
        <View style={compStyles.switchPreview}>
          <Text style={compStyles.switchLabel}>{props.label || 'Toggle'}</Text>
          <View style={[compStyles.switchTrack, props.value ? compStyles.switchTrackOn : compStyles.switchTrackOff]}>
            <View style={[compStyles.switchThumb, props.value ? compStyles.switchThumbOn : compStyles.switchThumbOff]} />
          </View>
        </View>
      );
    case ComponentType.Slider:
      return (
        <View style={compStyles.sliderPreview}>
          <View style={compStyles.sliderTrack}>
            <View style={[compStyles.sliderFill, { width: '50%' }]} />
          </View>
          <View style={compStyles.sliderThumb} />
        </View>
      );
    case ComponentType.Image:
      return (
        <View style={compStyles.imagePlaceholder}>
          <Text style={compStyles.imagePlaceholderText}>IMG</Text>
        </View>
      );
    case ComponentType.Icon:
      return (
        <View style={compStyles.iconPreview}>
          <Text style={[compStyles.iconText, { color: props.style.color || '#007AFF' }]}>★</Text>
        </View>
      );
    case ComponentType.FlatList:
      return (
        <View style={compStyles.listPreview}>
          {['Item 1', 'Item 2', 'Item 3'].map((item, i) => (
            <View key={i} style={compStyles.listItem}>
              <Text style={compStyles.listItemText}>{item}</Text>
            </View>
          ))}
        </View>
      );
    case ComponentType.SectionList:
      return (
        <View style={compStyles.listPreview}>
          <View style={compStyles.sectionHeader}>
            <Text style={compStyles.sectionHeaderText}>Section</Text>
          </View>
          <View style={compStyles.listItem}><Text style={compStyles.listItemText}>Item 1</Text></View>
          <View style={compStyles.listItem}><Text style={compStyles.listItemText}>Item 2</Text></View>
        </View>
      );
    case ComponentType.Picker:
      return (
        <View style={compStyles.pickerPreview}>
          <Text style={compStyles.pickerText}>{props.selectedValue || 'Select...'}</Text>
          <Text style={compStyles.pickerArrow}>⌄</Text>
        </View>
      );
    default:
      return (
        <View style={compStyles.containerLabel}>
          <Text style={compStyles.containerLabelText}>{type}</Text>
        </View>
      );
  }
};

export const GridBackground: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const dots = [];
  for (let x = GRID_SIZE; x < width; x += GRID_SIZE * 2) {
    for (let y = GRID_SIZE; y < height; y += GRID_SIZE * 2) {
      dots.push(<View key={`${x}-${y}`} style={[compStyles.gridDot, { left: x, top: y }]} />);
    }
  }
  return <View style={StyleSheet.absoluteFill}>{dots}</View>;
};

export const DeviceFrame: React.FC = () => (
  <View style={compStyles.deviceFrame} pointerEvents="none">
    <View style={compStyles.deviceScreen}>
      <View style={compStyles.notch} />
    </View>
    <View style={compStyles.homeIndicator} />
  </View>
);

const compStyles = StyleSheet.create({
  wrapper: { position: 'absolute', overflow: 'hidden' },
  selectedBorder: { borderWidth: 2, borderColor: '#007AFF' },
  handle: { position: 'absolute', width: 8, height: 8, backgroundColor: '#007AFF', borderRadius: 4 },
  handleTL: { top: -4, left: -4 },
  handleTR: { top: -4, right: -4 },
  handleBL: { bottom: -4, left: -4 },
  handleBR: { bottom: -4, right: -4 },
  gridDot: { position: 'absolute', width: 1, height: 1, backgroundColor: '#3A3A3C', borderRadius: 0.5 },
  deviceFrame: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderWidth: 3, borderColor: '#48484A', borderRadius: 44, overflow: 'hidden' },
  deviceScreen: { flex: 1, alignItems: 'center' },
  notch: { width: NOTCH_WIDTH, height: NOTCH_HEIGHT, backgroundColor: '#000', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  homeIndicator: { width: 134, height: 5, backgroundColor: '#48484A', borderRadius: 3, alignSelf: 'center', marginBottom: 8 },
  buttonContent: { flex: 1, backgroundColor: '#007AFF', alignItems: 'center', justifyContent: 'center' },
  buttonLabel: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  inputPreview: { flex: 1, backgroundColor: '#3A3A3C', borderRadius: 8, paddingHorizontal: 10, justifyContent: 'center', borderWidth: 1, borderColor: '#545458' },
  inputPlaceholder: { color: '#636366', fontSize: 14 },
  switchPreview: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4 },
  switchLabel: { color: '#FFF', fontSize: 13 },
  switchTrack: { width: 51, height: 31, borderRadius: 15.5, padding: 2 },
  switchTrackOn: { backgroundColor: '#34C759' },
  switchTrackOff: { backgroundColor: '#48484A' },
  switchThumb: { width: 27, height: 27, borderRadius: 13.5, backgroundColor: '#FFF' },
  switchThumbOn: { alignSelf: 'flex-end' },
  switchThumbOff: { alignSelf: 'flex-start' },
  sliderPreview: { flex: 1, justifyContent: 'center', paddingHorizontal: 6 },
  sliderTrack: { height: 4, backgroundColor: '#3A3A3C', borderRadius: 2, overflow: 'hidden' },
  sliderFill: { height: '100%', backgroundColor: '#007AFF' },
  sliderThumb: { position: 'absolute', width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFF', left: '50%', top: '50%', marginLeft: -11, marginTop: -11 },
  imagePlaceholder: { flex: 1, backgroundColor: '#3A3A3C', alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  imagePlaceholderText: { color: '#636366', fontSize: 20, fontWeight: '600' },
  iconPreview: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 24 },
  listPreview: { flex: 1, overflow: 'hidden' },
  listItem: { paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: '#3A3A3C' },
  listItemText: { color: '#FFF', fontSize: 13 },
  sectionHeader: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#3A3A3C' },
  sectionHeaderText: { color: '#8E8E93', fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  pickerPreview: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, backgroundColor: '#3A3A3C', borderRadius: 8 },
  pickerText: { color: '#FFF', fontSize: 14 },
  pickerArrow: { color: '#8E8E93', fontSize: 16 },
  containerLabel: { flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#48484A', borderStyle: 'dashed', borderRadius: 4 },
  containerLabelText: { color: '#636366', fontSize: 11 },
});
