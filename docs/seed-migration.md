# Seed Migration - Knowledge Data

## Overview
Three Supabase migrations that seed the database with study content from `src/data/knowledge.json`.

## Migrations Applied
1. **seed_topics_batch_1** - microservicios (15 concepts, 12 questions), aws (5c, 4q), typescript (5c, 4q), kubernetes (7c, 6q)
2. **seed_topics_batch_2** - nestjs (7c, 6q), solid (5c, 5q), graphql (6c, 5q)
3. **seed_topics_batch_3** - cicd (6c, 5q), cleancode (6c, 5q), serverless (15c, 15q)

## Totals
- 10 topics
- 77 concepts
- 67 questions
- 67 concept_edges (sequential links between concepts within each topic)

## How It Works
Each migration uses a PL/pgSQL `DO` block that:
1. Inserts a topic row and captures its UUID
2. Inserts each concept linked to that topic, accumulating UUIDs in an array
3. Inserts questions linked to concepts by array index (question[i] -> concept[i]; if index exceeds concepts, links to last concept)
4. Creates `concept_edges` between sequential concepts (concept[0] -> concept[1] -> ... -> concept[n]) with `relationship_type = 'related'`

All rows have `source = 'seed'` to distinguish from AI-generated or user-created content.

## Mapping Rules
- `topics.normalized_name` matches the key in knowledge.json (e.g., `microservicios`, `aws`)
- `concepts.normalized_title` is the lowercase version of `titulo`
- `concepts.depth = 0`, `parent_concept_id = NULL` for all seed concepts
- `questions.correct_index` matches `respuesta` from the JSON (0-indexed)
- `questions.options` is a TEXT[] array from `opciones`

## Supabase Project
- Project ID: `wmehvucqnmtuzidpudve`
