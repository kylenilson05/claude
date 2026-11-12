# FAR Mistake-Review System

CPA FAR exam: **2027-01-05**. Course: Becker (sections F1–F6).
Style: concise. No long explanations unless asked.

## Layout

| Path | Purpose |
|---|---|
| `misses/inbox/` | New screenshots of missed MCQs/sims (question + Becker explanation). Filename may contain a note on why it was missed, e.g. `F3_leases_misread-lessor.png`. |
| `misses/processed/` | Screenshots after review. Never delete these. |
| `miss_log.csv` | One row per unique topic/subtopic miss. |
| `anki_import.csv` | Anki cards (Front, Back, Tags). |
| `weekly/YYYY-MM-DD.md` | One review file per week. |

### miss_log.csv columns
`date_added,becker_section,topic,subtopic,question_type,error_type,rule_needed,times_missed`

- `date_added`: YYYY-MM-DD the row was first created (don't change on later misses).
- `becker_section`: `F1`–`F6`. Use the module label in the screenshot; if not shown, infer from the topic.
- `question_type`: `MCQ` or `sim`.
- `error_type`: exactly one of `concept gap`, `formula or rule`, `misread`, `calculation`, `guessed`.
- `rule_needed`: 1–2 sentences, own words. Quote the field (it may contain commas).
- `times_missed`: integer, starts at 1.

### anki_import.csv
Header lines (`#separator:comma`, `#html:true`, `#columns:Front,Back,Tags`, `#tags column:3`) stay at the top. Append rows below. Tags: `FAR F<n> <topic_slug>` (e.g. `FAR F3 leases`). Quote every field. Use `<br>` for line breaks. User re-imports the whole file in Anki; duplicates are matched on Front, so never reword an existing Front.

## "run weekly review"

1. **Read** every image in `misses/inbox/` (skip `.gitkeep`). For each: identify section, topic, subtopic, question type; what the correct answer hinges on; likely reason for the miss. Filename note wins over inference for the reason. If the inbox is empty, say so and stop.
2. **Log** to `miss_log.csv`. Match existing rows on `topic` + `subtopic` (case-insensitive, normalize obvious synonyms). Match → `times_missed += 1` and update `error_type` / `rule_needed` only if the new one is clearer. No match → new row. Reuse existing topic/subtopic names so matching stays consistent.
3. **Anki**: 1–2 cards per miss testing the underlying rule (not the specific numbers/facts of the question). Own words; never copy Becker text. Prefer cloze-style "When X, then Y?" or a tiny worked case with fresh numbers. Skip a card if an equivalent Front already exists.
4. **Weekly file** `weekly/YYYY-MM-DD.md` (today's date):
   - **Top 3 weak areas**: this week (misses from this run) and all-time (by `times_missed`). Table: topic/subtopic, section, count.
   - **Error type breakdown**: counts + % for this week and all-time; one-line verdict (concept vs. careless = misread + calculation + guessed).
   - **Cheat sheet**: per weak area, 3–6 bullets of rules/formulas/journal entries.
   - **Practice**: 8–10 original questions on the weakest topics — 7–9 MCQs (4 options, A–D) + 1 mini sim (short fact pattern, fill-in table or JE). Exam-realistic, current US GAAP / GASB.
   - **Answers & explanations** at the bottom (1–3 lines each), separated from the questions.
5. **Move** reviewed images from `misses/inbox/` to `misses/processed/` (prefix with the date if a name collides).
6. **Chat summary**, exactly 3 lines:
   - Re-watch: Becker section/lecture(s) for the top concept gaps.
   - Drill first: the single topic to drill first, and why (1 clause).
   - Pattern: the dominant error type + one fix.

Then commit and push the changes.

## Rules
- Accuracy over speed: if a rule depends on a standard (ASC/GASB) detail you're unsure of, flag it with `(verify)` rather than guess.
- Don't rewrite past weekly files or existing log rows except `times_missed` / clarifications in step 2.
- Keep CSVs valid (RFC 4180 quoting). Check row counts after writing.
