
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { case_title, case_description, legal_area } = await req.json()

    console.log('Processing case analysis for:', case_title)

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      throw new Error('Authentication required')
    }

    // Simulate AI analysis (in production, this would call your trained LLM)
    const aiAnalysis = {
      legal_precedents: [
        `Based on Syrian Civil Law Article 163, similar cases have established precedent for ${legal_area}`,
        `Fiqh principles from Al-Majalla suggest consideration of public interest (maslaha)`,
        `Recent judicial interpretations favor a balanced approach in ${legal_area} matters`
      ],
      key_issues: [
        'Jurisdiction and applicable law determination',
        'Evidence requirements and burden of proof',
        'Potential damages and remedies available'
      ],
      strength_assessment: 'Moderate to Strong',
      estimated_duration: '6-12 months',
      complexity_score: 7.5
    }

    const strategyRecommendations = {
      immediate_actions: [
        'Gather all relevant documentation',
        'Identify and interview potential witnesses',
        'Research recent similar cases in Syrian courts'
      ],
      legal_strategies: [
        'File preliminary motions to establish jurisdiction',
        'Prepare comprehensive evidence portfolio',
        'Consider alternative dispute resolution options'
      ],
      risk_mitigation: [
        'Ensure compliance with procedural requirements',
        'Prepare for potential counter-claims',
        'Document all client communications'
      ]
    }

    // Save analysis to database
    const { data: savedAnalysis, error: saveError } = await supabase
      .from('case_analyses')
      .insert({
        user_id: user.id,
        case_title,
        case_description,
        legal_area,
        ai_analysis: aiAnalysis,
        strategy_recommendations: strategyRecommendations,
        confidence_score: 0.85
      })
      .select()
      .single()

    if (saveError) {
      console.error('Error saving analysis:', saveError)
      throw saveError
    }

    console.log('Case analysis completed successfully')

    return new Response(
      JSON.stringify({
        success: true,
        analysis: savedAnalysis,
        message: 'Case analysis completed successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in case analysis:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
