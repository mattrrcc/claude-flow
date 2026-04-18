import { useState, useCallback } from 'react';
import { ComponentNode, ComponentType, ComponentProps, BuilderState } from '../types';
import { COMPONENT_DEFINITIONS, DEFAULT_CANVAS_SIZE } from '../utils/componentDefaults';

let nodeIdCounter = 1;

function generateId(): string {
  return `node_${nodeIdCounter++}_${Date.now()}`;
}

function findNode(nodes: ComponentNode[], id: string): ComponentNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    const found = findNode(node.children, id);
    if (found) return found;
  }
  return null;
}

function updateNodeInTree(
  nodes: ComponentNode[],
  id: string,
  updater: (node: ComponentNode) => ComponentNode
): ComponentNode[] {
  return nodes.map(node => {
    if (node.id === id) return updater(node);
    return { ...node, children: updateNodeInTree(node.children, id, updater) };
  });
}

function removeNodeFromTree(nodes: ComponentNode[], id: string): ComponentNode[] {
  return nodes
    .filter(node => node.id !== id)
    .map(node => ({ ...node, children: removeNodeFromTree(node.children, id) }));
}

const initialState: BuilderState = {
  components: [],
  selectedId: null,
  canvasSize: DEFAULT_CANVAS_SIZE,
  zoom: 1,
  showDeviceFrame: true,
  undoStack: [],
  redoStack: [],
};

export function useBuilderStore() {
  const [state, setState] = useState<BuilderState>(initialState);

  const pushUndo = useCallback((components: ComponentNode[]) => {
    setState(prev => ({
      ...prev,
      undoStack: [...prev.undoStack.slice(-19), components],
      redoStack: [],
    }));
  }, []);

  const addComponent = useCallback((type: ComponentType, position?: { x: number; y: number }) => {
    const definition = COMPONENT_DEFINITIONS.find(def => def.type === type);
    if (!definition) return;

    const newNode: ComponentNode = {
      id: generateId(),
      type,
      props: {
        x: position?.x ?? definition.defaultProps.x ?? 100,
        y: position?.y ?? definition.defaultProps.y ?? 100,
        width: definition.defaultProps.width ?? 200,
        height: definition.defaultProps.height ?? 60,
        style: { ...definition.defaultProps.style },
        label: definition.defaultProps.label,
        text: definition.defaultProps.text,
        placeholder: definition.defaultProps.placeholder,
        value: definition.defaultProps.value,
        systemIconName: definition.defaultProps.systemIconName,
        minimumValue: definition.defaultProps.minimumValue,
        maximumValue: definition.defaultProps.maximumValue,
        step: definition.defaultProps.step,
        data: definition.defaultProps.data,
        selectedValue: definition.defaultProps.selectedValue,
      },
      children: [],
    };

    setState(prev => {
      pushUndo(prev.components);
      return {
        ...prev,
        components: [...prev.components, newNode],
        selectedId: newNode.id,
      };
    });
  }, [pushUndo]);

  const removeComponent = useCallback((id: string) => {
    setState(prev => {
      pushUndo(prev.components);
      return {
        ...prev,
        components: removeNodeFromTree(prev.components, id),
        selectedId: prev.selectedId === id ? null : prev.selectedId,
      };
    });
  }, [pushUndo]);

  const selectComponent = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedId: id }));
  }, []);

  const updateProps = useCallback((id: string, props: Partial<ComponentProps>) => {
    setState(prev => {
      pushUndo(prev.components);
      return {
        ...prev,
        components: updateNodeInTree(prev.components, id, node => ({
          ...node,
          props: { ...node.props, ...props },
        })),
      };
    });
  }, [pushUndo]);

  const updateStyle = useCallback((id: string, style: Partial<ComponentProps['style']>) => {
    setState(prev => {
      pushUndo(prev.components);
      return {
        ...prev,
        components: updateNodeInTree(prev.components, id, node => ({
          ...node,
          props: {
            ...node.props,
            style: { ...node.props.style, ...style },
          },
        })),
      };
    });
  }, [pushUndo]);

  const moveComponent = useCallback((id: string, x: number, y: number) => {
    setState(prev => ({
      ...prev,
      components: updateNodeInTree(prev.components, id, node => ({
        ...node,
        props: { ...node.props, x, y },
      })),
    }));
  }, []);

  const reorderChildren = useCallback((parentId: string, childIds: string[]) => {
    setState(prev => {
      pushUndo(prev.components);
      return {
        ...prev,
        components: updateNodeInTree(prev.components, parentId, node => {
          const reordered = childIds
            .map(cid => node.children.find(c => c.id === cid))
            .filter((c): c is ComponentNode => c !== undefined);
          return { ...node, children: reordered };
        }),
      };
    });
  }, [pushUndo]);

  const setZoom = useCallback((zoom: number) => {
    setState(prev => ({ ...prev, zoom: Math.max(0.25, Math.min(3, zoom)) }));
  }, []);

  const toggleDeviceFrame = useCallback(() => {
    setState(prev => ({ ...prev, showDeviceFrame: !prev.showDeviceFrame }));
  }, []);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.undoStack.length === 0) return prev;
      const undoStack = [...prev.undoStack];
      const components = undoStack.pop()!;
      return {
        ...prev,
        components,
        undoStack,
        redoStack: [prev.components, ...prev.redoStack.slice(0, 19)],
        selectedId: null,
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.redoStack.length === 0) return prev;
      const redoStack = [...prev.redoStack];
      const components = redoStack.shift()!;
      return {
        ...prev,
        components,
        redoStack,
        undoStack: [...prev.undoStack.slice(-19), prev.components],
        selectedId: null,
      };
    });
  }, []);

  const clearCanvas = useCallback(() => {
    setState(prev => {
      pushUndo(prev.components);
      return { ...prev, components: [], selectedId: null };
    });
  }, [pushUndo]);

  const getSelectedNode = useCallback((): ComponentNode | null => {
    if (!state.selectedId) return null;
    return findNode(state.components, state.selectedId);
  }, [state.components, state.selectedId]);

  return {
    state,
    addComponent,
    removeComponent,
    selectComponent,
    updateProps,
    updateStyle,
    moveComponent,
    reorderChildren,
    setZoom,
    toggleDeviceFrame,
    undo,
    redo,
    clearCanvas,
    getSelectedNode,
  };
}

export type BuilderStore = ReturnType<typeof useBuilderStore>;
