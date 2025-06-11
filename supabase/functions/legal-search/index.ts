
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { query, document_type, category, limit = 10 } = await req.json()

    console.log('Performing legal search for:', query)

    // Build search filters
    let searchQuery = supabase
      .from('legal_documents')
      .select('*')

    if (document_type) {
      searchQuery = searchQuery.eq('document_type', document_type)
    }

    if (category) {
      searchQuery = searchQuery.eq('category', category)
    }

    // For now, use text search. In production, implement semantic search with embeddings
    const { data: results, error } = await searchQuery
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .limit(limit)

    if (error) {
      console.error('Search error:', error)
      throw error
    }

    // Simulate relevance scoring (in production, use vector similarity)
    const rankedResults = results?.map(doc => ({
      ...doc,
      relevance_score: Math.random() * 0.3 + 0.7, // Simulated score between 0.7-1.0
      highlights: extractHighlights(doc.content, query)
    })).sort((a, b) => b.relevance_score - a.relevance_score)

    console.log(`Found ${rankedResults?.length || 0} results for query: ${query}`)

    return new Response(
      JSON.stringify({
        success: true,
        results: rankedResults,
        total: rankedResults?.length || 0,
        query
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in legal search:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

function extractHighlights(content: string, query: string): string[] {
  const words = query.toLowerCase().split(' ')
  const sentences = content.split('. ')
  
  return sentences
    .filter(sentence => 
      words.some(word => sentence.toLowerCase().includes(word))
    )
    .slice(0, 3)
    .map(sentence => sentence.trim())
}
