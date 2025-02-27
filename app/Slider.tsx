import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Wave, { HEIGHT, MARGIN_WIDTH, MIN_LEDGE, Side, WIDTH } from "./Wave";
import Button from "./Button";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedKeyboard,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import { snapPoint, useVector } from "react-native-redash";
const PREV = WIDTH;
const NEXT = 0;

interface SliderProps {
  index: number;
  setIndex: (value: number) => void;
  children: JSX.Element;
  prev?: JSX.Element;
  next?: JSX.Element;
}

const Slider = ({
  index,
  children: current,
  prev,
  next,
  setIndex,
}: SliderProps) => {
  const hasPrev = !!prev;
  const hasNext = !!next;
  const zIndex = useSharedValue(0);
  const activeSide = useSharedValue(Side.NONE);
  const left = useVector(0, HEIGHT / 2);
  const right = useVector();
  const isTransitioningLeft = useSharedValue(false);
  const isTransitioningRight = useSharedValue(false);
  const onGestureEvent = useAnimatedGestureHandler({
    onStart: ({ x }) => {
      if (x < MARGIN_WIDTH) {
        activeSide.value = Side.LEFT;
      } else if (x > WIDTH - MARGIN_WIDTH) {
        activeSide.value = Side.RIGHT;
      } else {
        activeSide.value = Side.NONE;
      }
    },
    onActive: ({ x, y }) => {
      if (activeSide.value === Side.LEFT) {
        left.x.value = x;
        left.y.value = y;
      } else if (activeSide.value === Side.RIGHT) {
        right.x.value = WIDTH - x;
        right.y.value = y;
      }
    },
    onEnd: ({ x, velocityX, velocityY }) => {
      if (activeSide.value === Side.LEFT) {
        const snapPoints = [MIN_LEDGE, WIDTH];
        const dest = snapPoint(x, velocityX, snapPoints);
        isTransitioningLeft.value = dest === WIDTH;
        left.y.value = withSpring(HEIGHT / 2, { velocity: velocityY });

        left.x.value = withSpring(
          dest,
          {
            velocity: velocityX,
            overshootClamping: isTransitioningLeft.value ? true : false,
            restSpeedThreshold: isTransitioningLeft.value ? 100 : 0.01,
            restDisplacementThreshold: isTransitioningLeft.value ? 100 : 0.01,
          },
          () => {
            if (isTransitioningLeft.value) {
              runOnJS(setIndex)(index - 1);
            }
          }
        );
      } else if (activeSide.value === Side.RIGHT) {
        const snapPoints = [WIDTH - MIN_LEDGE, 0];
        const dest = snapPoint(x, velocityX, snapPoints);
        isTransitioningRight.value = dest === 0;
        right.y.value = withSpring(HEIGHT / 2, { velocity: velocityY });
        right.x.value = withSpring(
          WIDTH - dest,
          {
            velocity: velocityX,
            overshootClamping: isTransitioningRight.value ? true : false,
            restSpeedThreshold: isTransitioningRight.value ? 100 : 0.01,
            restDisplacementThreshold: isTransitioningRight.value ? 100 : 0.01,
          },
          () => {
            if (isTransitioningRight.value) {
              runOnJS(setIndex)(index + 1);
            }
          }
        );
      }
    },
  });
  useEffect(() => {
    left.x.value = withSpring(MIN_LEDGE);
    right.y.value = withSpring(MIN_LEDGE);
  }, []);
  const leftStyle = useAnimatedStyle(() => ({
    zIndex: activeSide.value === Side.LEFT ? 100 : 0,
  }));
  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View style={StyleSheet.absoluteFill}>
        <View style={StyleSheet.absoluteFill}>
          {current}
          {prev && (
            <Animated.View style={[StyleSheet.absoluteFill, leftStyle]}>
              <Wave
                side={Side.LEFT}
                position={left}
                isTransitioning={isTransitioningLeft}
              >
                {prev}
              </Wave>
            </Animated.View>
          )}
          {next && (
            <View style={StyleSheet.absoluteFill}>
              <Wave
                side={Side.RIGHT}
                position={right}
                isTransitioning={isTransitioningRight}
              >
                {next}
              </Wave>
            </View>
          )}
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default Slider;
