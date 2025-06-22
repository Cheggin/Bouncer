import { supabase } from '@/lib/supabase';

export interface RiskCalculationResult {
  success: boolean;
  risk_score?: number;
  reasoning?: string;
  risk_factors?: string[];
  error?: string;
}

export const calculateRiskForAllUsers = async (customPrompt?: string): Promise<RiskCalculationResult[]> => {
  try {
    console.log('🧪 Testing Render API with real Supabase data for all users...');

    // Fetch only users with risk_level = 0 (inference only called for these users)
    console.log('🔄 Fetching users with risk_level = 0 from Supabase...');
    const { data: profiles, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('risk_level', 0);

    if (fetchError) {
      console.error('❌ Error fetching profiles:', fetchError.message);
      return [{ success: false, error: 'Failed to fetch profiles' }];
    }

    if (!profiles || profiles.length === 0) {
      console.log('ℹ️ No users found with risk_level = 0. Inference only runs for users with risk_level = 0.');
      return [];
    }
    
    console.log(`✅ Fetched ${profiles.length} users with risk_level = 0 from database`);
    console.log('📝 Activity log: Starting inference for users with risk_level = 0 only');

    const results: RiskCalculationResult[] = [];
    const renderApiUrl = 'https://bouncer-backend-t8m1.onrender.com';

    // Process each profile
    for (let i = 0; i < profiles.length; i++) {
      const profile = profiles[i];
      
      // Skip users with no meaningful data to search
      const hasName = profile.full_name && profile.full_name.trim().length > 0;
      const hasEmail = profile.email && profile.email.trim().length > 0;
      
      if (!hasName && !hasEmail) {
        console.log(`⏭️ Skipping user ${i + 1}/${profiles.length}: ${profile.full_name || 'No name'} (ID: ${profile.id}) - no searchable data`);
        results.push({
          success: false,
          error: 'No searchable data (empty name and email)'
        });
        continue;
      }
      
      console.log(`\n🔄 Processing user ${i + 1}/${profiles.length}: ${profile.full_name} (ID: ${profile.id})`);

      try {
        // Prepare data for the API call - use custom prompt if provided, otherwise use default
        const analysisPrompt = customPrompt || `You are a risk assessment AI analyzing user data for potential security threats. 
Analyze the following user information and provide a risk score from 0-100.`;
        
        console.log('📝 Using Claude prompt:', analysisPrompt);
        
        // Format the user text with quotes as requested
        const userText = `"${profile.full_name || ''}" OR "${profile.email || ''}"`;

        // Debug: Show exactly what we're searching for
        console.log('🔍 Search data:');
        console.log('  - Name:', profile.full_name || 'EMPTY');
        console.log('  - Email:', profile.email || 'EMPTY');
        console.log('  - Search text:', userText);

        // Call your Render API with FormData
        console.log('📤 Sending request to Render API...');
        console.log('📝 Sending prompt:', analysisPrompt);
        console.log('📄 Sending text:', userText);

        const formData = new FormData();
        formData.append('prompt', analysisPrompt);
        formData.append('text', userText);

        const response = await fetch(`${renderApiUrl}/analyze-summaries`, {
          method: 'POST',
          body: formData,
        });

        console.log('📊 Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Error response body:', errorText);
          results.push({ 
            success: false, 
            error: `HTTP error! status: ${response.status}, message: ${errorText}` 
          });
          continue;
        }

        const responseText = await response.text();
        console.log('📥 Raw response text:', responseText);
        
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('❌ Failed to parse JSON response:', parseError);
          results.push({ 
            success: false, 
            error: `Failed to parse response: ${responseText}` 
          });
          continue;
        }

        // Validate the response
        console.log('\n🔍 Validating response...');
        const { risk_score, explanation, raw_summaries } = data;

        if (typeof risk_score !== 'number' || risk_score < 0 || risk_score > 100) {
          console.error('❌ Invalid risk_score:', risk_score);
          results.push({ 
            success: false, 
            error: `Invalid risk_score: ${risk_score}` 
          });
          continue;
        }

        if (typeof explanation !== 'string' || explanation.length === 0) {
          console.error('❌ Invalid explanation string:', explanation);
          results.push({ 
            success: false, 
            error: 'Invalid or missing explanation' 
          });
          continue;
        }

        if (typeof raw_summaries !== 'object' || raw_summaries === null || !raw_summaries.summaries) {
          console.error('❌ Invalid raw_summaries object:', raw_summaries);
          results.push({ 
            success: false, 
            error: 'Invalid or missing raw_summaries' 
          });
          continue;
        }

        console.log('✅ Validation passed!');
        console.log('🎯 Risk Score:', risk_score);
        console.log('📝 Explanation:', explanation);
        
        // Update the database with the risk calculation results
        console.log('💾 Updating database with risk calculation results...');
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            risk_level: risk_score,
            reasoning_summary: { explanation: explanation },
            raw_json: raw_summaries
          })
          .eq('id', profile.id);

        if (updateError) {
          console.error('❌ Error updating profile:', updateError.message);
          results.push({ 
            success: false, 
            error: `Failed to update profile: ${updateError.message}` 
          });
          continue;
        }

        console.log('✅ Database updated successfully!');
        console.log(`📊 Updated profile ${profile.id} with risk score: ${risk_score}`);
        
        results.push({
          success: true,
          risk_score: risk_score,
          reasoning: explanation,
          risk_factors: []
        });

      } catch (profileError) {
        console.error(`❌ Error processing profile ${profile.id}:`, profileError);
        results.push({ 
          success: false, 
          error: `Error processing profile: ${profileError}` 
        });
      }

      // Add a small delay to avoid overwhelming the API
      if (i < profiles.length - 1) {
        console.log('⏳ Waiting 1 second before next request...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Final summary
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;
    
    console.log('\n🎉 Risk calculation for all users complete!');
    console.log(`✅ Successfully processed: ${successCount} users`);
    console.log(`❌ Failed to process: ${failureCount} users`);
    
    if (failureCount > 0) {
      console.log('\n📋 Failed users:');
      results.forEach((result, index) => {
        if (!result.success) {
          console.log(`  - ${profiles[index].full_name}: ${result.error}`);
        }
      });
    }

    return results;

  } catch (error) {
    console.error('❌ Error calculating risk for all users:', error);
    return [{ success: false, error: String(error) }];
  }
};

