import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { theme } from '../styles/shared';

interface AiSuggestionsProps {
  tasks: string[];
  currentTask?: string;
}

interface Suggestion {
  id: string;
  text: string;
}

const AiSuggestions: React.FC<AiSuggestionsProps> = ({ tasks, currentTask }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = useCallback(async () => {
    if (tasks.length === 0 && !currentTask) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get API key from environment variable
      const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('Gemini API key not found in environment variables');
      }
      
      // Use the correct Gemini API endpoint
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

      // Create context-aware prompt
      let prompt = '';
      if (currentTask && currentTask !== "🌸 Just Breathe") {
        prompt = `Current focus: "${currentTask}"
My todo tasks: ${tasks.join(', ')}

Based on my current focus and todo list, provide 3 specific, actionable tips that help me:
1. Optimize my current activity: "${currentTask}"
2. Better organize my remaining tasks
3. Maintain focus and productivity

Each tip should be:
- Maximum 12 words
- Directly relevant to my current situation
- Practical and immediately actionable

Format as a simple list, one tip per line, no bullet points.`;
      } else {
        prompt = `My todo tasks: ${tasks.join(', ')}

Provide 3 smart tips for organizing and prioritizing these specific tasks. Each tip should be:
- Maximum 12 words  
- Focused on productivity and organization
- Practical and immediately actionable

Format as a simple list, one tip per line, no bullet points.`;
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 512,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!generatedText) {
        throw new Error('No suggestions received from AI');
      }

      // Parse the response into individual suggestions
      const suggestionLines = generatedText
        .split('\n')
        .filter((line: string) => line.trim().length > 0)
        .slice(0, 3); // Limit to 3 suggestions for compact display

      const parsedSuggestions: Suggestion[] = suggestionLines.map((line: string, index: number) => ({
        id: `suggestion-${index}`,
        text: line.trim().replace(/^[-•*]\s*/, ''), // Remove any bullet points
      }));

      setSuggestions(parsedSuggestions);
    } catch (err) {
      console.error('Error fetching AI suggestions:', err);
      setError('Unable to get suggestions');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [tasks, currentTask]);

  // Auto-fetch suggestions when tasks change
  React.useEffect(() => {
    if (tasks.length > 0 || currentTask) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [tasks, currentTask, fetchSuggestions]);

  if (tasks.length === 0 && !currentTask) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeIn.duration(600)}
      exiting={FadeOut.duration(300)}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>✨ Smart Tips</Text>
        <Pressable
          style={({ pressed }) => [
            styles.refreshButton,
            pressed && styles.refreshButtonPressed
          ]}
          onPress={fetchSuggestions}
          disabled={isLoading}
        >
          <Text style={styles.refreshButtonText}>
            {isLoading ? '⟳' : '🔄'}
          </Text>
        </Pressable>
      </View>
      
      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Thinking…</Text>
          </View>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : suggestions.length > 0 ? (
          <View style={styles.suggestionsContainer}>
            {suggestions.map((suggestion, index) => (
              <Animated.Text
                key={suggestion.id}
                entering={FadeIn.duration(300).delay(index * 50)}
                style={styles.suggestionText}
              >
                • {suggestion.text}
              </Animated.Text>
            ))}
          </View>
        ) : null}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.soft,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.primary,
  },
  content: {
    minHeight: 60,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.secondary,
    marginLeft: theme.spacing.xs,
  },
  suggestionsContainer: {
    gap: theme.spacing.xs,
  },
  suggestionText: {
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    color: theme.colors.primary,
    lineHeight: 18,
    opacity: 0.9,
  },
  errorText: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.secondary,
    textAlign: 'center',
    paddingVertical: theme.spacing.sm,
    opacity: 0.7,
  },
  refreshButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButtonPressed: {
    opacity: 0.6,
    transform: [{ scale: 0.95 }],
  },
  refreshButtonText: {
    fontSize: 12,
  },
});

export default AiSuggestions;