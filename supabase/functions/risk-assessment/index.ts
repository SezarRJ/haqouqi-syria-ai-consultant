
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

    const { case_id, assessment_data } = await req.json()

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      throw new Error('Authentication required')
    }

    console.log('Performing risk assessment for case:', case_id)

    // Calculate risk score based on various factors
    const riskFactors = calculateRiskFactors(assessment_data)
    const riskScore = calculateOverallRisk(riskFactors)

    const mitigationStrategies = generateMitigationStrategies(riskFactors)

    // Save risk assessment
    const { data: savedAssessment, error: saveError } = await supabase
      .from('risk_assessments')
      .insert({
        user_id: user.id,
        case_id,
        assessment_data,
        risk_score: riskScore,
        risk_factors: riskFactors,
        mitigation_strategies: mitigationStrategies
      })
      .select()
      .single()

    if (saveError) {
      console.error('Error saving risk assessment:', saveError)
      throw saveError
    }

    console.log('Risk assessment completed successfully')

    return new Response(
      JSON.stringify({
        success: true,
        assessment: savedAssessment,
        message: 'Risk assessment completed successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in risk assessment:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

function calculateRiskFactors(data: any) {
  return {
    legal_complexity: data.complexity_level * 20,
    evidence_strength: (10 - data.evidence_quality) * 10,
    procedural_risk: data.procedural_issues ? 30 : 10,
    financial_exposure: Math.min(data.claim_amount / 1000, 40),
    time_sensitivity: data.urgency_level * 15,
    opposing_party_strength: data.opponent_resources * 12
  }
}

function calculateOverallRisk(factors: any): number {
  const weights = {
    legal_complexity: 0.25,
    evidence_strength: 0.20,
    procedural_risk: 0.15,
    financial_exposure: 0.20,
    time_sensitivity: 0.10,
    opposing_party_strength: 0.10
  }

  let totalRisk = 0
  Object.entries(factors).forEach(([key, value]) => {
    totalRisk += (value as number) * weights[key as keyof typeof weights]
  })

  return Math.round(totalRisk * 100) / 100
}

function generateMitigationStrategies(factors: any) {
  const strategies = []

  if (factors.legal_complexity > 50) {
    strategies.push('Consider engaging specialized legal counsel')
    strategies.push('Conduct comprehensive legal research')
  }

  if (factors.evidence_strength > 60) {
    strategies.push('Strengthen evidence collection efforts')
    strategies.push('Engage expert witnesses if necessary')
  }

  if (factors.procedural_risk > 20) {
    strategies.push('Review all procedural requirements carefully')
    strategies.push('Set up timeline monitoring system')
  }

  if (factors.financial_exposure > 30) {
    strategies.push('Consider litigation insurance')
    strategies.push('Explore settlement opportunities')
  }

  return strategies
}
