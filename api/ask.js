export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "No question provided" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
你是一位佛學助教 AI。
你只能依據佛教經典與正統佛學概念回答問題。
你的回答需：
1. 使用繁體中文
2. 語氣中性、清楚、教學導向
3. 避免神通、預言、占卜、醫療建議
4. 若問題超出佛學範圍，請婉轉引導回佛學理解
`
          },
          {
            role: "user",
            content: question
          }
        ]
      })
    });

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content;

    res.status(200).json({ answer });
  } catch (error) {
    res.status(500).json({ error: "AI 回應失敗" });
  }
}
