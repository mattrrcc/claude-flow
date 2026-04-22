import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';

interface CodeBlockProps {
  code: string;
  language: 'swift' | 'swiftui';
}

interface Token {
  text: string;
  color: string;
}

const COLORS = {
  keyword: '#FC5FA3',
  type: '#5DD8FF',
  string: '#FC6A5D',
  number: '#D9C97C',
  comment: '#6C7986',
  modifier: '#67B7A4',
  plain: '#EBEBF5',
  punctuation: '#EBEBF5',
  attribute: '#9FA8FB',
};

const SWIFT_KEYWORDS = new Set([
  'import', 'struct', 'class', 'func', 'var', 'let', 'if', 'else', 'for', 'in',
  'return', 'self', 'override', 'private', 'super', 'some', 'body', 'true', 'false',
  'nil', 'guard', 'switch', 'case', 'default', 'break', 'continue', 'where', 'init',
]);

const SWIFTUI_TYPES = new Set([
  'View', 'Text', 'Image', 'Button', 'TextField', 'Toggle', 'Slider', 'List',
  'VStack', 'HStack', 'ZStack', 'ScrollView', 'NavigationView', 'NavigationStack',
  'Picker', 'Section', 'EmptyView', 'Color', 'Font', 'ContentView',
  'UIViewController', 'UIView', 'UILabel', 'UIButton', 'UITextField',
  'CGRect', 'UIColor', 'UIFont',
]);

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < line.length) {
    if (line[i] === '/' && line[i + 1] === '/') {
      tokens.push({ text: line.slice(i), color: COLORS.comment });
      break;
    }

    if (line[i] === '@') {
      const end = line.slice(i + 1).search(/[^a-zA-Z_]/) + i + 1;
      tokens.push({ text: line.slice(i, end === i ? line.length : end), color: COLORS.attribute });
      i = end === i ? line.length : end;
      continue;
    }

    if (line[i] === '"') {
      let j = i + 1;
      while (j < line.length && !(line[j] === '"' && line[j - 1] !== '\\')) j++;
      tokens.push({ text: line.slice(i, j + 1), color: COLORS.string });
      i = j + 1;
      continue;
    }

    if (/\d/.test(line[i]) && (i === 0 || /\W/.test(line[i - 1]))) {
      let j = i;
      while (j < line.length && /[\d.]/.test(line[j])) j++;
      tokens.push({ text: line.slice(i, j), color: COLORS.number });
      i = j;
      continue;
    }

    if (/[a-zA-Z_]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[a-zA-Z0-9_]/.test(line[j])) j++;
      const word = line.slice(i, j);
      let color = COLORS.plain;
      if (SWIFT_KEYWORDS.has(word)) color = COLORS.keyword;
      else if (SWIFTUI_TYPES.has(word)) color = COLORS.type;
      else if (/^[A-Z]/.test(word)) color = COLORS.type;
      else if (line[j] === '(') color = COLORS.modifier;
      tokens.push({ text: word, color });
      i = j;
      continue;
    }

    if (/[.{}()[\]:,]/.test(line[i])) {
      tokens.push({ text: line[i], color: COLORS.punctuation });
      i++;
      continue;
    }

    tokens.push({ text: line[i], color: COLORS.plain });
    i++;
  }

  return tokens;
}

const SyntaxLine: React.FC<{ line: string; lineNum: number }> = ({ line, lineNum }) => {
  const tokens = useMemo(() => tokenizeLine(line), [line]);

  return (
    <View style={styles.codeLine}>
      <Text style={styles.lineNumber}>{String(lineNum).padStart(3, ' ')}</Text>
      <Text style={styles.codeText}>
        {tokens.map((token, i) => (
          <Text key={i} style={{ color: token.color }}>
            {token.text}
          </Text>
        ))}
      </Text>
    </View>
  );
};

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const lines = code.split('\n');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.trafficLights}>
          <View style={[styles.dot, { backgroundColor: '#FF5F57' }]} />
          <View style={[styles.dot, { backgroundColor: '#FEBC2E' }]} />
          <View style={[styles.dot, { backgroundColor: '#28C840' }]} />
        </View>
        <Text style={styles.filename}>
          ContentView.{language === 'swiftui' ? 'swift' : 'swift'}
        </Text>
        <View style={styles.languageBadge}>
          <Text style={styles.languageText}>
            {language === 'swiftui' ? 'SwiftUI' : 'UIKit'}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.codeScroll}
        showsVerticalScrollIndicator
        showsHorizontalScrollIndicator
        horizontal={false}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <View style={styles.codeContainer}>
            {lines.map((line, index) => (
              <SyntaxLine key={index} line={line} lineNum={index + 1} />
            ))}
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  header: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252535',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  trafficLights: {
    flexDirection: 'row',
    gap: 6,
    marginRight: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  filename: {
    flex: 1,
    color: '#8E8E93',
    fontSize: 12,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
  languageBadge: {
    backgroundColor: '#007AFF22',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  languageText: {
    color: '#007AFF',
    fontSize: 10,
    fontWeight: '600',
  },
  codeScroll: {
    flex: 1,
  },
  codeContainer: {
    paddingVertical: 10,
  },
  codeLine: {
    flexDirection: 'row',
    minHeight: 20,
    paddingVertical: 1,
  },
  lineNumber: {
    color: '#48484A',
    fontSize: 12,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
    width: 40,
    textAlign: 'right',
    paddingRight: 16,
    paddingLeft: 8,
    flexShrink: 0,
  },
  codeText: {
    fontSize: 13,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
    lineHeight: 20,
  },
});
