// Test file for Render API using multipart/form-data with real Supabase data
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// --- Configuration ---
// Load the .env file from the current directory
dotenv.config({ path: path.resolve(__dirname, './.env') });

// Make sure you have a .env file in your Bouncer/Bouncer directory with these variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const renderApiUrl = 'https://bouncer-backend-t8m1.onrender.com';

// --- Supabase Client Initialization ---
if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: Missing Supabase URL or Key. Make sure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are in your .env file.");
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

async function testWithRealData() {
  try {
    console.log('🧪 Testing Render API with real Supabase data...');

    // 1. Fetch a real user from your profiles table
    console.log('🔄 Fetching a user from Supabase...');
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .single(); // Using .single() to get one record or null

    if (fetchError) {
      console.error('❌ Error fetching profile:', fetchError.message);
      return false;
    }

    if (!profile) {
      console.error('❌ No profiles found in the database to test with.');
      return false;
    }
    
    console.log(`✅ Fetched user: ${profile.full_name} (ID: ${profile.id})`);

    // 2. Prepare data for the API call
    const analysisPrompt = `You are a risk assessment AI analyzing user data for potential security threats. 
Analyze the following user information and provide a risk score from 0-100.`;
    
    // Format the user text with quotes as requested
    const userText = `"${profile.full_name || ''}" OR "${profile.email || ''}"`;

    const formData = new FormData();
    formData.append('prompt', analysisPrompt);
    formData.append('text', userText);

    // 3. Call your Render API
    console.log('📤 Sending request to Render API...');
    console.log('📝 Sending prompt:', analysisPrompt);
    console.log('📄 Sending text:', userText);

    const response = await fetch(`${renderApiUrl}/analyze-summaries`, {
      method: 'POST',
      body: formData,
    });

    console.log('📊 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('📥 Raw response:', JSON.stringify(data, null, 2));

    // 4. Validate the response
    console.log('\n🔍 Validating response...');
    const { risk_score, explanation, raw_summaries } = data;

    if (typeof risk_score !== 'number' || risk_score < 0 || risk_score > 100) {
      console.error('❌ Invalid risk_score:', risk_score);
      return false;
    }

    if (typeof explanation !== 'string' || explanation.length === 0) {
      console.error('❌ Invalid explanation string:', explanation);
      return false;
    }

    if (typeof raw_summaries !== 'object' || raw_summaries === null || !raw_summaries.summaries) {
      console.error('❌ Invalid raw_summaries object:', raw_summaries);
      return false;
    }

    console.log('✅ Validation passed!');
    console.log('🎯 Risk Score:', risk_score);
    console.log('📝 Explanation:', explanation);
    
    // 5. Update the database with the risk calculation results
    console.log('💾 Updating database with risk calculation results...');
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        risk_level: risk_score,
        reasoning_summary: { explanation: explanation }, // Store explanation in a JSON object
        raw_json: raw_summaries // Store the raw summaries object
      })
      .eq('id', profile.id);

    if (updateError) {
      console.error('❌ Error updating profile:', updateError.message);
      return false;
    }

    console.log('✅ Database updated successfully!');
    console.log(`📊 Updated profile ${profile.id} with risk score: ${risk_score}`);
    
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Run the test
testWithRealData().then(success => {
  if (success) {
    console.log('\n🎉 Test with real data PASSED!');
  } else {
    console.log('\n💥 Test with real data FAILED!');
  }
}); 