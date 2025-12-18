
import { GoogleGenAI } from "@google/genai";
import { Restaurant } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function searchRestaurants(
  location: string, 
  preference: string,
  minRating: number,
  userCoords?: { latitude: number; longitude: number }
): Promise<{ text: string; restaurants: Restaurant[]; sources: Array<{title: string, uri: string}> }> {
  try {
    const systemInstruction = `你是一位專業的全球烹飪與文化專家。你的任務是協助使用者尋找完美的實體餐廳。

【核心規則】：
1. 你「必須」且「只能」使用 Google Maps 工具來搜尋真實存在的餐廳資訊。
2. 絕對不可憑空捏造餐廳名稱或地址。
3. 嚴格遵守使用者的偏好（如：非西方、亞洲料理、健康餐等）。利用你的烹飪知識判斷餐廳是否符合該文化分類。
4. 推薦的餐廳評分必須高於使用者設定的最低要求。
5. 在你的文字回應中，請簡短介紹每間餐廳的特色、氛圍以及它為何符合使用者的特定需求。
6. 所有的推薦都必須在 Google Maps Grounding 元數據中提供對應的連結。`;

    const userPrompt = `請幫我在「${location}」尋找符合「${preference}」要求且評分至少為 ${minRating} 顆星的餐廳。請利用 Google Maps 工具提供推薦。`;

    const config: any = {
      tools: [{ googleMaps: {} }],
      systemInstruction: systemInstruction,
    };

    // If explicit coordinates are provided (from geolocation API), pass them to toolConfig
    if (userCoords) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: userCoords.latitude,
            longitude: userCoords.longitude
          }
        }
      };
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: config,
    });

    const aiText = response.text || "我為您找到了一些符合條件的餐廳！";
    
    // Extraction logic for grounding metadata
    const candidates = response.candidates || [];
    const groundingMetadata = candidates[0]?.groundingMetadata;
    const chunks = groundingMetadata?.groundingChunks || [];
    
    const sources: Array<{title: string, uri: string}> = [];
    const restaurants: Restaurant[] = [];

    // Filter and map grounding chunks to source list and restaurant objects
    chunks.forEach((chunk: any, index: number) => {
      if (chunk.maps) {
        const title = chunk.maps.title || "未知餐廳";
        const uri = chunk.maps.uri || "#";
        
        // Avoid duplicate sources
        if (!sources.some(s => s.uri === uri)) {
          sources.push({ title, uri });
        }

        // Create a restaurant entry for each valid map chunk
        restaurants.push({
          id: `res-${index}-${Date.now()}`,
          name: title,
          mapUrl: uri,
          description: "查看地圖以獲取最新營業時間與完整評論。",
          matchReason: `這間餐廳位於 ${location}，且符合您對「${preference}」的喜好。`,
          // Optionally extract snippets if available in the schema
          reviewSnippets: chunk.maps.placeAnswerSources?.map((s: any) => s.reviewSnippets).flat().filter(Boolean) || []
        });
      }
    });

    return {
      text: aiText,
      restaurants: restaurants,
      sources: sources
    };
  } catch (error) {
    console.error("Gemini API Error Details:", error);
    throw new Error("搜尋過程中發生錯誤。請確認地點描述是否清楚，或稍後再試。");
  }
}
