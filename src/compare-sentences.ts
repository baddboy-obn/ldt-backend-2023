function levenshteinDistance(word1: string, word2: string): number {
  const dp: number[][] = [];
  for (let i = 0; i <= word1.length; i++) {
    dp[i] = [i];
  }
  for (let j = 1; j <= word2.length; j++) {
    dp[0][j] = j;
  }
  for (let i = 1; i <= word1.length; i++) {
    for (let j = 1; j <= word2.length; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + 1, // substitution
          dp[i][j - 1] + 1, // insertion
          dp[i - 1][j] + 1 // deletion
        );
      }
    }
  }
  return dp[word1.length][word2.length];
}

export function compareSentences(sentence1: string, sentence2: string): number {
  const maxLength: number = Math.max(sentence1.length, sentence2.length);
  const distance: number = levenshteinDistance(sentence1, sentence2);
  return ((maxLength - distance) / maxLength) * 100;
}

// Пример использования:
const sentence1: string = "Рентгенография околоносовых пазух";
const sentence2: string =
  "Компьютерная томография придаточных пазух носа, гортани";
const similarity = compareSentences(sentence1, sentence2);
