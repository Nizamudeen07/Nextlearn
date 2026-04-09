import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  questions: [],
  questionsCount: 0,
  totalMarks: 0,
  totalTime: 0,
  timeForEachQuestion: 0,
  markPerAnswer: 0,
  instruction: '',
  currentIndex: 0,
  answers: {},        // { question_id: selected_option_id }
  markedForReview: [], // array of question_ids
  examStarted: false,
  examSubmitted: false,
  result: null,
  loading: false,
  error: null,
  paragraphVisible: false,
};

const normalizeOption = (option, index) => ({
  ...option,
  id: option?.id ?? option?.option_id ?? index,
  option: option?.option ?? option?.text ?? '',
});

const normalizeQuestion = (question, index) => ({
  ...question,
  id: question?.id ?? question?.question_id ?? index + 1,
  question: question?.question ?? question?.title ?? '',
  image: question?.image ?? question?.question_image ?? null,
  paragraph: question?.paragraph ?? question?.comprehensive_paragraph ?? '',
  options: Array.isArray(question?.options)
    ? question.options.map((option, optionIndex) => normalizeOption(option, optionIndex + 1))
    : [],
});

const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setQuestions(state, action) {
      const { questions, questions_count, total_marks, total_time, time_for_each_question, mark_per_each_answer, instruction } = action.payload;
      const normalizedQuestions = Array.isArray(questions)
        ? questions.map((question, index) => normalizeQuestion(question, index))
        : [];

      state.questions = normalizedQuestions;
      state.questionsCount = questions_count ?? normalizedQuestions.length;
      state.totalMarks = total_marks;
      state.totalTime = total_time;
      state.timeForEachQuestion = time_for_each_question;
      state.markPerAnswer = mark_per_each_answer;
      state.instruction = instruction;
    },
    startExam(state) {
      state.examStarted = true;
      state.currentIndex = 0;
      state.answers = {};
      state.markedForReview = [];
    },
    setCurrentIndex(state, action) {
      state.currentIndex = action.payload;
    },
    setAnswer(state, action) {
      const { question_id, option_id } = action.payload;
      state.answers[question_id] = option_id;
    },
    toggleMarkForReview(state, action) {
      const qid = action.payload;
      if (state.markedForReview.includes(qid)) {
        state.markedForReview = state.markedForReview.filter(id => id !== qid);
      } else {
        state.markedForReview.push(qid);
      }
    },
    setResult(state, action) {
      state.result = action.payload;
      state.examSubmitted = true;
    },
    setParagraphVisible(state, action) {
      state.paragraphVisible = action.payload;
    },
    resetExam(state) {
      return { ...initialState };
    },
  },
});

export const {
  setLoading, setError, setQuestions, startExam, setCurrentIndex,
  setAnswer, toggleMarkForReview, setResult, setParagraphVisible, resetExam,
} = examSlice.actions;

export default examSlice.reducer;
