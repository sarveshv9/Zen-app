import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { theme } from '../styles/shared';

interface Quote {
  id: string;
  text: string;
  author?: string;
}

const MotivationalQuotes: React.FC<{ currentTask?: string }> = ({ currentTask }) => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error('Gemini API key not found in environment variables');
      }

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

      const prompt = currentTask
        ? `Give me 3 short motivational quotes to stay focused while working on: "${currentTask}".  

Each quote should:
- Be max 20 words  
- Be uplifting and inspiring  
- Include the author's name if well-known, otherwise just the quote  

Format strictly as:
1. "Quote" — Author  
2. "Quote" — Author  
3. "Quote" — Author`
        : `Give me 3 short motivational quotes about productivity and focus.  

Each quote should:
- Be max 20 words  
- Be uplifting and inspiring  
- Include the author's name if well-known, otherwise just the quote  

Format strictly as:
1. "Quote" — Author  
2. "Quote" — Author  
3. "Quote" — Author`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 150,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!generatedText) {
        throw new Error('No quotes received from AI');
      }

      // Split into lines, clean & parse
      const lines = generatedText
        .split('\n')
        .filter((line: string) => line.trim().length > 0)
        .slice(0, 3);

      const parsedQuotes: Quote[] = lines.map((line: string, index: number): Quote => {
        let [quotePart, authorPart] = line
          .replace(/^\d+\.\s*/, '') // remove "1. " or "2. "
          .split(/[-–—]/) // split on dash
          .map((s: string) => s.trim());

        return {
          id: `quote-${index}`,
          text: quotePart?.replace(/^["']|["']$/g, '') || '',
          author: authorPart || undefined,
        };
      });

      setQuotes(parsedQuotes);
    } catch (err) {
      console.error('Error fetching motivational quotes:', err);
      setError('Unable to load inspiration');
      setQuotes([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentTask]);

  // Fetch on mount + when task changes
  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  return (
    <Animated.View
      entering={FadeIn.duration(600)}
      exiting={FadeOut.duration(300)}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>🌟 Inspiration</Text>
        <Pressable
          style={({ pressed }) => [
            styles.refreshButton,
            pressed && styles.refreshButtonPressed,
          ]}
          onPress={fetchQuotes}
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
            <Text style={styles.loadingText}>Finding wisdom…</Text>
          </View>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : quotes.length > 0 ? (
          <View style={styles.quoteContainer}>
            {quotes.map((q, index) => (
              <Animated.View
                key={q.id}
                entering={FadeIn.duration(400).delay(index * 100)}
              >
                <Text style={styles.quoteText}>“{q.text}”</Text>
                {q.author && (
                  <Text style={styles.authorText}>— {q.author}</Text>
                )}
              </Animated.View>
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
    minHeight: 80,
    alignItems: 'center',
    justifyContent: 'center',
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
  quoteContainer: {
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  quoteText: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.primary,
    lineHeight: 20,
    textAlign: 'center',
  },
  authorText: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.secondary,
    opacity: 0.7,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
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

export default MotivationalQuotes;