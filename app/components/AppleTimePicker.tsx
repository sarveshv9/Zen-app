// src/components/AppleTimePicker.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Dimensions,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import { theme } from "../styles/shared";

interface AppleTimePickerProps {
  selectedTime: string;
  onTimeChange: (time: string) => void;
}

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const AppleTimePicker: React.FC<AppleTimePickerProps> = ({
  selectedTime,
  onTimeChange,
}) => {
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState("AM");

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const periods = ["AM", "PM"];

  // Initialize values from selectedTime prop
  useEffect(() => {
    if (selectedTime) {
      const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
      const match = selectedTime.match(timeRegex);
      if (match) {
        setSelectedHour(parseInt(match[1], 10));
        setSelectedMinute(parseInt(match[2], 10));
        setSelectedPeriod(match[3].toUpperCase());
      }
    }
  }, [selectedTime]);

  const updateTime = useCallback(() => {
    const timeStr = `${selectedHour}:${selectedMinute
      .toString()
      .padStart(2, "0")} ${selectedPeriod}`;
    onTimeChange(timeStr);
  }, [selectedHour, selectedMinute, selectedPeriod, onTimeChange]);

  const PickerColumn: React.FC<{
    data: any[];
    selectedValue: any;
    onValueChange: (value: any) => void;
    renderItem: (item: any) => string;
  }> = ({ data, selectedValue, onValueChange, renderItem }) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const itemHeight = 50;
    
    // Function to scroll to selected value
    const scrollToValue = useCallback(
      (value: any, animated: boolean = false) => {
        const index = data.findIndex((item) => item === value);
        if (index !== -1 && scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            y: index * itemHeight,
            animated,
          });
        }
      },
      [data, itemHeight]
    );

    // Initialize scroll position
    useEffect(() => {
      const timer = setTimeout(() => {
        scrollToValue(selectedValue, false);
      }, 100);
      return () => clearTimeout(timer);
    }, [selectedValue, scrollToValue]);

    const handleMomentumScrollEnd = useCallback(
      (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / itemHeight);
        
        if (data[index] && data[index] !== selectedValue) {
          onValueChange(data[index]);
        }
        
        // Snap to the exact position
        scrollViewRef.current?.scrollTo({
          y: index * itemHeight,
          animated: true,
        });
      },
      [data, itemHeight, selectedValue, onValueChange]
    );

    return (
      <View style={pickerStyles.pickerColumn}>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={itemHeight}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingVertical: itemHeight * 2,
          }}
          onMomentumScrollEnd={handleMomentumScrollEnd}
        >
          {data.map((item, index) => (
            <Pressable
              key={index}
              style={[
                pickerStyles.pickerItem,
                { height: itemHeight },
                item === selectedValue && pickerStyles.selectedPickerItem,
              ]}
              onPress={() => {
                onValueChange(item);
                scrollToValue(item, true);
              }}
            >
              <Text
                style={[
                  pickerStyles.pickerText,
                  item === selectedValue && pickerStyles.selectedPickerText,
                ]}
              >
                {renderItem(item)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <View style={pickerStyles.pickerSelection} />
        <View style={pickerStyles.pickerTopGradient} />
        <View style={pickerStyles.pickerBottomGradient} />
      </View>
    );
  };

  return (
    <View style={pickerStyles.timePickerContainer}>
      <Text style={pickerStyles.timePickerLabel}>Select Time</Text>
      <View style={pickerStyles.pickerWrapper}>
        <PickerColumn
          data={hours}
          selectedValue={selectedHour}
          onValueChange={setSelectedHour}
          renderItem={(hour) => hour.toString()}
        />
        <Text style={pickerStyles.pickerSeparator}>:</Text>
        <PickerColumn
          data={minutes}
          selectedValue={selectedMinute}
          onValueChange={setSelectedMinute}
          renderItem={(minute) => minute.toString().padStart(2, "0")}
        />
        <PickerColumn
          data={periods}
          selectedValue={selectedPeriod}
          onValueChange={setSelectedPeriod}
          renderItem={(period) => period}
        />
      </View>
      <Pressable style={pickerStyles.timeConfirmButton} onPress={updateTime}>
        <Text style={pickerStyles.timeConfirmText}>Set Time</Text>
      </Pressable>
    </View>
  );
};

const pickerStyles = StyleSheet.create({
  timePickerModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  timePickerModal: {
    backgroundColor: theme.colors.white,
    borderRadius: 28,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    width: "90%",
    maxWidth: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 25,
  },
  timePickerContainer: {
    alignItems: "center",
  },
  timePickerLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.primary,
    marginBottom: theme.spacing.xl,
    fontFamily: theme.fonts.bold,
  },
  pickerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 160,
    marginBottom: theme.spacing.lg,
  },
  pickerColumn: {
    height: 160,
    position: "relative",
    justifyContent: "center",
    width: 60,
  },
  pickerItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  selectedPickerItem: {
    backgroundColor: "transparent",
  },
  pickerText: {
    fontSize: 18,
    color: theme.colors.secondary,
    fontWeight: "400",
    opacity: 0.4,
    fontFamily: theme.fonts.regular,
    textAlign: "center",
  },
  selectedPickerText: {
    fontSize: 22,
    color: theme.colors.primary,
    fontWeight: "700",
    opacity: 1,
    fontFamily: theme.fonts.bold,
  },
  pickerSeparator: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.primary,
    marginHorizontal: theme.spacing.sm,
    lineHeight: 40,
    fontFamily: theme.fonts.bold,
  },
  pickerOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255,255,255,0.6)",
    pointerEvents: "none",
  },
  pickerSelection: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 50,
    marginTop: -25,
    backgroundColor: `${theme.colors.primary}15`,
    borderRadius: theme.borderRadius.sm,
    pointerEvents: "none",
    borderWidth: 2,
    borderColor: `${theme.colors.primary}30`,
  },
  pickerTopGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "transparent",
    pointerEvents: "none",
    zIndex: 1,
  },
  pickerBottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "transparent",
    pointerEvents: "none",
    zIndex: 1,
  },
  timePickerActions: {
    width: "100%",
    alignItems: "center",
  },
  timePickerButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    minWidth: 120,
    alignItems: "center",
  },
  timeConfirmButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    minWidth: 120,
    alignItems: "center",
  },
  timeConfirmText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.white,
    fontFamily: theme.fonts.bold,
  },
});

export default AppleTimePicker;