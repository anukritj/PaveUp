/**
 * OpenAI GPT-4.1 Nano integration for civic issue analysis
 * Analyzes uploaded images and recommends Telangana government portals
 */

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

/**
 * Converts image file to base64 data URL
 * @param {File} imageFile - The image file to convert
 * @returns {Promise<string>} Base64 data URL
 */
function imageToBase64(imageFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(imageFile)
  })
}

/**
 * Analyzes civic issue image using OpenAI GPT-4.1 Nano
 * @param {File} imageFile - The image file to analyze
 * @param {string} language - Language code ('en' for English, 'te' for Telugu)
 * @returns {Promise<Object>} Analysis result with issue type and portal recommendation
 */
export async function analyzeCivicIssue(imageFile, language = 'en') {
  try {
    // Convert image to base64
    const base64Image = await imageToBase64(imageFile)

    // Set language name dynamically for prompts
    const languageName = language === 'te' ? 'Telugu' : 'English'

    const prompt = `You are an expert image analyst. Your first task is to determine if the provided image contains a recognizable civic issue (like a pothole, garbage, broken infrastructure, etc.).

**IMPORTANT: Your entire response must be in the ${languageName} language.**

If it **is** a civic issue, analyze it for Telangana, India, and provide a JSON response with the following structure:
{
  "isCivicIssue": true,
  "issueType": "string - Identify the specific civic problem (pothole, garbage dumping, etc.)",
  "severity": "Low|Medium|High - Rate based on public safety impact",
  "description": "string - Brief description of the observed issue",
  "recommendedPortal": {
    "name": "string - Portal name",
    "department": "string - Government department",
    "website": "string - Official website URL",
    "helpline": "string - Phone number",
    "onlineComplaint": "string - Complaint portal URL"
  },
  "actionSteps": ["array of strings - Step-by-step actions for the citizen"],
  "estimatedResolutionTime": "string - Expected time for resolution"
}

If the image **is not** a recognizable civic issue, provide this JSON structure instead:
{
  "isCivicIssue": false,
  "issueType": "Not a Civic Issue",
  "description": "string - A brief, neutral description of what is in the image (e.g., 'A table of data', 'A person smiling')."
}

If the image is **too blurry or unclear** to analyze, provide this JSON structure:
{
  "isCivicIssue": false,
  "issueType": "Unclear Image",
  "description": "The image is too blurry or unclear to analyze. Please upload a clearer photo."
}

**Telangana Portal Guidelines (only for civic issues):**
- **GHMC**: Hyderabad city issues (roads, garbage, streetlights, water logging) - https://ghmc.gov.in, 040-21111111
- **TSSPDCL/TSNPDCL**: Electrical hazards, power lines - https://www.tssouthernpower.com, 1912
- **HMWS&SB**: Water supply, sewage, drainage - https://www.hyderabadwater.gov.in, 040-23234567
- **Telangana Pollution Control Board**: Environmental violations - https://www.tspcb.gov.in, 040-23320142

Respond only with valid JSON.`

    // Call OpenAI Responses API with GPT-4.1-nano
    const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4.1-nano',
          input: [
            {
              role: 'user',
              content: [
                { type: 'input_text', text: prompt },
                { type: 'input_image', image_url: base64Image }
              ]
            }
          ],
          max_output_tokens: 1500,
          temperature: 0.2,
          text: {
            format: {
              type: 'json_object'  // ✅ Forces the model to output strict JSON
            }
          }
        })
      })
      

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('OpenAI API Error Details:', errorData)
      throw new Error(
        `OpenAI API error: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`
      )
    }

    const data = await response.json()
    console.log('GPT-4.1-nano response:', data)

    // Extract the actual text output
    const analysisText = data.output[0].content[0].text

    // Parse structured JSON
    try {
      const analysis = JSON.parse(analysisText)
      return { success: true, analysis }
    } catch (parseError) {
      console.warn('Fallback: Could not parse JSON, returning text instead')
      return {
        success: true,
        analysis: {
          issueType: 'General Civic Issue',
          severity: 'Medium',
          description: analysisText,
          recommendedPortal: {
            name: 'GHMC Citizen Services',
            department: 'Greater Hyderabad Municipal Corporation',
            website: 'https://ghmc.gov.in',
            helpline: '040-21111111',
            onlineComplaint: 'https://grievance.ghmc.gov.in'
          },
          actionSteps: [
            'Visit the recommended portal',
            'File online complaint with photo',
            'Note complaint reference number',
            'Follow up after 7 days'
          ],
          estimatedResolutionTime: '7-15 days'
        }
      }
    }
  } catch (error) {
    console.error('GPT-4.1-nano analysis error:', error)
    return {
      success: false,
      error: error.message,
      fallback: {
        issueType: 'GPT-4.1-nano Error',
        severity: 'Medium',
        description: `Error: ${error.message}`,
        recommendedPortal: {
          name: 'GHMC Citizen Services',
          department: 'Greater Hyderabad Municipal Corporation',
          website: 'https://ghmc.gov.in',
          helpline: '040-21111111',
          onlineComplaint: 'https://grievance.ghmc.gov.in'
        }
      }
    }
  }
}

/**
 * Get Telangana government portals by issue type
 * @param {string} issueType - The type of civic issue
 * @returns {Object} Portal information
 */
export function getTelanganaPortal(issueType) {
  const portals = {
    pothole: {
      name: 'GHMC Roads Division',
      department: 'Greater Hyderabad Municipal Corporation',
      website: 'https://ghmc.gov.in',
      helpline: '040-21111111',
      onlineComplaint: 'https://grievance.ghmc.gov.in'
    },
    garbage: {
      name: 'GHMC Sanitation Division',
      department: 'Greater Hyderabad Municipal Corporation',
      website: 'https://ghmc.gov.in',
      helpline: '040-21111111',
      onlineComplaint: 'https://grievance.ghmc.gov.in'
    },
    electrical: {
      name: 'TSSPDCL/TSNPDCL',
      department: 'Telangana State Electricity Board',
      website: 'https://www.tssouthernpower.com',
      helpline: '1912',
      onlineComplaint: 'https://complaint.tssouthernpower.com'
    },
    'stray-cattle': {
      name: 'GHMC Veterinary Services',
      department: 'Greater Hyderabad Municipal Corporation',
      website: 'https://ghmc.gov.in',
      helpline: '040-21111111',
      onlineComplaint: 'https://grievance.ghmc.gov.in'
    },
    debris: {
      name: 'GHMC Engineering Division',
      department: 'Greater Hyderabad Municipal Corporation',
      website: 'https://ghmc.gov.in',
      helpline: '040-21111111',
      onlineComplaint: 'https://grievance.ghmc.gov.in'
    },
    'stagnant-water': {
      name: 'HMWS&SB',
      department: 'Hyderabad Metro Water Supply & Sewerage Board',
      website: 'https://www.hyderabadwater.gov.in',
      helpline: '040-23234567',
      onlineComplaint: 'https://complaint.hyderabadwater.gov.in'
    },
    'burning-waste': {
      name: 'Telangana Pollution Control Board',
      department: 'Environment & Forests Department',
      website: 'https://www.tspcb.gov.in',
      helpline: '040-23320142',
      onlineComplaint: 'https://grievance.tspcb.gov.in'
    }
  }

  return portals[issueType] || portals['pothole'] // Default to GHMC
}
