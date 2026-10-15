# REBUILD SPECIFICATION: Hersien-Masjien (Kwartaal 1)

## 1. Vision & Identity
- **Goal**: A high-stakes, high-energy Afrikaans revision tool for Grade 6 students.
- **Tone**: Professional but "cool," avoiding generic educational "slop."
- **Aesthetic**: **Neo-Brutalist**. Think bold, high-contrast, aggressive geometry, and vibrant offsets.

## 2. Technical Stack
- **Framework**: React 18 + TypeScript + Vite.
- **Styling**: Tailwind CSS (No UI libraries like Shadcn/Daisy).
- **Animation**: Framer Motion (Spring-based transitions).
- **Typography**: Lexend (Google Fonts).

## 3. Design Tokens (The "Anti-Slop" Palette)
- **Background**: `#18181B` (Deep Charcoal)
- **Primary Accent**: `#BEF264` (Cyber Lime)
- **Secondary Accent**: `#A855F7` (Electric Purple)
- **Borders**: `4px solid #000000`
- **Shadows**: Hard-edged `8px 8px 0px 0px #000000` (Neo-shadow)

## 4. Core Functional Logic
### A. The Cognitive Assessor (MCQ Generation)
- **Distractor Rule**: Distractors *must* be phonetic or orthographic variations of the target word (e.g., *karre* vs *kare*), not random words from the category.
- **Validation Step**: Before rendering MCQ options, the system must:
  1. Filter out any distractor that matches the correct answer (case-insensitive).
  2. Pass the list through a `Set` to ensure absolute uniqueness.
  3. Shuffle the final list so the answer isn't predictable.

### B. Input Validation
- All string comparisons must be normalized: `.trim().toLowerCase().replace(/[‘’]/g, "'")`.

### C. Game State Flow
1. **Idle**: Splash screen with high-impact typography.
2. **Playing**: Current question, progress bar, score tracking, and "Lifeline" (Show Answer).
3. **Finished**: Comprehensive breakdown (Score vs. Learned/Revealed count).

## 5. Complete Dataset (Kwartaal 1 - Graad 6)

### Category: Meervoude (Plurals)
| Word | Answer | Tricky Distractors |
| :--- | :--- | :--- |
| donkie | donkies | donkiee, donkiere, donkieë |
| bok | bokke | boks, boke, bokte |
| hond | honde | honds, hondte, hondies |
| stad | stede | stads, stadde, stadere |
| taxi | taxi's | taxis, taxie, taxies |
| kar | karre | kars, kare, karries |

### Category: Verkleinwoorde (Diminutives)
| Word | Answer | Tricky Distractors |
| :--- | :--- | :--- |
| hond | hondjie | hondetjie, hondtjie, hondkie |
| bok | bokkie | bokjie, boketjie, bokpie |
| kar | karretjie | karkie, karrejie, karrepie |
| donkie | donkietjie | donkiejie, donkieetjie, donkiepie |
| stad | stadjie | stadietjie, stadejie, stade-tjie |
| taxi | taxi'tjie | taxitjie, taxijie, taxi'etjie |

### Category: Geslag (Gender)
| Word | Answer | Tricky Distractors |
| :--- | :--- | :--- |
| reun | teef | reunvrou, reunin, reuneres |
| hings | merrie | hingsin, hingses, vrouhings |
| ram | ooi | ramin, rames, ramin |
| bestuurder | bestuurderes | bestuurderin, bestuurderesse, bestuurvrou |

## 6. Component Specs
- **NeoBox**: Container with `rounded-2xl`, `neo-border`, and `neo-shadow`.
- **Button**: Interactive state moves the button `-2px` on X/Y to simulate a physical "click" against the hard shadow.
- **ProgressBar**: Minimalist but thick, using `mix-blend-difference` for text overlay.

## 7. Rebuild Instructions for AI
"When generating this app, strictly adhere to the Neo-Brutalist design tokens. Do not use gradients. Do not use soft shadows. Ensure the MCQ logic prevents duplicate choices by validating the distractor list against the correct answer before rendering. All text is in Afrikaans."
