import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })
    }

    try {
        const { category, gender } = await req.json()

        const prompt = `أنت مساعد لاقتراح أسماء المواليد. اقترح 6 أسماء ${gender === 'boy' ? 'للأولاد' : gender === 'girl' ? 'للبنات' : 'للمواليد (مزيج)'} من النوع ${category} (عربي، أجنبي، أو شرقي). 
    للأسماء الشرقية، ركز على الأسماء الشائعة في الثقافة الخليجية والشامية.
    يجب أن تتضمن الإجابة اسم كل مولود ومعناه الجميل باختصار.
    يجب أن تكون الإجابة عبارة عن كائن JSON فقط بالهيكل التالي:
    {
      "names": [
        {"name": "الاسم", "meaning": "المعنى باختصار", "gender": "${gender || 'unknown'}"}
      ]
    }`

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: "You return strictly JSON in Arabic." },
                    { role: "user", content: prompt }
                ],
                response_format: { type: "json_object" }
            })
        })

        const result = await response.json()
        const content = JSON.parse(result.choices[0].message.content)

        return new Response(JSON.stringify(content), {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
            },
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        })
    }
})
