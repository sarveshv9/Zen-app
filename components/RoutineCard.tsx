import React, { useCallback, useMemo, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { Theme } from "../styles/shared";
import { RoutineItem } from "../utils/utils";

interface RoutineCardProps {
  item: RoutineItem;
  onPress: (item: RoutineItem, x: number, y: number) => void;
}

const RoutineCard: React.FC<RoutineCardProps> = ({ item, onPress }) => {
  // Use the theme hook to get the current theme
  const { theme } = useTheme();
  // Create dynamic styles that will update when the theme changes
  const styles = useMemo(() => getStyles(theme), [theme]);
  
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(
    (e: any) => {
      const { pageX, pageY } = e.nativeEvent;
      setTouchPosition({ x: pageX, y: pageY });

      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    },
    [scaleAnim]
  );

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  }, [scaleAnim]);

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onPress(item, touchPosition.x, touchPosition.y)}
        style={styles.enhancedRoutineCard}
      >
        <View style={styles.cardGradient} />
        <View style={styles.enhancedCardContent}>
          <View style={styles.cardTimeContainer}>
            <Text style={styles.enhancedCardTime}>{item.time}</Text>
          </View>
          <View style={styles.cardTaskContainer}>
            <Text style={styles.enhancedCardTask}>{item.task}</Text>
            <Text style={styles.cardPreview} numberOfLines={1}>
              {item.description}
            </Text>
          </View>
          <View style={styles.cardArrow}>
            <Text style={styles.cardArrowText}>→</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

// Converted the static StyleSheet into a function that accepts a theme
const getStyles = (theme: Theme) => StyleSheet.create({
  enhancedRoutineCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    marginVertical: theme.spacing.xs,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
    position: "relative",
  },
  cardGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: theme.colors.primary,
  },
  enhancedCardContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  cardTimeContainer: {
    backgroundColor: `${theme.colors.primary}1A`, // Use 1A for ~10% opacity
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.md,
    minWidth: 70,
    alignItems: "center",
  },
  enhancedCardTime: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "700",
    textAlign: "center",
  },
  cardTaskContainer: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  enhancedCardTask: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs / 2,
    lineHeight: 22,
  },
  cardPreview: {
    fontSize: 13,
    color: theme.colors.secondary,
    opacity: 0.7,
    lineHeight: 16,
  },
  cardArrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `${theme.colors.primary}1A`,
    alignItems: "center",
    justifyContent: "center",
  },
  cardArrowText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "600",
  },
});

export default RoutineCard;