import React, {useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');
const GRID_SIZE = 60;
const SQUARE_SIZE = 6;
const NUM_COLUMNS = Math.floor(width / GRID_SIZE);
const NUM_ROWS = Math.floor(height / GRID_SIZE) + 2;

const AnimatedSquare = ({delay, row, col}: {delay: number; row: number; col: number}) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(-GRID_SIZE * 3, {
        duration: 4000 + delay * 200,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    opacity.value = withRepeat(
      withTiming(0.5, {
        duration: 2500 + delay * 100,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.square,
        {
          left: col * GRID_SIZE + (GRID_SIZE - SQUARE_SIZE) / 2,
          top: row * GRID_SIZE + (GRID_SIZE - SQUARE_SIZE) / 2,
        },
        animatedStyle,
      ]}
    />
  );
};

export default function AnimatedBackground() {
  const squares = [];
  for (let row = 0; row < NUM_ROWS; row++) {
    for (let col = 0; col < NUM_COLUMNS; col++) {
      // Skip some squares for better performance
      if ((row + col) % 2 === 0) {
        squares.push({row, col, delay: (row + col) % 5});
      }
    }
  }

  return (
    <View style={styles.container} pointerEvents="none">
      {squares.map(({row, col, delay}, index) => (
        <AnimatedSquare key={`${row}-${col}`} delay={delay} row={row} col={col} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: 0,
  },
  square: {
    position: 'absolute',
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    backgroundColor: '#3b82f6',
    borderRadius: 1,
  },
});

