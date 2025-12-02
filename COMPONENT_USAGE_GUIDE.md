# 🎓 BrainSpark - Component Usage Guide

Quick reference for using all newly implemented components.

---

## 🎨 UI Components

### Select
```jsx
import Select from './components/ui/Select';

<Select
  label="Choose Category"
  options={[
    { value: 'dsa', label: 'Data Structures' },
    { value: 'dbms', label: 'Databases' }
  ]}
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  error={errors.category}
  required
  placeholder="Select a category..."
/>
```

### Checkbox
```jsx
import Checkbox from './components/ui/Checkbox';

<Checkbox
  label="I agree to terms"
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
/>
```

### Radio
```jsx
import Radio from './components/ui/Radio';

<Radio.Group>
  <Radio
    name="difficulty"
    value="easy"
    label="Easy"
    checked={difficulty === 'easy'}
    onChange={(e) => setDifficulty(e.target.value)}
  />
  <Radio
    name="difficulty"
    value="hard"
    label="Hard"
    checked={difficulty === 'hard'}
    onChange={(e) => setDifficulty(e.target.value)}
  />
</Radio.Group>
```

### Tooltip
```jsx
import Tooltip from './components/ui/Tooltip';

<Tooltip content="Click to start timer" position="top" delay={300}>
  <Button>Start</Button>
</Tooltip>
```

### Skeleton
```jsx
import Skeleton from './components/ui/Skeleton';

{loading && (
  <>
    <Skeleton variant="text" count={3} />
    <Skeleton variant="rectangular" width="100%" height={200} />
    <Skeleton variant="circular" width={40} height={40} />
  </>
)}
```

### Avatar
```jsx
import Avatar from './components/ui/Avatar';

<Avatar
  src={user.avatar}
  alt={user.name}
  size="lg"
  fallback={user.name.charAt(0)}
/>
```

### Toggle
```jsx
import Toggle from './components/ui/Toggle';

<Toggle
  label="Enable Sounds"
  checked={soundEnabled}
  onChange={(e) => setSoundEnabled(e.target.checked)}
/>
```

---

## 🎯 Quiz Components

### QuizTimer
```jsx
import QuizTimer from './components/quiz/QuizTimer';

<QuizTimer
  initialTime={900} // 15 minutes in seconds
  onTimeUp={() => submitQuiz()}
  isActive={!isPaused}
  warningThreshold={60} // Show warning at 1 minute
/>
```

### AnswerOption
```jsx
import AnswerOption from './components/quiz/AnswerOption';

<AnswerOption
  option={{ id: 'A', text: 'Answer text' }}
  isSelected={selectedAnswer === 'A'}
  isCorrect={showFeedback && correctAnswer === 'A'}
  isIncorrect={showFeedback && selectedAnswer === 'A' && correctAnswer !== 'A'}
  showFeedback={showFeedback}
  onClick={() => handleSelectAnswer('A')}
  disabled={showFeedback}
/>
```

### QuestionProgress
```jsx
import QuestionProgress from './components/quiz/QuestionProgress';

<QuestionProgress
  current={currentQuestion + 1}
  total={totalQuestions}
  percentage={(currentQuestion + 1) / totalQuestions * 100}
/>
```

---

## 🏆 Gamification Components

### StreakCalendar
```jsx
import StreakCalendar from './components/gamification/StreakCalendar';

<StreakCalendar
  activityData={[
    { date: '2024-12-01', count: 3 },
    { date: '2024-12-02', count: 1 },
    // ... more days
  ]}
  daysToShow={91} // Show last 3 months
/>
```

### Confetti
```jsx
import Confetti from './components/gamification/Confetti';
import { useState } from 'react';

const [showConfetti, setShowConfetti] = useState(false);

// Trigger on high score
useEffect(() => {
  if (score >= 80) {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  }
}, [score]);

{showConfetti && (
  <Confetti
    active={true}
    duration={3000}
    particleCount={150}
  />
)}
```

