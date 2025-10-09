import { GoogleGenAI, Type } from "@google/genai";
import type { Ingredient, UserProfile, Recipe } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const recipeSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: 'レシピの日本語名' },
      description: { type: Type.STRING, description: 'レシピの簡単な説明（30文字程度）' },
      ingredients: {
        type: Type.ARRAY,
        description: '材料とその分量のリスト（日本語）',
        items: { type: Type.STRING }
      },
      instructions: {
        type: Type.ARRAY,
        description: '調理手順のリスト（日本語）',
        items: { type: Type.STRING }
      }
    },
    required: ['title', 'description', 'ingredients', 'instructions']
  }
};

export const getRecipeSuggestions = async (ingredients: Ingredient[], profile: UserProfile): Promise<Recipe[]> => {
  if (ingredients.length < 2) {
    throw new Error("レシピを提案するには、少なくとも2つの材料が必要です。");
  }

  const ingredientNames = ingredients.map(i => i.name).join(', ');
  
  let goalDescription;
  switch (profile.goal) {
    case 'diet':
      goalDescription = 'ダイエット中（低カロリー、低糖質、高タンパクを意識）';
      break;
    case 'pregnancy':
      goalDescription = '妊娠中（葉酸、鉄分、カルシウムを意識し、生魚やアルコールなど避けるべき食材を含まない）';
      break;
    default:
      goalDescription = '標準的な食事';
  }


  const prompt = `
    あなたは日本の家庭料理の専門家です。ユーザーが冷蔵庫にある材料を使って何を作るか決めるのを手伝ってください。

    # 提供された材料:
    ${ingredientNames}

    # ユーザーの目標:
    ${goalDescription}

    # 指示:
    1. 上記の材料を少なくとも2つ以上使った、日本の家庭で人気のレシピを最大10個提案してください。
    2. 和食、洋食、中華など、ジャンルは問いません。
    3. 一般的な調味料（醤油、みりん、塩、砂糖、油など）は、ユーザーが持っているものとして自由に使って構いません。
    4. もしユーザーの目標が「妊娠中」の場合、リステリア菌のリスクがある生の魚介類、ナチュラルチーズ、生ハムや、アルコールを含むレシピは絶対に提案しないでください。
    5. 各レシピについて、以下のJSONスキーマに厳密に従って、JSON配列形式で応答してください。
  `;
  
  let responseText = '';
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });

    responseText = response.text?.trim() ?? '';

    // If the model returns an empty string, treat it as "no results found"
    // instead of letting JSON.parse fail and show a generic error.
    if (!responseText) {
      console.warn("Gemini API returned an empty response, treating as no recipes found.");
      return [];
    }

    const parsedRecipes = JSON.parse(responseText);
    
    // Add client-side unique ID and isFavorite flag.
    // Use a compatible method instead of crypto.randomUUID() for broader browser support.
    return parsedRecipes.map((recipe: Omit<Recipe, 'id' | 'isFavorite'>, index: number) => ({
      ...recipe,
      id: `${Date.now()}-${index}`,
      isFavorite: false
    }));

  } catch (error) {
    console.error("Gemini API error or JSON parsing error:", error);
    
    if (error instanceof SyntaxError) {
      console.error("Failed to parse JSON from Gemini. Response text:", responseText);
      throw new Error("サーバーからの応答形式が正しくありませんでした。もう一度お試しください。");
    }

    throw new Error("レシピの取得中にエラーが発生しました。もう一度お試しください。");
  }
};
