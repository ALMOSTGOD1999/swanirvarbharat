import { generateText, Output, jsonSchema } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import vine from '@vinejs/vine'
import configService from '#services/config_service'

export interface Chapter {
  start: string
  end: string
  text: string
}

export interface AiBodyOverview {
  summary: string[]
  metaDescription: string
  socialHooks: {
    twitter: string
    facebook: string
  }
}

/**
 * VineJS schemas for AI structured output
 */
const chaptersSchema = vine.object({
  chapters: vine.array(
    vine.object({
      start: vine.string().meta({
        description: 'Timestamp in mm:ss or hh:mm:ss (no milliseconds)',
      }),
      end: vine.string().meta({
        description: 'Timestamp in mm:ss or hh:mm:ss (no milliseconds)',
      }),
      text: vine.string().meta({
        description: 'A concise, high-level chapter title',
      }),
    })
  ),
})

const bodyOverviewSchema = vine.object({
  summary: vine.array(vine.string()).meta({
    description: '3 to 5 concise, action-oriented bullet points summarizing the lesson.',
  }),
  metaDescription: vine.string().meta({
    description:
      'A high-click-through SEO description. Must include the primary topic and a call to learning, under 160 characters.',
  }),
  socialHooks: vine.object({
    twitter: vine.string().meta({
      description:
        'A punchy, curiosity-gap style tweet to drive clicks. Use 1-2 relevant hashtags.',
    }),
    facebook: vine.string().meta({
      description:
        'A conversational, community-focused post. Explain the value of the lesson and encourage comments or shares.',
    }),
  }),
})

/**
 * Convert VineJS validator to AI SDK compatible JSON Schema
 */
function toAiSchema(validator: ReturnType<typeof vine.create>) {
  return jsonSchema(validator.toJSONSchema() as any)
}

class AiService {
  /**
   * Get the AI model based on config
   */
  private async getModel() {
    const provider = await configService.get('ai', 'provider')
    const apiKey = await configService.get('ai', 'api_key')
    const baseUrl = await configService.get('ai', 'base_url')
    const modelName = await configService.get('ai', 'model')

    if (!apiKey) {
      throw new Error('AI API key not configured. Go to Admin > Settings > AI to configure.')
    }

    switch (provider) {
      case 'openai': {
        const openai = createOpenAI({
          apiKey,
          ...(baseUrl ? { baseURL: baseUrl } : {}),
        })
        return openai(modelName || 'gpt-4o')
      }
      case 'anthropic': {
        const anthropic = createAnthropic({
          apiKey,
          ...(baseUrl ? { baseURL: baseUrl } : {}),
        })
        return anthropic(modelName || 'claude-sonnet-4-20250514')
      }
      case 'google': {
        const google = createGoogleGenerativeAI({
          apiKey,
          ...(baseUrl ? { baseURL: baseUrl } : {}),
        })
        return google(modelName || 'gemini-2.0-flash')
      }
      default: {
        // Fallback to OpenAI-compatible
        const openai = createOpenAI({
          apiKey,
          ...(baseUrl ? { baseURL: baseUrl } : {}),
        })
        return openai(modelName || 'gpt-4o')
      }
    }
  }

  /**
   * Generate video chapters from SRT captions
   */
  async generateChapters(captions: string): Promise<Chapter[]> {
    const model = await this.getModel()
    const chaptersValidator = vine.create(chaptersSchema)

    const { output } = await generateText({
      model,
      output: Output.object({
        schema: toAiSchema(chaptersValidator),
      }),
      prompt: `
        Analyze the following SRT subtitles and create 2 to 10 high-level chapters.

        ### Formatting Rules:
        - Use ONLY mm:ss (e.g., 05:22) or hh:mm:ss (e.g., 1:02:15) if over an hour.
        - DO NOT include milliseconds or commas (e.g., no "00:00:10,600").
        - Always round to the nearest second.

        ### Example Output:
        - 00:00 - Introduction
        - 04:12 - Deep Dive into Logic
        - 12:45 - Final Summary

        Captions:
        ${captions}
      `,
    })

    return (output as { chapters: Chapter[] }).chapters
  }

  /**
   * Generate body overview (summary, meta description, social hooks)
   */
  async generateBodyOverview(body: string): Promise<AiBodyOverview> {
    const model = await this.getModel()
    const overviewValidator = vine.create(bodyOverviewSchema)

    const { output } = await generateText({
      model,
      output: Output.object({
        schema: toAiSchema(overviewValidator),
      }),
      prompt: `Analyze the following lesson body and generate metadata: ${body}`,
    })

    return output as AiBodyOverview
  }
}

const aiService = new AiService()
export default aiService