### AchievementBadge
```jsx
import AchievementBadge from './components/gamification/AchievementBadge';

<AchievementBadge
  achievement={{
    icon: '🏆',
    name: 'Quiz Master',
    description: 'Complete 50 quizzes',
    unlocked: true
  }}
  size="md"
  showDetails={true}
/>
```

### XPProgressBar
```jsx
import XPProgressBar from './components/gamification/XPProgressBar';

<XPProgressBar
  currentXP={850}
  requiredXP={1000}
  level={5}
  showLabel={true}
  size="md"
/>
```

---

## 📊 Analytics Components

### PerformanceChart
```jsx
import PerformanceChart from './components/analytics/PerformanceChart';

<PerformanceChart
  data={[
    { label: 'Week 1', value: 75 },
    { label: 'Week 2', value: 82 },
    { label: 'Week 3', value: 90 },
  ]}
  title="Quiz Performance Over Time"
/>
```

### CategoryBreakdown
```jsx
import CategoryBreakdown from './components/analytics/CategoryBreakdown';

<CategoryBreakdown
  data={[
    { category: 'DSA', count: 15 },
    { category: 'DBMS', count: 10 },
    { category: 'OS', count: 8 },
  ]}
  title="Quizzes by Category"
/>
```

### StatsCard
```jsx
import StatsCard from './components/analytics/StatsCard';

<StatsCard
  icon="📊"
  label="Average Score"
  value="85%"
  trend={+5.2}
/>
```

---

## 🏅 Leaderboard Components

### LeaderboardTable
```jsx
import LeaderboardTable from './components/leaderboard/LeaderboardTable';

<LeaderboardTable
  users={leaderboardUsers}
  currentUserId={user._id}
/>
```

### FilterControls
```jsx
import FilterControls from './components/leaderboard/FilterControls';

<FilterControls
  timePeriod={timePeriod}
  onTimePeriodChange={setTimePeriod}
  category={category}
  onCategoryChange={setCategory}
  categories={['DSA', 'DBMS', 'OS', 'Networks']}
/>
```

---

## 🔧 Custom Hooks

### useLocalStorage
```jsx
import useLocalStorage from './hooks/useLocalStorage';

const [user, setUser, removeUser] = useLocalStorage('user', null);

// Set value
setUser({ name: 'John', email: 'john@example.com' });

// Remove value
removeUser();
```

### useSound
```jsx
import useSound from './hooks/useSound';

const QuizPage = () => {
  const correctSound = useSound('correct');
  const incorrectSound = useSound('incorrect');
  const achievementSound = useSound('achievement');
  const clickSound = useSound('click');
  
  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      correctSound.play(0.5); // Volume 0-1
    } else {
      incorrectSound.play(0.5);
    }
  };
  
  return (
    <button onClick={() => clickSound.play(0.3)}>
      Submit
    </button>
  );
};
```

### useQuiz
```jsx
import useQuiz from './hooks/useQuiz';

const QuizPage = () => {
  const quiz = useQuiz(quizId);
  
  // Quiz state
  const {
    currentQuestion,
    answers,
    timeRemaining,
    isComplete,
    progress,
    
    // Actions
    answerQuestion,
    nextQuestion,
    previousQuestion,
    completeQuiz,
    resetQuiz,
    calculateScore,
    startTimer,
    updateTimer,
  } = quiz;
  
  const handleAnswer = (questionId, option, isCorrect, explanation) => {
    answerQuestion(questionId, option, isCorrect, explanation);
  };
  
  const handleNext = () => {
    nextQuestion(totalQuestions);
  };
  
  // Progress tracking
  console.log(`Question ${progress.current} of ${progress.total}`);
  console.log(`${progress.percentage}% complete`);
};
```

---

## 👨‍💼 Admin Components

