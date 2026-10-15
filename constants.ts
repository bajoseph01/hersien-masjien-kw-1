
import { Question, Category } from './types';

export const RAW_DATA = {
  [Category.MEERVOUDE]: [
    { word: 'donkie', answer: 'donkies', distractors: ['donkiee', 'donkiere', 'donkieë'] },
    { word: 'bok', answer: 'bokke', distractors: ['boks', 'boke', 'bokte'] },
    { word: 'hond', answer: 'honde', distractors: ['honds', 'hondte', 'hondies'] },
    { word: 'stad', answer: 'stede', distractors: ['stads', 'stadde', 'stadere'] },
    { word: 'taxi', answer: "taxi's", distractors: ['taxis', 'taxie', 'taxies'] },
    { word: 'kar', answer: 'karre', distractors: ['kars', 'kare', 'karries'] },
  ],
  [Category.VERKLEINWOORDE]: [
    { word: 'hond', answer: 'hondjie', distractors: ['hondetjie', 'hondtjie', 'hondkie'] },
    { word: 'bok', answer: 'bokkie', distractors: ['bokjie', 'boketjie', 'bokpie'] },
    { word: 'kar', answer: 'karretjie', distractors: ['karkie', 'karrejie', 'karrepie'] },
    { word: 'donkie', answer: 'donkietjie', distractors: ['donkiejie', 'donkieetjie', 'donkiepie'] },
    { word: 'stad', answer: 'stadjie', distractors: ['stadietjie', 'stadejie', 'stade-tjie'] },
    { word: 'taxi', answer: "taxi'tjie", distractors: ['taxitjie', 'taxijie', "taxi'etjie"] },
  ],
  [Category.GESLAG]: [
    { word: 'reun', answer: 'teef', distractors: ['reunvrou', 'reunin', 'reuneres'] },
    { word: 'hings', answer: 'merrie', distractors: ['hingsin', 'hingses', 'vrouhings'] },
    { word: 'ram', answer: 'ooi', distractors: ['ramin', 'rames', 'ramin'] },
    { word: 'bestuurder', answer: 'bestuurderes', distractors: ['bestuurderin', 'bestuurderesse', 'bestuurvrou'] },
  ]
};

const getPrompt = (category: Category, word: string) => {
  switch (category) {
    case Category.MEERVOUDE: return `Wat is die meervoud van "${word}"?`;
    case Category.VERKLEINWOORDE: return `Wat is die verkleinwoord van "${word}"?`;
    case Category.GESLAG: return `Wat is die vroulike vorm van "${word}"?`;
    default: return '';
  }
};

// Simple shuffle helper
export const shuffle = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export const generateQuestions = (): Question[] => {
  const questions: Question[] = [];

  Object.entries(RAW_DATA).forEach(([cat, items]) => {
    items.forEach((item, index) => {
      const category = cat as Category;
      // Alternate between MCQ and Text Input for variety
      const type: 'mcq' | 'text' = (index % 2 === 0) ? 'mcq' : 'text';
      
      let options: string[] | undefined;
      if (type === 'mcq') {
        // VALIDATION STEP: 
        // 1. Combine answer and distractors.
        // 2. Filter out anything that is exactly the same as the answer (case insensitive).
        // 3. Use a Set to ensure absolute uniqueness of the final list.
        const rawDistractors = item.distractors || [];
        const uniqueChoices = Array.from(new Set([
          item.answer, 
          ...rawDistractors.filter(d => d.toLowerCase() !== item.answer.toLowerCase())
        ]));
        
        // Take up to 4 options (the answer + 3 best distractors) and shuffle
        options = shuffle(uniqueChoices.slice(0, 4));
      }

      questions.push({
        id: `${cat}-${index}-${Math.random().toString(36).substr(2, 9)}`,
        category,
        word: item.word,
        answer: item.answer,
        prompt: getPrompt(category, item.word),
        type,
        options
      });
    });
  });

  return shuffle(questions);
};
