import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')

serve(async (req) => {
    // Handle CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Content-Type': 'application/json'
    }

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers })
    }

    try {
        if (!GROQ_API_KEY) {
            throw new Error("GROQ_API_KEY is not configured in Supabase secrets.")
        }

        const { week, area, userInput } = await req.json()

        let systemPrompt = "You are a professional pregnancy wellness advisor. Return strictly JSON in Arabic. Your advice should be specific, encouraging, and based on the provided pregnancy week."
        let userPrompt = ""

        if (area === 'nursery') {
            if (userInput) {
                userPrompt = `أنا في الأسبوع ${week} من الحمل. بخصوص تصميم غرفة المولود وموضوع ${area}، لدي الاستفسار التالي: "${userInput}". 
                أجب على سؤالي بشكل مفصل ومحتوف في سياق تصميم الغرف.
                الإجابة يجب أن تكون JSON ككائن يحتوي على "response" (نص الإجابة) ومصفوفة "suggested_actions" (قائمة نصائح قصيرة).`
            } else {
                userPrompt = `أنا في الأسبوع رقم ${week} من الحمل. قدم لي 3 أفكار مبتكرة لتصميم ديكور غرفة المولود الجديد (Nursery Design) باللغة العربية. 
                يجب أن تشمل الأفكار: الألوان المقترحة، الثيم، وقطعة أثاث مميزة.
                الإجابة يجب أن تكون JSON ككائن يحتوي على "ideas" كل عنصر فيها يحتوي على "title", "colors", "theme", "furniture".`
            }
        } else {
            if (userInput) {
                userPrompt = `أنا في الأسبوع رقم ${week} من الحمل. بخصوص روتين العناية بـ ${area}، لدي الاستفسار التالي: "${userInput}". 
                أجب على سؤالي بشكل علمي وآمن للحمل.
                الإجابة يجب أن تكون JSON ككائن يحتوي على "response" (نص الإجابة) ومصفوفة "key_tips" (نصائح رئيسية). أضف أيضاً "safety_warning" إذا لزم الأمر.`
            } else {
                userPrompt = `أنا في الأسبوع رقم ${week} من الحمل. قدم لي روتين عناية احترافي وشامل (Professional Care Routine) لمنطقة ${area} باللغة العربية.
                الروتين يجب أن يكون فعالاً وآمناً تماماً للحمل. 
                الإجابة يجب أن تكون JSON ككائن يحتوي على "routine_title" ومصفوفة "steps" كل خطوة تحتوي على "action" و "benefit". أضف أيضاً "safety_note" و "expert_tip".`
            }
        }

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.5,
                response_format: { type: "json_object" }
            })
        })

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}))
            throw new Error(`AI API failed: ${response.statusText}. ${JSON.stringify(errData)}`)
        }

        const result = await response.json()
        const rawContent = result.choices?.[0]?.message?.content

        if (!rawContent) {
            throw new Error("AI returned an empty response.")
        }

        const content = JSON.parse(rawContent)

        return new Response(JSON.stringify(content), { headers })
    } catch (error) {
        console.error("Function Error:", error)
        return new Response(JSON.stringify({
            error: "حدث خطأ في معالجة طلبك.",
            details: error.message
        }), {
            status: 500,
            headers,
        })
    }
})
