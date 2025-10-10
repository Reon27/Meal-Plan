
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Ingredient, MealSet } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd show a user-friendly error.
  // For this environment, we assume the key is set.
  console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    recipeName: { type: Type.STRING, description: '料理名' },
    description: { type: Type.STRING, description: '料理の簡単な説明' },
    ingredients: {
      type: Type.ARRAY,
      description: '材料のリスト',
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: '材料名' },
          amount: { type: Type.STRING, description: '分量' },
        },
        required: ['name', 'amount'],
      },
    },
    steps: {
      type: Type.ARRAY,
      description: '調理手順のリスト',
      items: { type: Type.STRING },
    },
    cookingTime: { type: Type.NUMBER, description: '調理時間（分）' },
    calories: { type: Type.NUMBER, description: 'カロリー（kcal）。ダイエット中でない場合は省略可' },
    pfc: {
      type: Type.OBJECT,
      description: 'PFCバランス。ダイエット中でない場合は省略可',
      properties: {
        protein: { type: Type.NUMBER, description: 'タンパク質（g）' },
        fat: { type: Type.NUMBER, description: '脂質（g）' },
        carbs: { type: Type.NUMBER, description: '炭水化物（g）' },
      },
    },
    specialNotes: { type: Type.STRING, description: '妊婦やダイエット中の人向けの特別なアドバイスや注意点。該当しない場合は省略' },
  },
  required: ['recipeName', 'description', 'ingredients', 'steps', 'cookingTime'],
};

const mealSetSchema = {
  type: Type.ARRAY,
  description: '提案する献立セットの配列。3セット提案してください。',
  items: {
    type: Type.OBJECT,
    properties: {
      main: { ...recipeSchema, description: '主菜のレシピ' },
      side: { ...recipeSchema, description: '副菜のレシピ' },
      soup: { ...recipeSchema, description: '汁物のレシピ' },
    },
    required: ['main', 'side', 'soup'],
  },
};

const generatePrompt = (
  profile: UserProfile,
  inventory: Ingredient[],
  saleItems: Ingredient[],
  filters: string[],
  expiringSoon: Ingredient[]
): string => {
  let prompt = `
あなたは日本の家庭料理に詳しい、親切な献立提案AIです。ユーザーの情報に基づいて、栄養バランスの取れた美味しい献立を提案してください。

# ユーザー情報
- タイプ: ${profile.userType}
- アレルギー: ${profile.allergens.length > 0 ? profile.allergens.join(', ') : 'なし'}

# 利用可能な食材
- 冷蔵庫の中身: ${inventory.map(i => i.name).join(', ') || 'なし'}
- 今日の特売品: ${saleItems.map(i => i.name).join(', ') || 'なし'}
- もうすぐ期限切れの食材: ${expiringSoon.map(i => i.name).join(', ') || 'なし'}

# 献立への希望
- ${filters.length > 0 ? filters.join(', ') : '特になし'}

# 指示
1.  上記の情報を総合的に考慮し、**主菜・副菜・汁物**で構成される献立セットを**3つ**提案してください。
2.  **冷蔵庫の中身**と**特売品**を積極的に活用し、フードロス削減と節約を意識したレシピにしてください。
3.  特に**もうすぐ期限切れの食材**を優先的に使ってください。
4.  ユーザーのタイプに応じて、以下を厳守してください。
    - **妊婦向け**: アルコール、生の魚介類、ナチュラルチーズなど、妊娠中に避けるべき食材は絶対に使用しないでください。鉄分や葉酸が豊富な食材を意識的に取り入れてください。「specialNotes」に、なぜそのメニューが妊婦におすすめか、あるいは注意すべき点を簡潔に記述してください。
    - **ダイエット中向け**: カロリーとPFCバランスを計算し、ヘルシーな調理法（蒸す、茹でるなど）を取り入れたレシピにしてください。「calories」と「pfc」の項目は必須です。「specialNotes」に、ダイエットに役立つTIPSを記述してください。
5.  アレルギー食材は絶対に使用しないでください。
6.  全てのレシピは、初心者でも分かりやすいように、手順を細かく記述してください。
7.  JSON形式でのみ回答してください。その他のテキストは一切含めないでください。
`;
  return prompt.trim();
};


export const suggestMealSets = async (
  profile: UserProfile,
  inventory: Ingredient[],
  saleItems: Ingredient[],
  filters: string[],
  expiringSoon: Ingredient[]
): Promise<MealSet[]> => {
    if (!API_KEY) {
        throw new Error("Gemini API key is not configured.");
    }

  const prompt = generatePrompt(profile, inventory, saleItems, filters, expiringSoon);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: mealSetSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsedResponse = JSON.parse(jsonString);
    
    // Add a unique ID to each meal set for React keys
    return parsedResponse.map((set: Omit<MealSet, 'id'>) => ({
      ...set,
      id: crypto.randomUUID(),
    }));

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("AIによる献立の提案に失敗しました。しばらくしてからもう一度お試しください。");
  }
};