// Alternative: If FormData continues to cause issues, try using JSON instead
export const calculateRiskForAllUsersJSON = async (): Promise<RiskCalculationResult[]> => {
  try {
    console.log('🧪 Testing Render API with JSON payload...');

    const { data: profiles, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('risk_level', 0);

    if (fetchError || !profiles || profiles.length === 0) {
      return [{ success: false, error: 'Failed to fetch profiles with risk_level = 0 or no such profiles found' }];
    }

    const results: RiskCalculationResult[] = [];
    const renderApiUrl = 'https://bouncer-backend-t8m1.onrender.com';

    for (let i = 0; i < profiles.length; i++) {
      const profile = profiles[i];
      
      try {
        const analysisPrompt = `You are a risk assessment AI analyzing user data for potential security threats. 
Analyze the following user information and provide a risk score from 0-100.`;
        const userText = `"${profile.full_name || ''}" OR "${profile.email || ''}"`;

        // Try JSON payload instead of FormData
        const response = await fetch(`${renderApiUrl}/analyze-summaries`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: analysisPrompt,
            text: userText
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          results.push({ 
            success: false, 
            error: `HTTP ${response.status}: ${errorText}` 
          });
          continue;
        }

        const data = await response.json();
        
        // Validate and update as before...
        if (data.risk_score && data.explanation && data.raw_summaries) {
          await supabase
            .from('profiles')
            .update({ 
              risk_level: data.risk_score,
              reasoning_summary: { explanation: data.explanation },
              raw_json: data.raw_summaries
            })
            .eq('id', profile.id);

          results.push({
            success: true,
            risk_score: data.risk_score,
            reasoning: data.explanation,
            risk_factors: []
          });
        } else {
          results.push({ 
            success: false, 
            error: 'Invalid response structure' 
          });
        }

      } catch (error) {
        results.push({ 
          success: false, 
          error: String(error) 
        });
      }

      if (i < profiles.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;

  } catch (error) {
    return [{ success: false, error: String(error) }];
  }
};