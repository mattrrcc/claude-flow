import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Share,
  Alert,
  Clipboard,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { CodeBlock } from '../components/CodeBlock';
import { RootStackParamList } from '../types';

type CodePreviewScreenProps = StackScreenProps<RootStackParamList, 'CodePreview'>;

type TabType = 'swiftui' | 'swift';

const CodePreviewScreen: React.FC<CodePreviewScreenProps> = ({ navigation, route }) => {
  const { code } = route.params;
  const [activeTab, setActiveTab] = useState<TabType>('swiftui');

  const currentCode = activeTab === 'swiftui' ? code.swiftui : code.swift;

  const handleCopy = useCallback(() => {
    if (Platform.OS === 'ios') {
      Clipboard.setString(currentCode);
      Alert.alert('Copied', 'Code copied to clipboard');
    } else {
      Clipboard.setString(currentCode);
      Alert.alert('Copied', 'Code copied to clipboard');
    }
  }, [currentCode]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: currentCode,
        title: activeTab === 'swiftui' ? 'SwiftUI Code' : 'UIKit Code',
      });
    } catch {
      Alert.alert('Error', 'Could not share code');
    }
  }, [currentCode, activeTab]);

  const lineCount = currentCode.split('\n').length;
  const charCount = currentCode.length;

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

        <Text style={styles.headerTitle}>Code Preview</Text>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCopy} activeOpacity={0.7}>
            <Text style={styles.actionButtonText}>Copy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.exportButton]} onPress={handleShare} activeOpacity={0.7}>
            <Text style={[styles.actionButtonText, styles.exportButtonText]}>Export</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'swiftui' && styles.tabActive]}
          onPress={() => setActiveTab('swiftui')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'swiftui' && styles.tabTextActive]}>
            SwiftUI
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'swift' && styles.tabActive]}
          onPress={() => setActiveTab('swift')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'swift' && styles.tabTextActive]}>
            UIKit
          </Text>
        </TouchableOpacity>

        <View style={styles.codeStats}>
          <Text style={styles.statsText}>{lineCount} lines</Text>
          <Text style={styles.statsDivider}> · </Text>
          <Text style={styles.statsText}>{charCount} chars</Text>
        </View>
      </View>

      <View style={styles.codeContainer}>
        <CodeBlock code={currentCode} language={activeTab} />
      </View>

      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <View style={styles.frameworkBadge}>
            <Text style={styles.frameworkBadgeText}>
              {activeTab === 'swiftui' ? '🍎 SwiftUI' : '📱 UIKit'}
            </Text>
          </View>
          <Text style={styles.footerNote}>
            {activeTab === 'swiftui'
              ? 'iOS 16+ · Xcode 14+'
              : 'iOS 13+ · UIKit'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.openInXcodeButton}
          onPress={() => Alert.alert('Xcode', 'Copy the code and paste it into a new Xcode project.')}
          activeOpacity={0.7}
        >
          <Text style={styles.openInXcodeText}>How to use →</Text>
        </TouchableOpacity>
      </View>
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: '#3A3A3C',
    borderRadius: 8,
  },
  exportButton: {
    backgroundColor: '#007AFF',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  exportButtonText: {
    color: '#FFFFFF',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2C2C2E',
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#3A3A3C',
  },
  tabActive: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    color: '#8E8E93',
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  codeStats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  statsText: {
    color: '#636366',
    fontSize: 11,
  },
  statsDivider: {
    color: '#3A3A3C',
    fontSize: 11,
  },
  codeContainer: {
    flex: 1,
    margin: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2C2C2E',
    borderTopWidth: 1,
    borderTopColor: '#3A3A3C',
  },
  footerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  frameworkBadge: {
    backgroundColor: '#3A3A3C',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  frameworkBadgeText: {
    color: '#EBEBF5',
    fontSize: 12,
    fontWeight: '500',
  },
  footerNote: {
    color: '#636366',
    fontSize: 11,
  },
  openInXcodeButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: '#3A3A3C',
    borderRadius: 8,
  },
  openInXcodeText: {
    color: '#007AFF',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default CodePreviewScreen;