### Access Admin Panel
```
Navigate to: /admin
(Requires authentication)
```

### QuizCreator
Full form for creating quizzes - no additional code needed, just use the page:
```jsx
import AdminPage from './pages/AdminPage';
// Select "Quiz Creator" tab
```

Features:
- Add/remove questions dynamically
- Set quiz metadata
- Configure difficulty
- Auto-validation

### QuestionBank
Search and manage all questions:
```jsx
// Select "Question Bank" tab in Admin Panel
```

Features:
- Search questions
- Filter by category/difficulty
- Edit/delete questions

### UserManagement
View all users and stats:
```jsx
// Select "User Management" tab in Admin Panel
```

---

## 🎵 Sound Effects Reference

All sounds are generated programmatically - no files needed!

Available sound types:
- `'correct'` - Rising chime for correct answers
- `'incorrect'` - Descending buzz for wrong answers
- `'achievement'` - Triple-tone fanfare for achievements
- `'click'` - Quick tap sound for buttons
- `'notification'` - Two-tone alert for notifications

Sound respects user preference (enable/disable in Profile settings).

---

## 🚀 Quick Integration Example

Here's how to enhance an existing quiz page with all new features:

```jsx
import { useState, useEffect } from 'react';
import useSound from '../hooks/useSound';
import QuizTimer from '../components/quiz/QuizTimer';
import AnswerOption from '../components/quiz/AnswerOption';
import QuestionProgress from '../components/quiz/QuestionProgress';
import Confetti from '../components/gamification/Confetti';

const EnhancedQuizPage = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Sound effects
  const correctSound = useSound('correct');
  const incorrectSound = useSound('incorrect');
  const achievementSound = useSound('achievement');
  
  const handleAnswer = (option, isCorrect) => {
    setSelectedAnswer(option);
    setShowFeedback(true);
    
    if (isCorrect) {
      correctSound.play(0.5);
      setScore(prev => prev + 1);
    } else {
      incorrectSound.play(0.5);
    }
  };
  
  const handleNext = () => {
    if (currentQ === questions.length - 1) {
      // Quiz complete
      const finalScore = (score / questions.length) * 100;
      
      if (finalScore >= 80) {
        setShowConfetti(true);
        achievementSound.play(0.6);
      }
    } else {
      setCurrentQ(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };
  
  return (
    <div className="quiz-container">
      {/* Timer */}
      <QuizTimer
        initialTime={900}
        onTimeUp={() => handleTimeUp()}
        isActive={!showFeedback}
        warningThreshold={60}
      />
      
      {/* Progress */}
      <QuestionProgress
        current={currentQ + 1}
        total={questions.length}
        percentage={((currentQ + 1) / questions.length) * 100}
      />
      
      {/* Question */}
      <h2>{questions[currentQ].text}</h2>
      
      {/* Answer Options */}
      {questions[currentQ].options.map(option => (
        <AnswerOption
          key={option.id}
          option={option}
          isSelected={selectedAnswer === option.id}
          isCorrect={showFeedback && option.isCorrect}
          isIncorrect={showFeedback && selectedAnswer === option.id && !option.isCorrect}
          showFeedback={showFeedback}
          onClick={() => handleAnswer(option.id, option.isCorrect)}
          disabled={showFeedback}
        />
      ))}
      
      {/* Confetti */}
      {showConfetti && (
        <Confetti active={true} duration={3000} particleCount={100} />
      )}
    </div>
  );
};
```

---

## 📚 Key Points

1. **All components are standalone** - import and use anywhere
2. **Sound system is automatic** - respects user preferences
3. **Responsive by default** - works on all screen sizes
4. **Accessible** - keyboard navigation, ARIA labels, screen reader support
5. **Themeable** - respects light/dark mode from ThemeContext
6. **Type-safe props** - clear prop interfaces for easy use

---

**All components are production-ready and fully integrated with the existing BrainSpark codebase!**
