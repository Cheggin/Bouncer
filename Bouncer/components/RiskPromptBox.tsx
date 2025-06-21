import React, { useState, useRef } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Alert, PanResponder, Dimensions } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

interface RiskPromptBoxProps {
  onRiskScoreGenerated?: (prompt: string, riskScore: number) => void;
  onThresholdsChange?: (low: number, high: number) => void;
  initialLowThreshold?: number;
  initialHighThreshold?: number;
}

export default function RiskPromptBox({ 
  onRiskScoreGenerated, 
  onThresholdsChange,
  initialLowThreshold = 33,
  initialHighThreshold = 66
}: RiskPromptBoxProps) {
  const [prompt, setPrompt] = useState('');
  const [lowThreshold, setLowThreshold] = useState(initialLowThreshold);
  const [highThreshold, setHighThreshold] = useState(initialHighThreshold);
  const [activeHandle, setActiveHandle] = useState<'low' | 'high' | null>(null);
  const sliderRef = useRef<View>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  
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

  // Function to handle slider press (only on the track)
  const handleSliderPress = (event: any) => {
    const { locationX } = event.nativeEvent;
    const percentage = Math.max(0, Math.min(100, (locationX / sliderWidth) * 100));
    
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
    onPanResponderGrant: () => {
      setActiveHandle('low');
    },
    onPanResponderMove: (evt, gestureState) => {
      if (sliderWidth <= 0) return;
      const { dx } = gestureState;
      const deltaPercentage = (dx / sliderWidth) * 100;
      const newLow = Math.max(0, Math.min(highThreshold - 5, lowThreshold + deltaPercentage));
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
    onPanResponderGrant: () => {
      setActiveHandle('high');
    },
    onPanResponderMove: (evt, gestureState) => {
      if (sliderWidth <= 0) return;
      const { dx } = gestureState;
      const deltaPercentage = (dx / sliderWidth) * 100;
      const newHigh = Math.max(lowThreshold + 5, Math.min(100, highThreshold + deltaPercentage));
      updateThresholds(lowThreshold, newHigh);
    },
    onPanResponderRelease: () => {
      setActiveHandle(null);
    },
  });

  // Function to generate risk score using Claude
  const generateRiskScore = async () => {
    if (!prompt.trim()) {
      Alert.alert('Error', 'Please enter a prompt first');
      return;
    }

    try {
      // Here you would integrate with Claude API
      // For now, we'll simulate the API call
      console.log('🤖 Sending prompt to Claude:', prompt);
      console.log('📊 Risk thresholds - Low:', lowThreshold, 'High:', highThreshold);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response - in real implementation, this would come from Claude
      const mockRiskScore = Math.floor(Math.random() * 100);
      
      Alert.alert(
        'Risk Score Generated', 
        `Prompt: "${prompt}"\nGenerated Risk Score: ${mockRiskScore}/100\nRisk Level: ${getRiskInfo(mockRiskScore).label}`
      );
      
      if (onRiskScoreGenerated) {
        onRiskScoreGenerated(prompt, mockRiskScore);
      }
      
    } catch (error) {
      console.error('❌ Error generating risk score:', error);
      Alert.alert('Error', 'Failed to generate risk score');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Risk Score Generator
      </ThemedText>
      
      <ThemedText style={styles.description}>
        Enter a prompt for Claude to analyze and generate a risk score.
      </ThemedText>

      {/* Prompt Input */}
      <View style={[styles.inputContainer, { borderColor: textColor + '40' }]}>
        <TextInput
          style={[styles.textInput, { color: textColor, backgroundColor }]}
          placeholder="Enter your prompt for Claude..."
          placeholderTextColor={textColor + '80'}
          value={prompt}
          onChangeText={setPrompt}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Dual Handle Risk Level Slider */}
      <View style={styles.sliderContainer}>
        <ThemedText style={styles.sliderLabel}>
          Set Risk Level Thresholds
        </ThemedText>
        
        <View 
          style={styles.sliderWrapper}
          onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
        >
          {/* Layered Color Bar */}
          <View style={styles.sliderTrack}>
            {/* High Risk Zone (Base Layer) */}
            <View style={[styles.riskZone, { backgroundColor: '#ff4444' }]} />
            {/* Medium Risk Zone */}
            <View style={[styles.riskZone, { backgroundColor: '#ffaa00', width: `${highThreshold}%` }]} />
            {/* Low Risk Zone */}
            <View style={[styles.riskZone, { backgroundColor: '#44aa44', width: `${lowThreshold}%` }]} />
          </View>

          {/* Low Threshold Handle */}
          <View
            style={[
              styles.sliderHandle,
              { left: `${lowThreshold}%`, marginLeft: -10 }
            ]}
            {...lowHandlePanResponder.panHandlers}
          >
            <View style={styles.sliderHandleLine} />
          </View>
          
          {/* High Threshold Handle */}
          <View
            style={[
              styles.sliderHandle,
              { left: `${highThreshold}%`, marginLeft: -10 }
            ]}
            {...highHandlePanResponder.panHandlers}
          >
            <View style={styles.sliderHandleLine} />
          </View>
        </View>
        
        {/* Threshold Labels */}
        <View style={styles.thresholdLabels}>
          <ThemedText style={styles.thresholdText}>
            Low: 0-{Math.round(lowThreshold)}
          </ThemedText>
          <ThemedText style={styles.thresholdText}>
            Medium: {Math.round(lowThreshold) + 1}-{Math.round(highThreshold)}
          </ThemedText>
          <ThemedText style={styles.thresholdText}>
            High: {Math.round(highThreshold) + 1}-100
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.8,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
  },
  textInput: {
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  sliderContainer: {
    marginBottom: 24,
    paddingHorizontal: 20, // Add padding to the entire container
    paddingBottom: 170,
  },
  sliderLabel: {
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 16,
    fontWeight: 'bold',
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
  zoneLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  sliderHandle: {
    position: 'absolute',
    width: 20,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  sliderHandleLine: {
    width: 18,
    height: 50,
    borderRadius: 9,
    backgroundColor: 'white',
  },
  lowHandle: {
    zIndex: 2,
  },
  highHandle: {
    zIndex: 3,
  },
  sliderTouchArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  thresholdLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  thresholdText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
}); 