import { supabase } from './supabase'

export async function researchTopic(query) {
  const { data, error } = await supabase.functions.invoke('research-topic', {
    body: { type: 'topic', query },
  })
  if (error) throw error
  return data
}

export async function deepenConcept(conceptId, topicId) {
  const { data: concept } = await supabase
    .from('concepts')
    .select('title')
    .eq('id', conceptId)
    .single()

  const { data, error } = await supabase.functions.invoke('research-topic', {
    body: {
      type: 'deepen',
      query: concept?.title || '',
      parent_concept_id: conceptId,
      topic_id: topicId,
    },
  })
  if (error) throw error
  return data
}

export async function checkTopicExists(query) {
  const { data, error } = await supabase.functions.invoke('check-topic-exists', {
    body: null,
    method: 'GET',
    headers: {},
  })
  // Edge functions invoke doesn't support GET params easily, use POST workaround
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-topic-exists?q=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
    }
  )
  if (!response.ok) throw new Error('Failed to check topic')
  return response.json()
}

export async function getTopicWithConcepts(topicId) {
  const [topicRes, conceptsRes, questionsRes, edgesRes] = await Promise.all([
    supabase.from('topics').select('*').eq('id', topicId).single(),
    supabase.from('concepts').select('*').eq('topic_id', topicId).order('depth').order('created_at'),
    supabase.from('questions').select('*, concepts!inner(topic_id)').eq('concepts.topic_id', topicId),
    supabase.from('concept_edges').select('*'),
  ])

  // Filter edges to only those belonging to this topic's concepts
  const conceptIds = (conceptsRes.data || []).map(c => c.id)
  const relevantEdges = (edgesRes.data || []).filter(
    e => conceptIds.includes(e.source_concept_id) || conceptIds.includes(e.target_concept_id)
  )

  return {
    topic: topicRes.data,
    concepts: conceptsRes.data || [],
    questions: questionsRes.data || [],
    edges: relevantEdges,
  }
}

export async function getUserTopics() {
  const { data, error } = await supabase
    .from('user_topics')
    .select('*, topics(*)')
    .order('added_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function addUserTopic(topicId) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { error } = await supabase.from('user_topics').upsert(
    { user_id: user.id, topic_id: topicId },
    { onConflict: 'user_id,topic_id' }
  )
  if (error) throw error
}

export async function getUserGamification() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data, error } = await supabase
    .from('user_gamification')
    .select('*')
    .eq('user_id', user.id)
    .single()
  if (error && error.code === 'PGRST116') {
    // No row yet, create one
    const { data: newRow } = await supabase
      .from('user_gamification')
      .insert({ user_id: user.id })
      .select()
      .single()
    return newRow
  }
  if (error) throw error
  return data
}

export async function updateUserGamification(updates) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase
    .from('user_gamification')
    .update(updates)
    .eq('user_id', user.id)
}

export async function updateUserProgress(conceptId, updates) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase
    .from('user_progress')
    .upsert(
      { user_id: user.id, concept_id: conceptId, ...updates },
      { onConflict: 'user_id,concept_id' }
    )
}
