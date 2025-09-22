import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../styles/shared';

interface Tip {
  id: string;
  text: string;
}

const DEFAULT_TIP: Tip[] = [
    { id: 'default-1', text: 'Take a moment to notice your breath. In and out.' }
];

const AiSuggestions: React.FC<{ currentTask?: string }> = ({ currentTask }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const [tips, setTips] = useState<Tip[]>(DEFAULT_TIP);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 1. ADD A REF to remember the last task we fetched.
  const lastFetchedTask = useRef<string | null>(null);

  const fetchTips = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error('Gemini API key not found');

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

      const prompt = `For the task "${currentTask}", provide one short, calming, zen-like thought or tip. The tip should be encouraging and simple, max 20 words. It could be inspired by a Pokémon's nature. Format as just the sentence.`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.9, maxOutputTokens: 100 },
        }),
      });

      if (!response.ok) throw new Error(`API request failed: ${response.status}`);

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!generatedText) throw new Error('No content received from AI');
      
      const parsedTips: Tip[] = [{
          id: `ai-tip-1`,
          text: generatedText.trim().replace(/^["']|["']$/g, ''),
      }];

      setTips(parsedTips);
    } catch (err: any) {
      console.error('Error fetching AI tip:', err.message);
      setError('Could not fetch a new tip.');
      setTips(DEFAULT_TIP); 
    } finally {
      setIsLoading(false);
    }
  }, [currentTask]);

  // 2. REPLACE your useEffect with this improved version.
  useEffect(() => {
    // ONLY fetch if the task is new AND different from the last one.
    if (currentTask && currentTask !== lastFetchedTask.current) {
      fetchTips();
      lastFetchedTask.current = currentTask; // Remember this task.
    }
  }, [currentTask, fetchTips]);

  return (
    <Animated.View entering={FadeIn.duration(600)} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>✨ Zen Tip</Text>
        <Pressable
          style={({ pressed }) => [styles.refreshButton, pressed && styles.refreshButtonPressed]}
          onPress={fetchTips}
          disabled={isLoading}
        >
          <Text style={styles.refreshButtonText}>{isLoading ? '⟳' : '🔄'}</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Thinking...</Text>
          </View>
        ) : (
          <View style={styles.quoteContainer}>
            {tips.map((tip, index) => (
              <Animated.View key={tip.id} entering={FadeIn.duration(400).delay(index * 100)}>
                <Text style={styles.quoteText}>{tip.text}</Text>
              </Animated.View>
            ))}
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const getStyles = (theme: Theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
  },
  content: {
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.secondary,
    marginLeft: theme.spacing.sm,
  },
  quoteContainer: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  quoteText: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.primary,
    lineHeight: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  refreshButton: {
    padding: theme.spacing.sm,
  },
  refreshButtonPressed: {
    opacity: 0.6,
  },
  refreshButtonText: {
    fontSize: 18,
    color: theme.colors.secondary,
  },
});

export default AiSuggestions;