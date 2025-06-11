
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

    const { template_id, document_data } = await req.json()

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      throw new Error('Authentication required')
    }

    console.log('Generating document for template:', template_id)

    // Get template
    const { data: template, error: templateError } = await supabase
      .from('document_templates')
      .select('*')
      .eq('id', template_id)
      .single()

    if (templateError || !template) {
      throw new Error('Template not found')
    }

    // Generate document content by replacing placeholders
    let generatedContent = template.template_content

    // Replace placeholders with actual data
    Object.entries(document_data).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`
      generatedContent = generatedContent.replace(new RegExp(placeholder, 'g'), String(value))
    })

    // Add current date
    const currentDate = new Date().toLocaleDateString('ar-SY')
    generatedContent = generatedContent.replace(/{{current_date}}/g, currentDate)

    // Save generated document
    const { data: savedDocument, error: saveError } = await supabase
      .from('generated_documents')
      .insert({
        user_id: user.id,
        template_id,
        document_data,
        generated_content: generatedContent,
        status: 'draft'
      })
      .select()
      .single()

    if (saveError) {
      console.error('Error saving document:', saveError)
      throw saveError
    }

    console.log('Document generated successfully')

    return new Response(
      JSON.stringify({
        success: true,
        document: savedDocument,
        message: 'Document generated successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in document drafting:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
