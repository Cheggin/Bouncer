import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { DesignTokens } from '@/constants/Colors';

interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  type: 'log' | 'error' | 'warn' | 'info';
  emoji?: string;
  filtered?: boolean;
}

interface ActivityLoggerProps {
  maxLogs?: number;
}

export default function ActivityLogger({ maxLogs = 100 }: ActivityLoggerProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [showFiltered, setShowFiltered] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const originalConsole = useRef({
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info,
  });

  // Patterns to filter out (hide by default)
  const filterPatterns = [
    /Request timed out after \d+ seconds/,
    /timeout/i,
    /Error stack:/,
    /at http:\/\/localhost/,
    /node_modules\/expo-router/,
    /transform\.routerRoot/,
  ];

  const shouldFilterLog = (message: string): boolean => {
    return filterPatterns.some(pattern => pattern.test(message));
  };

  useEffect(() => {
    // Override console methods to capture logs
    const addLog = (message: string, type: 'log' | 'error' | 'warn' | 'info') => {
      const emoji = extractEmoji(message);
      const filtered = shouldFilterLog(message);
      
      const newLog: LogEntry = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        message: message,
        type,
        emoji,
        filtered,
      };

      setLogs(prevLogs => {
        const updatedLogs = [...prevLogs, newLog];
        return updatedLogs.slice(-maxLogs); // Keep only the last maxLogs entries
      });

      // Auto-scroll to bottom (only if not filtered or if showing filtered)
      if (!filtered || showFiltered) {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    };

    // Override console methods
    console.log = (...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      addLog(message, 'log');
      originalConsole.current.log(...args);
    };

    console.error = (...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      addLog(message, 'error');
      originalConsole.current.error(...args);
    };

    console.warn = (...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      addLog(message, 'warn');
      originalConsole.current.warn(...args);
    };

    console.info = (...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      addLog(message, 'info');
      originalConsole.current.info(...args);
    };

    // Cleanup function to restore original console methods
    return () => {
      console.log = originalConsole.current.log;
      console.error = originalConsole.current.error;
      console.warn = originalConsole.current.warn;
      console.info = originalConsole.current.info;
    };
  }, [maxLogs, showFiltered]);

  const extractEmoji = (message: string): string | undefined => {
    // Extract emoji from the beginning of the message
    const emojiMatch = message.match(/^([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/u);
    return emojiMatch ? emojiMatch[1] : undefined;
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  const getLogStyle = (type: string) => {
    switch (type) {
      case 'error':
        return styles.errorLog;
      case 'warn':
        return styles.warnLog;
      case 'info':
        return styles.infoLog;
      default:
        return styles.defaultLog;
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const toggleFilteredLogs = () => {
    setShowFiltered(!showFiltered);
  };

  // Filter logs based on showFiltered setting
  const displayedLogs = showFiltered ? logs : logs.filter(log => !log.filtered);
  const filteredCount = logs.filter(log => log.filtered).length;

  if (!isVisible) {
    return (
      <TouchableOpacity style={styles.toggleButton} onPress={toggleVisibility}>
        <ThemedText style={styles.toggleButtonText}>Show Activity Logger</ThemedText>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>
          Activity Logger {filteredCount > 0 && !showFiltered && `(${filteredCount} filtered)`}
        </ThemedText>
        <View style={styles.headerButtons}>
          {filteredCount > 0 && (
            <TouchableOpacity 
              style={[styles.filterButton, showFiltered && styles.filterButtonActive]} 
              onPress={toggleFilteredLogs}
            >
              <ThemedText style={styles.buttonText}>
                {showFiltered ? 'Hide Noise' : 'Show All'}
              </ThemedText>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.clearButton} onPress={clearLogs}>
            <ThemedText style={styles.buttonText}>Clear</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.hideButton} onPress={toggleVisibility}>
            <ThemedText style={styles.buttonText}>Hide</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Logs */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.logsContainer}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
      >
        {displayedLogs.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>
              {logs.length === 0 ? 'No logs yet...' : 'All logs filtered out'}
            </ThemedText>
            <ThemedText style={styles.emptySubtext}>
              {logs.length === 0 
                ? 'Interact with the app to see Activity information'
                : 'Click "Show All" to see filtered logs'
              }
            </ThemedText>
          </View>
        ) : (
          displayedLogs.map((log) => (
            <View key={log.id} style={[styles.logEntry, log.filtered && styles.filteredLogEntry]}>
              <View style={styles.logHeader}>
                <Text style={styles.timestamp}>{formatTime(log.timestamp)}</Text>
                {log.emoji && <Text style={styles.emoji}>{log.emoji}</Text>}
                <Text style={[styles.logType, getLogStyle(log.type)]}>
                  {log.type.toUpperCase()}
                </Text>
                {log.filtered && (
                  <Text style={styles.filteredBadge}>FILTERED</Text>
                )}
              </View>
              <Text style={styles.logMessage}>{log.message}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: DesignTokens.colors['black-900'],
    borderLeftWidth: 2,
    borderLeftColor: DesignTokens.colors['accent-gray'],
    width: '50%', // Takes up half the screen width
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: DesignTokens.colors['black-800'],
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.colors['gray-600'],
  },
  headerTitle: {
    color: DesignTokens.colors['white-000'],
    fontSize: 14,
    fontFamily: DesignTokens.typography.fontFamily.semiBold,
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  filterButton: {
    backgroundColor: DesignTokens.colors['gray-600'],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  filterButtonActive: {
    backgroundColor: DesignTokens.colors['warning'],
  },
  clearButton: {
    backgroundColor: DesignTokens.colors['gray-600'],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  hideButton: {
    backgroundColor: DesignTokens.colors['accent-gray'],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  buttonText: {
    color: DesignTokens.colors['white-000'],
    fontSize: 10,
    fontFamily: DesignTokens.typography.fontFamily.medium,
  },
  toggleButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: DesignTokens.colors['accent-gray'],
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  toggleButtonText: {
    color: DesignTokens.colors['white-000'],
    fontSize: 14,
    fontFamily: DesignTokens.typography.fontFamily.medium,
  },
  logsContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: DesignTokens.colors['gray-400'],
    fontSize: 14,
    marginBottom: 8,
  },
  emptySubtext: {
    color: DesignTokens.colors['gray-500'],
    fontSize: 12,
    textAlign: 'center',
  },
  logEntry: {
    backgroundColor: DesignTokens.colors['gray-800'],
    borderRadius: 6,
    padding: 10,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: DesignTokens.colors['gray-600'],
  },
  filteredLogEntry: {
    opacity: 0.6,
    borderLeftColor: DesignTokens.colors['warning'],
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  timestamp: {
    color: DesignTokens.colors['gray-400'],
    fontSize: 9,
    fontFamily: 'monospace',
  },
  emoji: {
    fontSize: 12,
  },
  logType: {
    fontSize: 8,
    fontFamily: DesignTokens.typography.fontFamily.semiBold,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  filteredBadge: {
    fontSize: 8,
    fontFamily: DesignTokens.typography.fontFamily.semiBold,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    backgroundColor: DesignTokens.colors['warning'],
    color: DesignTokens.colors['black-900'],
  },
  defaultLog: {
    backgroundColor: DesignTokens.colors['gray-600'],
    color: DesignTokens.colors['white-000'],
  },
  errorLog: {
    backgroundColor: DesignTokens.colors['error'],
    color: DesignTokens.colors['white-000'],
  },
  warnLog: {
    backgroundColor: DesignTokens.colors['warning'],
    color: DesignTokens.colors['black-900'],
  },
  infoLog: {
    backgroundColor: DesignTokens.colors['accent-gray'],
    color: DesignTokens.colors['white-000'],
  },
  logMessage: {
    color: DesignTokens.colors['gray-200'],
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
}); 