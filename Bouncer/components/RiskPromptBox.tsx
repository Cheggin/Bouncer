import React, { useState, useRef } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, PanResponder } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DesignTokens } from '@/constants/Colors';
import { CommonStyles } from '@/constants/Styles';

interface RiskPromptBoxProps {
  onThresholdsChange?: (low: number, high: number) => void;
  onPromptChange?: (prompt: string) => void;
  initialLowThreshold?: number;
  initialHighThreshold?: number;
}

export default function RiskPromptBox({ 
  onThresholdsChange,
  onPromptChange,
  initialLowThreshold = 33,
  initialHighThreshold = 66
}: RiskPromptBoxProps) {
  const [prompt, setPrompt] = useState('You are a risk assessment AI analyzing user data for potential security threats. Analyze the following user information and provide a risk score from 0-100.');
  const [lowThreshold, setLowThreshold] = useState(initialLowThreshold);
  const [highThreshold, setHighThreshold] = useState(initialHighThreshold);
  const [activeHandle, setActiveHandle] = useState<'low' | 'high' | null>(null);
  const sliderRef = useRef<View>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [trackLeft, setTrackLeft] = useState(0);
  
  const handleWidth = 20;
  const sliderWidth = trackWidth > 0 ? trackWidth - handleWidth : 0;

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  // Update thresholds when initial values change
  React.useEffect(() => {
    setLowThreshold(initialLowThreshold);
    setHighThreshold(initialHighThreshold);
  }, [initialLowThreshold, initialHighThreshold]);

  // Notify parent when prompt changes
  const handlePromptChange = (newPrompt: string) => {
    setPrompt(newPrompt);
    if (onPromptChange) {
      onPromptChange(newPrompt);
    }
    console.log('📝 Claude prompt updated:', newPrompt);
  };

  // Notify parent when thresholds change
  const updateThresholds = (newLow: number, newHigh: number) => {
    // Keep raw float values in state for precise positioning
    setLowThreshold(newLow);
    setHighThreshold(newHigh);

    // Pass rounded integer values to parent component
    if (onThresholdsChange) {
      onThresholdsChange(Math.round(newLow), Math.round(newHigh));
    }
  };

  // Function to get risk level label and color based on thresholds
  const getRiskInfo = (level: number) => {
    if (level <= lowThreshold) {
      return { label: 'Low Risk', color: '#44aa44' };
    } else if (level <= highThreshold) {
      return { label: 'Medium Risk', color: '#ffaa00' };
    } else {
      return { label: 'High Risk', color: '#ff4444' };
    }
  };

  // Function to calculate percentage from absolute position
  const calculatePercentage = (absoluteX: number) => {
    if (sliderWidth <= 0) return 0;
    const relativeX = absoluteX - trackLeft;
    return Math.max(0, Math.min(100, (relativeX / sliderWidth) * 100));
  };

  // Function to handle slider press (only on the track)
  const handleSliderPress = (event: any) => {
    const { locationX } = event.nativeEvent;
    const percentage = calculatePercentage(locationX);
    
    // Determine which handle to move based on proximity
    const lowDistance = Math.abs(percentage - lowThreshold);
    const highDistance = Math.abs(percentage - highThreshold);
    
    if (lowDistance < highDistance) {
      const newLow = percentage;
      if (newLow < highThreshold - 5) {
        updateThresholds(newLow, highThreshold);
      }
    } else {
      const newHigh = percentage;
      if (newHigh > lowThreshold + 5) {
        updateThresholds(lowThreshold, newHigh);
      }
    }
  };

  // PanResponder for low handle
  const lowHandlePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      setActiveHandle('low');
    },
    onPanResponderMove: (evt, gestureState) => {
      if (sliderWidth <= 0) return;
      
      // Get the absolute position and calculate relative percentage
      const { pageX } = evt.nativeEvent;
      const percentage = calculatePercentage(pageX);
      const newLow = Math.max(0, Math.min(highThreshold - 5, percentage));
      updateThresholds(newLow, highThreshold);
    },
    onPanResponderRelease: () => {
      setActiveHandle(null);
    },
  });

  // PanResponder for high handle
  const highHandlePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      setActiveHandle('high');
    },
    onPanResponderMove: (evt, gestureState) => {
      if (sliderWidth <= 0) return;
      
      // Get the absolute position and calculate relative percentage
      const { pageX } = evt.nativeEvent;
      const percentage = calculatePercentage(pageX);
      const newHigh = Math.max(lowThreshold + 5, Math.min(100, percentage));
      updateThresholds(lowThreshold, newHigh);
    },
    onPanResponderRelease: () => {
      setActiveHandle(null);
    },
  });

  return (
    <View style={styles.container}>
      <ThemedText type="h2" style={styles.title}>
        Risk Assessment Configuration
      </ThemedText>
      
      <ThemedText type="body" style={styles.description}>
        Configure the Claude prompt and risk level thresholds for assessment.
      </ThemedText>

      {/* Claude Prompt Input */}
      <View style={styles.inputContainer}>
        <ThemedText type="body" style={styles.inputLabel}>
          Claude Analysis Prompt
        </ThemedText>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your prompt for Claude analysis..."
          placeholderTextColor={DesignTokens.colors['gray-400']}
          value={prompt}
          onChangeText={handlePromptChange}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        <ThemedText type="small" style={styles.inputHint}>
          This prompt will be used when calculating risk scores. Leave blank to use the default prompt.
        </ThemedText>
      </View>

      {/* Dual Handle Risk Level Slider */}
      <View style={styles.sliderContainer}>
        <ThemedText type="h3" style={styles.sliderLabel}>
          Risk Level Thresholds
        </ThemedText>
        
        <View 
          style={styles.sliderWrapper}
          ref={sliderRef}
          onLayout={(event) => {
            setTrackWidth(event.nativeEvent.layout.width);
            // Measure the absolute position of the slider track
            sliderRef.current?.measureInWindow((x, y, width, height) => {
              setTrackLeft(x);
            });
          }}
        >
          {/* Layered Color Bar */}
          <TouchableOpacity 
            style={styles.sliderTrack}
            onPress={handleSliderPress}
            activeOpacity={0.8}
          >
            {/* High Risk Zone (Base Layer) */}
            <View style={[styles.riskZone, { backgroundColor: '#ff4444' }]} />
            {/* Medium Risk Zone */}
            <View style={[styles.riskZone, { backgroundColor: '#ffaa00', width: `${highThreshold}%` }]} />
            {/* Low Risk Zone */}
            <View style={[styles.riskZone, { backgroundColor: '#44aa44', width: `${lowThreshold}%` }]} />
          </TouchableOpacity>

          {/* Low Threshold Handle */}
          <View
            style={[
              styles.sliderHandle,
              { left: `${lowThreshold}%`, transform: [{ translateX: -10 }] }
            ]}
            {...lowHandlePanResponder.panHandlers}
          >
            <View style={styles.sliderHandleLine} />
          </View>
          
          {/* High Threshold Handle */}
          <View
            style={[
              styles.sliderHandle,
              { left: `${highThreshold}%`, transform: [{ translateX: -10 }] }
            ]}
            {...highHandlePanResponder.panHandlers}
          >
            <View style={styles.sliderHandleLine} />
          </View>
        </View>
        
        {/* Threshold Labels */}
        <View style={styles.thresholdLabels}>
          <ThemedText type="small" style={styles.thresholdText}>
            Low: 0-{Math.round(lowThreshold)}
          </ThemedText>
          <ThemedText type="small" style={styles.thresholdText}>
            Medium: {Math.round(lowThreshold) + 1}-{Math.round(highThreshold)}
          </ThemedText>
          <ThemedText type="small" style={styles.thresholdText}>
            High: {Math.round(highThreshold) + 1}-100
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...CommonStyles.cardProfessional,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
    color: DesignTokens.colors['white-000'],
    fontSize: DesignTokens.typography.fontSize.h3,
    fontFamily: DesignTokens.typography.fontFamily.semiBold,
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
    color: DesignTokens.colors['gray-400'],
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 32,
  },
  inputLabel: {
    marginBottom: 8,
    color: DesignTokens.colors['gray-200'],
    fontSize: DesignTokens.typography.fontSize.small,
    fontFamily: DesignTokens.typography.fontFamily.medium,
  },
  textInput: {
    ...CommonStyles.input,
    minHeight: 120,
    paddingTop: 16,
  },
  inputHint: {
    marginTop: 8,
    color: DesignTokens.colors['gray-500'],
    fontStyle: 'italic',
    lineHeight: 18,
  },
  sliderContainer: {
    marginBottom: 24,
  },
  sliderLabel: {
    textAlign: 'center',
    marginBottom: 20,
    color: DesignTokens.colors['gray-200'],
  },
  sliderWrapper: {
    position: 'relative',
    marginBottom: 16,
    height: 60,
    justifyContent: 'center',
  },
  sliderTrack: {
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  riskZone: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  sliderHandle: {
    position: 'absolute',
    width: 20,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    paddingHorizontal: 5,
  },
  sliderHandleLine: {
    width: 18,
    height: 50,
    borderRadius: 9,
    backgroundColor: DesignTokens.colors['white-000'],
    shadowColor: DesignTokens.colors['accent-gray'],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  thresholdLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  thresholdText: {
    color: DesignTokens.colors['gray-400'],
    textAlign: 'center',
    flex: 1,
  },
}); 