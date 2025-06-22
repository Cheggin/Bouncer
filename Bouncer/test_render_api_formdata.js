// Test file for Render API using multipart/form-data
const RENDER_API_URL = 'https://bouncer-backend-t8m1.onrender.com';

// Test user data
const testUser = {
  name: "Sean Diddy Combs",
  email: "jane.doe@example.com",
  city: "Los Angeles",
  zipCode: "90001"
};

async function testRenderAPI() {
  try {
    console.log('🧪 Testing Render API with multipart/form-data...');
    console.log('📤 Sending request to:', `${RENDER_API_URL}/analyze-summaries`);

    // The prompt for the analysis
    const analysisPrompt = `You are a risk assessment AI analyzing user data for potential security threats. 
Analyze the following user information and provide a risk score from 0-100.`;

    // The text data to be analyzed
    const userText = `${testUser.name} OR ${testUser.email} OR ${testUser.city} OR ${testUser.zipCode}`;

    // Create a FormData object to build the multipart request
    const formData = new FormData();
    formData.append('prompt', analysisPrompt);
    formData.append('text', userText);

    console.log('📝 Sending prompt:', analysisPrompt);
    console.log('📄 Sending text:', userText);

    // Send the request using FormData
    // Note: We do not set the 'Content-Type' header manually. 
    // The browser/fetch will automatically set it to 'multipart/form-data' with the correct boundary.
    const response = await fetch(`${RENDER_API_URL}/analyze-summaries`, {
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

    // --- Validation ---
    console.log('\n🔍 Validating response format...');
    const riskScore = data.risk_score;
    if (typeof riskScore !== 'number' || riskScore < 0 || riskScore > 100) {
      console.error('❌ Invalid risk_score:', riskScore, '(should be a number between 0-100)');
      return false;
    }

    console.log('✅ Validation passed!');
    console.log('🎯 Risk Score:', riskScore);
    
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Run the test
if (typeof module !== 'undefined' && require.main === module) {
  testRenderAPI().then(success => {
    if (success) {
      console.log('\n🎉 Render API test PASSED!');
    } else {
      console.log('\n💥 Render API test FAILED!');
    }
  });
}

module.exports = { testRenderAPI }; 