import { NextRequest, NextResponse } from 'next/server';

export interface CouncilResponse {
    synthesis: {
        title: string;
        content: string;
    };
    ranking: {
        modelId: string;
        rank: number;
        reason: string;
    }[];
    comparison: {
        agreements: string[];
        disagreements: string[];
        unique: {
            modelId: string;
            points: string[];
        }[];
    };
    individual: {
        [modelId: string]: {
            score: number;
            content: string;
            latency: string;
            tokens: string;
        }
    };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { prompt, models } = body as { prompt: string; models: string[] };

        if (!prompt || !models || models.length === 0) {
            return NextResponse.json({ error: 'Prompt and at least one model are required' }, { status: 400 });
        }

        // Simulating AI processing delay
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Mock response based on the "AI Trends 2025" scenario from user screenshots
        const response: CouncilResponse = {
            synthesis: {
                title: "Las 3 tendencias más importantes de Inteligencia Artificial en 2025",
                content: `
### 1. IA Agéntica y Autónoma
La tendencia más transformadora de 2025 fue el auge de los **agentes de IA autónomos**: sistemas capaces de planificar, ejecutar y completar tareas complejas de forma independiente. Empresas como Anthropic, OpenAI, Google y Microsoft lanzaron frameworks y productos centrados en agentes.

**Implicaciones:** Automatización de tareas complejas en programación, investigación, atención al cliente y gestión empresarial. Nuevos desafíos en supervisión y control.

### 2. IA Generativa Multimodal Avanzada y Personalizada
Los modelos de IA generativa evolucionaron significativamente hacia la **multimodalidad nativa**, procesando y generando texto, imagen, audio, video y código de forma integrada y simultánea. Además, la **personalización** se convirtió en un diferenciador clave.

**Implicaciones:** Transformación de industrias creativas, educación personalizada, marketing hiper-segmentado y aceleración del diseño.

### 3. Regulación Global y IA Responsable
Se consolidaron los marcos regulatorios internacionales para garantizar el desarrollo ético de la IA, priorizando la transparencia y la mitigación de sesgos.
                `.trim()
            },
            ranking: [
                {
                    modelId: 'claude-sonnet-4.5',
                    rank: 1,
                    reason: 'Es el modelo más acertado en sus predicciones reales para 2025. La IA Agéntica fue efectivamente una de las tendencias más definitorias. Además, es transparente sobre sus limitaciones de conocimiento y presenta la información de forma estructurada.'
                },
                {
                    modelId: 'gemini-2.0-flash',
                    rank: 2,
                    reason: 'Ofrece el análisis más detallado y completo con implicaciones prácticas y retos. La IA Generativa y la IA Responsable son acertadas, aunque la IA en el Edge no fue de las top 3 más disruptivas. La profundidad del análisis es su mayor fortaleza.'
                },
                {
                    modelId: 'gpt-4o',
                    rank: 3,
                    reason: 'Es el más conservador y genérico de los tres. Sus tendencias son correctas pero demasiado amplias y poco específicas para 2025. Menciona tecnología antigua y la respuesta es la más corta y menos informativa.'
                }
            ].filter(r => models.includes(r.modelId)),
            comparison: {
                agreements: [
                    'Los tres modelos coinciden en que la IA Generativa es una de las tendencias más importantes, mencionando modelos como GPT y su evolución.',
                    'Los tres modelos identifican la IA Responsable, Ética y Regulación como una tendencia clave.',
                    'Todos reconocen limitaciones en su conocimiento respecto a eventos reales de 2025.'
                ],
                disagreements: [
                    'Claude identifica la IA Agéntica/Autónoma como tendencia principal, mientras que Gemini apuesta por IA en el Edge y GPT-4o por Eficiencia Operativa.',
                    'Claude y GPT-4o son explícitos sobre sus limitaciones temporales, mientras que Gemini presenta sus predicciones con mayor confianza.',
                    'Claude menciona multimodalidad como aspecto central, mientras que Gemini enfatiza la personalización.'
                ],
                unique: [
                    {
                        modelId: 'claude-sonnet-4.5',
                        points: [
                            'Identifica la IA Agéntica y Autónoma como tendencia clave.',
                            'Destaca la multimodalidad avanzada como característica de la evolución.',
                            'Muestra humildad epistémica invitando al usuario a compartir info.'
                        ]
                    },
                    {
                        modelId: 'gemini-2.0-flash',
                        points: [
                            'Profundiza exhaustivamente en las implicaciones prácticas por industria.',
                            'Añade la IA en el Edge (dispositivos locales) como top tendencia.'
                        ]
                    }
                ].filter(u => models.includes(u.modelId))
            },
            individual: {
                'claude-sonnet-4.5': {
                    score: 8.5,
                    content: '### 1. IA Generativa Multimodal Avanzada\n- Modelos capaces de procesar y generar texto, imagen, audio y video simultáneamente.\n- Mayor integración en herramientas cotidianas de trabajo.\n\n### 2. IA Agéntica y Autónoma\n- Asistentes de IA capaces de completar tareas.\n- Sistemas que planifican y ejecutan con supervición mínima.\n\n### 3. Regulación y IA Responsable\n- Nuevas leyes en Europa y USA.',
                    latency: '7.3s',
                    tokens: '~244 tokens'
                },
                'gemini-2.0-flash': {
                    score: 7.5,
                    content: '- **Por qué es importante:** La IA generativa (modelos como GPT, DALL-E) sigue evolucionando a pasos agigantados. En 2025 veremos modelos mucho más potentes capaces de generar simulaciones 3D.\n\n- **Implicaciones:**\n - **Marketing hiper-personalizado:** Campañas creadas dinámicamente.\n - **Educación a medida:** Materiales individualizados para cada usuario.\n - **Diseño acelerado:** Prototipos ultra rápidos.',
                    latency: '8.5s',
                    tokens: '~1039 tokens'
                },
                'gpt-4o': {
                    score: 5,
                    content: 'Lo siento, pero no puedo predecir eventos futuros o especificar tendencias que ocurrirán en 2025, ya que mi conocimiento se detiene en octubre de 2023. Sin embargo, puedo mencionar algunas tendencias relevantes:\n\n1. Eficiencia Operativa y automatización empresarial.\n2. Evolución de los Modelos de Lenguaje Grandes (LLMs).\n3. Consideraciones éticas y de privacidad.',
                    latency: '4.2s',
                    tokens: '~150 tokens'
                },
                'claude-opus-4.6': {
                    score: 9.0,
                    content: 'La era de Opus 4.6 permite un razonamiento profundo y una orquestación multi-agente sin precedentes, integrando capacidades de resolución STEM avanzadas en tiempo real.',
                    latency: '15.1s',
                    tokens: '~500 tokens'
                }
            }
        };

        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process council request' }, { status: 500 });
    }
}
