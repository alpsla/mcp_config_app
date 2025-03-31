import { TokenService } from './tokenService';

/**
 * Service for interactions with the Hugging Face API
 */
export class HuggingFaceService {
  private static API_URL = 'https://huggingface.co/api';
  private static TOKEN_KEY = 'HuggingFaceToken';

  /**
   * Validates a Hugging Face API token
   * @param token API token to validate
   * @returns Promise resolving to validation result
   */
  static async validateToken(token: string): Promise<{
    isValid: boolean;
    username?: string;
    error?: string;
  }> {
    return TokenService.validateHuggingFaceToken(token);
  }

  /**
   * Stores a Hugging Face API token securely
   * @param token Token to store
   * @returns Promise resolving when token is stored
   */
  static async storeToken(token: string): Promise<boolean> {
    return TokenService.storeToken(this.TOKEN_KEY, token);
  }

  /**
   * Retrieves the stored Hugging Face API token
   * @returns Promise resolving to token or null
   */
  static async getToken(): Promise<string | null> {
    return TokenService.getToken(this.TOKEN_KEY);
  }

  /**
   * Removes the stored Hugging Face API token
   * @returns Promise resolving when token is removed
   */
  static async removeToken(): Promise<boolean> {
    return TokenService.removeToken(this.TOKEN_KEY);
  }

  /**
   * Gets a predefined list of models from Hugging Face
   * @param tier User's subscription tier (free, standard, premium)
   * @returns Promise resolving to list of available models
   */
  static async getAvailableModels(tier: 'free' | 'standard' | 'premium' = 'free'): Promise<{
    id: string;
    name: string;
    description: string;
    tags: string[];
    isAvailable: boolean;
  }[]> {
    // In a real app, this would fetch from the Hugging Face API
    // For this example, we'll return a predefined list
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Predefined models list
    const allModels = [
      {
        id: 'facebook/bart-large-cnn',
        name: 'BART Large CNN',
        description: 'BART model fine-tuned on CNN Daily Mail for summarization tasks',
        tags: ['summarization', 'text-generation'],
        tier: 'free'
      },
      {
        id: 'facebook/dpr-ctx_encoder-single-nq-base',
        name: 'DPR Context Encoder',
        description: 'Dense Passage Retrieval context encoder for open-domain question answering',
        tags: ['question-answering'],
        tier: 'free'
      },
      {
        id: 'facebook/dpr-question_encoder-single-nq-base',
        name: 'DPR Question Encoder',
        description: 'Dense Passage Retrieval question encoder for open-domain question answering',
        tags: ['question-answering'],
        tier: 'free'
      },
      {
        id: 'distilbert-base-uncased-finetuned-sst-2-english',
        name: 'DistilBERT for Sentiment',
        description: 'DistilBERT model fine-tuned on SST-2 for sentiment analysis',
        tags: ['sentiment-analysis', 'text-classification'],
        tier: 'standard'
      },
      {
        id: 'deepset/roberta-base-squad2',
        name: 'RoBERTa for QA',
        description: 'RoBERTa model fine-tuned on SQuAD2.0 for question answering',
        tags: ['question-answering'],
        tier: 'standard'
      },
      {
        id: 'google/pegasus-xsum',
        name: 'Pegasus XSum',
        description: 'Pegasus model fine-tuned on XSum for extreme summarization',
        tags: ['summarization'],
        tier: 'standard'
      },
      {
        id: 'facebook/blenderbot-400M-distill',
        name: 'BlenderBot 400M',
        description: 'Open-domain chatbot model with 400M parameters',
        tags: ['conversational'],
        tier: 'premium'
      },
      {
        id: 'google/mt5-small',
        name: 'mT5 Small',
        description: 'Multilingual T5 model with 300M parameters',
        tags: ['translation', 'text-generation'],
        tier: 'premium'
      },
      {
        id: 'google/flan-t5-xl',
        name: 'Flan-T5 XL',
        description: 'Flan-T5 XL model with 3B parameters for instruction following',
        tags: ['text-generation', 'instruction-following'],
        tier: 'premium'
      },
      {
        id: 'facebook/opt-1.3b',
        name: 'OPT 1.3B',
        description: 'Open Pre-trained Transformer with 1.3B parameters',
        tags: ['text-generation'],
        tier: 'premium'
      }
    ];
    
    // Filter models based on user tier
    const tierLevels = { 'free': 0, 'standard': 1, 'premium': 2 };
    const userTierLevel = tierLevels[tier];
    
    return allModels.map(model => {
      const modelTierLevel = tierLevels[model.tier as keyof typeof tierLevels];
      
      return {
        id: model.id,
        name: model.name,
        description: model.description,
        tags: model.tags,
        isAvailable: modelTierLevel <= userTierLevel
      };
    });
  }

  /**
   * Gets detailed information about a specific model
   * @param modelId Hugging Face model ID
   * @param token Optional API token for accessing private models
   * @returns Promise resolving to model details
   */
  static async getModelDetails(modelId: string, token?: string): Promise<any> {
    // In a real app, this would fetch from the Hugging Face API
    // For this example, we'll simulate it
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data for the specified model
    return {
      id: modelId,
      name: modelId.split('/').pop()?.replace(/-/g, ' '),
      description: 'Detailed model description would be fetched from API',
      downloads: 12345,
      likes: 98,
      tags: ['text-generation', 'summarization'],
      pipeline_tag: 'text-generation',
      mask_token: null,
      private: false,
      library_name: 'transformers',
      config: {
        model_type: 'bert',
        hidden_size: 768,
        num_hidden_layers: 12,
        num_attention_heads: 12
      }
    };
  }

  /**
   * Creates a wrapper script for using Hugging Face models
   * @param modelId Hugging Face model ID
   * @param params Additional parameters for the model
   * @returns Promise resolving to script path
   */
  static async createModelScript(modelId: string, params: Record<string, any> = {}): Promise<string> {
    // Combine model ID with other parameters
    const scriptParams = {
      model: modelId,
      ...params
    };
    
    return TokenService.createWrapperScript('huggingface', this.TOKEN_KEY, scriptParams);
  }
}
