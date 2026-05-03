import { GoogleGenAI, Type } from '@google/genai';
import { UserProfile } from './firebase';

export const generateCareerProfile = async (profile: Partial<UserProfile>) => {
  const apiKey = localStorage.getItem('gemini_api_key') || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("API Key is missing. Please provide it in the top bar.");
  
  const ai = new GoogleGenAI({ apiKey });

  // Format experience for AI
  const expText = profile.experiences?.map(e => `${e.title} at ${e.company} for ${e.duration}. Resp: ${e.responsibilities}`).join('; ') || 'No previous experience';

  const prompt = `You are a high-level Career Strategy Expert for Pakistan's workforce. Based on this complex worker profile, generate a comprehensive professional analysis.

  Worker Profile:
  - Professional Area: ${profile.profession}
  - Full Name: ${profile.name}
  - Experience Details: ${expText}
  - Highest Education: ${profile.education?.level} at ${profile.education?.institute} (Year: ${profile.education?.year})
  - Certifications: ${profile.education?.certifications}
  - Technical Skills: ${profile.technicalSkills?.join(', ')}
  - Soft Skills: ${profile.softSkills?.join(', ')}
  - Detailed Description: ${profile.skillsDescription}
  - Languages: ${profile.languages?.join(', ')}
  - City: ${profile.city}
  - Goals: ${profile.goals?.join(', ')}
  - Target Salary: Rs. ${profile.salaryExpectation}
  - Awards: ${profile.awards}

  TASK:
  1. Generate a formal Job Title that upgrades their social status (e.g., instead of 'Mechanic', use 'Senior Automotive Technician').
  2. Provide strengths and improvement areas in Urdu.
  3. Create an ATS-optimized professional objective and experience summary in English.
  4. Find 4 realistic matching job types in Pakistan with salary ranges.
  5. Provide 3 specific interview questions and expert answers in Urdu.
  6. Create a persuasive Urdu salary negotiation script.
  7. Provide a brief salary analysis and 3 power negotiation tips.

  CRITICAL: Supply Urdu fields in Urdu, and English fields in English. Return valid JSON.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          careerScore: { type: Type.NUMBER, description: "0-100 based on marketability" },
          formalTitle: { type: Type.STRING, description: "professional job title in English" },
          urduTitle: { type: Type.STRING, description: "same in Urdu" },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "list of strings in Urdu" },
          improvements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "list of strings in Urdu" },
          skillTags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "skill keywords" },
          cvData: {
            type: Type.OBJECT,
            properties: {
              objective: { type: Type.STRING, description: "professional objective in English" },
              technicalSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              softSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              experienceDescription: { type: Type.STRING, description: "comprehensive experience summary in English" }
            }
          },
          jobMatches: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                titleEn: { type: Type.STRING },
                titleUr: { type: Type.STRING },
                company: { type: Type.STRING },
                location: { type: Type.STRING },
                salaryMin: { type: Type.NUMBER },
                salaryMax: { type: Type.NUMBER },
                matchPercent: { type: Type.NUMBER },
                skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                applyTip: { type: Type.STRING, description: "Expert Tip in Urdu" }
              }
            }
          },
          interviewQuestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING, description: "in Urdu" },
                sampleAnswer: { type: Type.STRING, description: "in Urdu" },
                tip: { type: Type.STRING, description: "in Urdu" }
              }
            }
          },
          salaryScript: { type: Type.STRING, description: "Urdu negotiation script" },
          salaryAnalysis: { type: Type.STRING, description: "Short market analysis in Urdu" },
          negotiationTips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 tips in Urdu" }
        },
        required: ["careerScore", "formalTitle", "urduTitle", "strengths", "improvements", "skillTags", "cvData", "jobMatches", "interviewQuestions", "salaryScript", "salaryAnalysis", "negotiationTips"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to parse Gemini response as JSON", response.text);
    throw new Error("AI output was not valid JSON. Please try again.");
  }
};
