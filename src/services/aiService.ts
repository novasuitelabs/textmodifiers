import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

// Declare global window property for user token
declare global {
  interface Window {
    userGitHubToken?: string;
  }
}

// Get token from environment (development) or user input (production)
const getToken = () => {
  return import.meta.env.DEV ? import.meta.env.VITE_GITHUB_TOKEN : window.userGitHubToken;
};

const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1-nano";

export interface AIResponse {
  success: boolean;
  content?: string;
  error?: string;
}

export interface StreamingAIResponse {
  success: boolean;
  content?: string;
  error?: string;
  isStreaming?: boolean;
  onChunk?: (chunk: string) => void;
}

export class AIService {
  static async generateResponse(prompt: string, systemPrompt: string = "You are a helpful assistant."): Promise<AIResponse> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("GitHub token not found. Please add your GitHub token to use AI features.");
      }

      const client = ModelClient(
        endpoint,
        new AzureKeyCredential(token),
      );

      const response = await client.path("/chat/completions").post({
        body: {
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          top_p: 1.0,
          model: model,
          max_tokens: 1000
        }
      });

      if (isUnexpected(response)) {
        throw new Error(response.body.error?.message || "API request failed");
      }

      return {
        success: true,
        content: response.body.choices[0].message.content || "No response generated"
      };
    } catch (error) {
      console.error("AI Service Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }

  // Streaming version of generateResponse
  static async generateStreamingResponse(
    prompt: string, 
    systemPrompt: string = "You are a helpful assistant.",
    onChunk?: (chunk: string) => void
  ): Promise<AIResponse> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("GitHub token not found. Please add your GitHub token to use AI features.");
      }

      // Try native fetch with streaming first
      try {
        console.log("Attempting native fetch streaming...");
        const response = await fetch(`${endpoint}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
          },
          body: JSON.stringify({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: prompt }
            ],
            temperature: 0.7,
            top_p: 1.0,
            model: model,
            max_tokens: 1000,
            stream: true
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  return { success: true, content: fullContent };
                }

                try {
                  const parsed = JSON.parse(data);
                  if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content) {
                    const contentChunk = parsed.choices[0].delta.content;
                    fullContent += contentChunk;
                    onChunk?.(contentChunk);
                  }
                } catch {
                  // Ignore parsing errors for incomplete JSON
                }
              }
            }
          }
        }

        return { success: true, content: fullContent };
      } catch (streamError) {
        console.log("Native streaming failed, falling back to simulated streaming:", streamError);
      }

      // Fallback to simulated streaming using Azure client
      console.log("Using simulated streaming for better UX...");
      
      const client = ModelClient(
        endpoint,
        new AzureKeyCredential(token),
      );

      const response = await client.path("/chat/completions").post({
        body: {
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          top_p: 1.0,
          model: model,
          max_tokens: 1000
        }
      });

      if (isUnexpected(response)) {
        throw new Error(response.body.error?.message || "API request failed");
      }

      let fullContent = "";
      
      // Get the full response content
      if (response.body && response.body.choices && response.body.choices[0] && response.body.choices[0].message) {
        fullContent = response.body.choices[0].message.content || "";
      }

      // Simulate streaming by breaking content into chunks
      if (fullContent && onChunk) {
        const words = fullContent.split(' ');
        for (let i = 0; i < words.length; i++) {
          const chunk = words[i] + (i < words.length - 1 ? ' ' : '');
          onChunk(chunk);
          // Small delay to simulate real streaming
          await new Promise(resolve => setTimeout(resolve, 30));
        }
      }

      return {
        success: true,
        content: fullContent || "No response generated"
      };
    } catch (error) {
      console.error("AI Service Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }

  // Text summarization
  static async summarizeText(text: string, maxLength: number = 150): Promise<AIResponse> {
    const prompt = `Please summarize the following text in ${maxLength} words or less, maintaining the key points and main ideas:\n\n${text}`;
    const systemPrompt = "You are a helpful text summarization assistant. Provide concise, accurate summaries that capture the essential information.";
    
    return this.generateResponse(prompt, systemPrompt);
  }

  // Streaming text summarization
  static async summarizeTextStreaming(
    text: string, 
    maxLength: number = 150,
    onChunk?: (chunk: string) => void
  ): Promise<AIResponse> {
    const prompt = `Please summarize the following text in ${maxLength} words or less, maintaining the key points and main ideas:\n\n${text}`;
    const systemPrompt = "You are a helpful text summarization assistant. Provide concise, accurate summaries that capture the essential information.";
    
    return this.generateStreamingResponse(prompt, systemPrompt, onChunk);
  }

  // Grammar and style correction
  static async correctGrammar(text: string): Promise<AIResponse> {
    const prompt = `Please correct the grammar, spelling, and improve the writing style of the following text. Return only the corrected version:\n\n${text}`;
    const systemPrompt = "You are a professional editor and grammar expert. Correct grammar, spelling, and improve writing style while maintaining the original meaning.";
    
    return this.generateResponse(prompt, systemPrompt);
  }

  // Streaming grammar correction
  static async correctGrammarStreaming(
    text: string,
    onChunk?: (chunk: string) => void
  ): Promise<AIResponse> {
    const prompt = `Please correct the grammar, spelling, and improve the writing style of the following text. Return only the corrected version:\n\n${text}`;
    const systemPrompt = "You are a professional editor and grammar expert. Correct grammar, spelling, and improve writing style while maintaining the original meaning.";
    
    return this.generateStreamingResponse(prompt, systemPrompt, onChunk);
  }

  // Style transfer
  static async changeStyle(text: string, targetStyle: string): Promise<AIResponse> {
    const prompt = `Please rewrite the following text in a ${targetStyle} style while maintaining the same meaning and information:\n\n${text}`;
    const systemPrompt = "You are a writing style expert. Transform text to match the requested style while preserving the original content and meaning.";
    
    return this.generateResponse(prompt, systemPrompt);
  }

  // Streaming style transfer
  static async changeStyleStreaming(
    text: string, 
    targetStyle: string,
    onChunk?: (chunk: string) => void
  ): Promise<AIResponse> {
    const prompt = `Please rewrite the following text in a ${targetStyle} style while maintaining the same meaning and information:\n\n${text}`;
    const systemPrompt = "You are a writing style expert. Transform text to match the requested style while preserving the original content and meaning.";
    
    return this.generateStreamingResponse(prompt, systemPrompt, onChunk);
  }

  // Content generation
  static async generateContent(topic: string, contentType: string, length: string = "medium"): Promise<AIResponse> {
    const prompt = `Please generate ${contentType} content about "${topic}". Make it ${length} length and engaging.`;
    const systemPrompt = "You are a creative content writer. Generate engaging, informative content that matches the requested format and topic.";
    
    return this.generateResponse(prompt, systemPrompt);
  }

  // Streaming content generation
  static async generateContentStreaming(
    topic: string, 
    contentType: string, 
    length: string = "medium",
    onChunk?: (chunk: string) => void
  ): Promise<AIResponse> {
    const prompt = `Please generate ${contentType} content about "${topic}". Make it ${length} length and engaging.`;
    const systemPrompt = "You are a creative content writer. Generate engaging, informative content that matches the requested format and topic.";
    
    return this.generateStreamingResponse(prompt, systemPrompt, onChunk);
  }

  // Text analysis
  static async analyzeText(text: string): Promise<AIResponse> {
    const prompt = `Please analyze the following text and provide insights about:
1. Tone and sentiment
2. Writing style
3. Key themes
4. Readability level
5. Suggestions for improvement

Text: ${text}`;
    const systemPrompt = "You are a text analysis expert. Provide detailed, insightful analysis of text content, style, and structure.";
    
    return this.generateResponse(prompt, systemPrompt);
  }

  // Streaming text analysis
  static async analyzeTextStreaming(
    text: string,
    onChunk?: (chunk: string) => void
  ): Promise<AIResponse> {
    const prompt = `Please analyze the following text and provide insights about:
1. Tone and sentiment
2. Writing style
3. Key themes
4. Readability level
5. Suggestions for improvement

Text: ${text}`;
    const systemPrompt = "You are a text analysis expert. Provide detailed, insightful analysis of text content, style, and structure.";
    
    return this.generateStreamingResponse(prompt, systemPrompt, onChunk);
  }

  // Language translation
  static async translateText(text: string, targetLanguage: string): Promise<AIResponse> {
    const prompt = `Please translate the following text to ${targetLanguage}. Maintain the original tone and style:\n\n${text}`;
    const systemPrompt = "You are a professional translator. Provide accurate translations that preserve the original meaning, tone, and style.";
    
    return this.generateResponse(prompt, systemPrompt);
  }

  // Streaming language translation
  static async translateTextStreaming(
    text: string, 
    targetLanguage: string,
    onChunk?: (chunk: string) => void
  ): Promise<AIResponse> {
    const prompt = `Please translate the following text to ${targetLanguage}. Maintain the original tone and style:\n\n${text}`;
    const systemPrompt = "You are a professional translator. Provide accurate translations that preserve the original meaning, tone, and style.";
    
    return this.generateStreamingResponse(prompt, systemPrompt, onChunk);
  }

  // Text expansion
  static async expandText(text: string, expansionType: string): Promise<AIResponse> {
    const prompt = `Please expand the following text by ${expansionType}. Add more detail, examples, or elaboration while maintaining the core message:\n\n${text}`;
    const systemPrompt = "You are a content expansion expert. Expand text with relevant details, examples, and elaboration while preserving the original message.";
    
    return this.generateResponse(prompt, systemPrompt);
  }

  // Streaming text expansion
  static async expandTextStreaming(
    text: string, 
    expansionType: string,
    onChunk?: (chunk: string) => void
  ): Promise<AIResponse> {
    const prompt = `Please expand the following text by ${expansionType}. Add more detail, examples, or elaboration while maintaining the core message:\n\n${text}`;
    const systemPrompt = "You are a content expansion expert. Expand text with relevant details, examples, and elaboration while preserving the original message.";
    
    return this.generateStreamingResponse(prompt, systemPrompt, onChunk);
  }
}
