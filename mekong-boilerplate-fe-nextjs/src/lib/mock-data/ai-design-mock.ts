// Mock data for AI Design page

export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  thumbnail: string;
}

export interface Conversation {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  type: 'system' | 'user' | 'assistant';
  content: string;
  images?: string[];
  timestamp: Date;
}

export interface GalleryImage {
  id: string;
  url: string;
  conversationId: string;
  timestamp: Date;
  prompt?: string;
}

// Mock prompts - 10 pre-defined prompts
export const MOCK_PROMPTS: Prompt[] = [
  {
    id: 'prompt-1',
    title: 'Remove Background - Green',
    description: 'Remove background and create green solid background',
    content: 'Reconstruct the original design faithfully as a clean, sharp redraw. Treat the source image as reference only: even if it is low-resolution, blurry, or heavily compressed, rebuild all shapes and typography with crisp, well-defined edges and smooth, artifact-free fills. Isolate the design by removing any background, fabric texture, folds, shadows, stray hair, or noise. Preserve the original layout and color palette. Center the result on a solid chroma key green (green-screen green) background.',
    thumbnail: 'https://picsum.photos/seed/prompt1/200/200',
  },
  {
    id: 'prompt-2',
    title: 'Sweatshirt Mockup - Light',
    description: 'Light sweatshirt product image with front design',
    content: 'Create a professional product mockup of a light colored sweatshirt with the design on the front, studio lighting, white background',
    thumbnail: 'https://picsum.photos/seed/prompt2/200/200',
  },
  {
    id: 'prompt-3',
    title: 'Hoodie Set x4 - Dark',
    description: 'Set of 4 product images, dark hoodie with back design',
    content: 'Generate 4 professional product images of a dark hoodie displaying front, back, side, and detail views with premium studio lighting',
    thumbnail: 'https://picsum.photos/seed/prompt3/200/200',
  },
  {
    id: 'prompt-4',
    title: 'T-Shirt White Background',
    description: 'Clean t-shirt photo on pure white background',
    content: 'Create a high-quality t-shirt product photo on a pure white background, professional studio lighting, centered composition',
    thumbnail: 'https://picsum.photos/seed/prompt4/200/200',
  },
  {
    id: 'prompt-5',
    title: 'Product Lifestyle Shot',
    description: 'Lifestyle photo showing product in real-world context',
    content: 'Generate a lifestyle product photo showing the item being worn or used in a natural, everyday setting with good lighting',
    thumbnail: 'https://picsum.photos/seed/prompt5/200/200',
  },
  {
    id: 'prompt-6',
    title: 'Flat Lay Composition',
    description: 'Overhead flat lay product styling',
    content: 'Create a flat lay product photo from overhead perspective, styled with complementary items, clean aesthetic',
    thumbnail: 'https://picsum.photos/seed/prompt6/200/200',
  },
  {
    id: 'prompt-7',
    title: 'Hero Banner Image',
    description: 'Wide hero banner for product listing',
    content: 'Design a wide hero banner image for product listing, dramatic lighting, professional composition, 16:9 aspect ratio',
    thumbnail: 'https://picsum.photos/seed/prompt7/200/200',
  },
  {
    id: 'prompt-8',
    title: 'Close-up Detail Shot',
    description: 'Macro shot highlighting product details',
    content: 'Generate a close-up macro shot highlighting the product texture, stitching, or key details with shallow depth of field',
    thumbnail: 'https://picsum.photos/seed/prompt8/200/200',
  },
  {
    id: 'prompt-9',
    title: 'Seasonal Theme',
    description: 'Product styled with seasonal elements',
    content: 'Create a seasonal themed product photo with appropriate props and styling for current season, warm and inviting atmosphere',
    thumbnail: 'https://picsum.photos/seed/prompt9/200/200',
  },
  {
    id: 'prompt-10',
    title: 'Minimal Modern',
    description: 'Minimalist modern product photography',
    content: 'Generate a minimalist modern product photo with clean lines, neutral tones, and professional lighting showcasing the product elegantly',
    thumbnail: 'https://picsum.photos/seed/prompt10/200/200',
  },
];

// Mock conversations - 3 sample conversations
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Blue Hoodie Collection',
    description: 'Created 4 product images with blue background...',
    timestamp: new Date(Date.now() - 32 * 60 * 1000), // 32 min ago
    messages: [
      {
        id: 'msg-1-1',
        type: 'system',
        content: 'Hello! Paste an image from clipboard or select a prompt to start generating product images.',
        timestamp: new Date(Date.now() - 32 * 60 * 1000),
      },
      {
        id: 'msg-1-2',
        type: 'user',
        content: 'Used prompts: "Remove Background - Blue", "Hoodie Set x4 - Dark". Custom: Make the hoodie look premium and professional',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
      },
      {
        id: 'msg-1-3',
        type: 'assistant',
        content: 'Generated 4 product images:',
        images: [
          'https://picsum.photos/seed/conv1img1/400/400',
          'https://picsum.photos/seed/conv1img2/400/400',
          'https://picsum.photos/seed/conv1img3/400/400',
          'https://picsum.photos/seed/conv1img4/400/400',
        ],
        timestamp: new Date(Date.now() - 29 * 60 * 1000),
      },
    ],
  },
  {
    id: 'conv-2',
    title: 'Summer T-Shirt Series',
    description: 'Light sweatshirt mockups with front design...',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
    messages: [
      {
        id: 'msg-2-1',
        type: 'system',
        content: 'Hello! Paste an image from clipboard or select a prompt to start generating product images.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: 'msg-2-2',
        type: 'user',
        content: 'Used prompts: "Sweatshirt Mockup - Light", "T-Shirt White Background"',
        timestamp: new Date(Date.now() - 119 * 60 * 1000),
      },
      {
        id: 'msg-2-3',
        type: 'assistant',
        content: 'Generated 3 product images:',
        images: [
          'https://picsum.photos/seed/conv2img1/400/400',
          'https://picsum.photos/seed/conv2img2/400/400',
          'https://picsum.photos/seed/conv2img3/400/400',
        ],
        timestamp: new Date(Date.now() - 118 * 60 * 1000),
      },
    ],
  },
  {
    id: 'conv-3',
    title: 'Dark Hoodie Variants',
    description: 'Set of 4 dark hoodies with back design...',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1d ago
    messages: [
      {
        id: 'msg-3-1',
        type: 'system',
        content: 'Hello! Paste an image from clipboard or select a prompt to start generating product images.',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'msg-3-2',
        type: 'user',
        content: 'Used prompts: "Hoodie Set x4 - Dark". Custom: Focus on back design details',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 60 * 1000),
      },
      {
        id: 'msg-3-3',
        type: 'assistant',
        content: 'Generated 3 product images:',
        images: [
          'https://picsum.photos/seed/conv3img1/400/400',
          'https://picsum.photos/seed/conv3img2/400/400',
          'https://picsum.photos/seed/conv3img3/400/400',
        ],
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 1000),
      },
    ],
  },
];

// Mock gallery images - 10 images from all conversations
export const MOCK_GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 'gallery-1',
    url: 'https://picsum.photos/seed/conv1img1/400/400',
    conversationId: 'conv-1',
    timestamp: new Date(Date.now() - 29 * 60 * 1000),
    prompt: 'Remove Background - Blue, Hoodie Set x4 - Dark',
  },
  {
    id: 'gallery-2',
    url: 'https://picsum.photos/seed/conv1img2/400/400',
    conversationId: 'conv-1',
    timestamp: new Date(Date.now() - 29 * 60 * 1000),
    prompt: 'Remove Background - Blue, Hoodie Set x4 - Dark',
  },
  {
    id: 'gallery-3',
    url: 'https://picsum.photos/seed/conv1img3/400/400',
    conversationId: 'conv-1',
    timestamp: new Date(Date.now() - 29 * 60 * 1000),
    prompt: 'Remove Background - Blue, Hoodie Set x4 - Dark',
  },
  {
    id: 'gallery-4',
    url: 'https://picsum.photos/seed/conv1img4/400/400',
    conversationId: 'conv-1',
    timestamp: new Date(Date.now() - 29 * 60 * 1000),
    prompt: 'Remove Background - Blue, Hoodie Set x4 - Dark',
  },
  {
    id: 'gallery-5',
    url: 'https://picsum.photos/seed/conv2img1/400/400',
    conversationId: 'conv-2',
    timestamp: new Date(Date.now() - 118 * 60 * 1000),
    prompt: 'Sweatshirt Mockup - Light, T-Shirt White Background',
  },
  {
    id: 'gallery-6',
    url: 'https://picsum.photos/seed/conv2img2/400/400',
    conversationId: 'conv-2',
    timestamp: new Date(Date.now() - 118 * 60 * 1000),
    prompt: 'Sweatshirt Mockup - Light, T-Shirt White Background',
  },
  {
    id: 'gallery-7',
    url: 'https://picsum.photos/seed/conv2img3/400/400',
    conversationId: 'conv-2',
    timestamp: new Date(Date.now() - 118 * 60 * 1000),
    prompt: 'Sweatshirt Mockup - Light, T-Shirt White Background',
  },
  {
    id: 'gallery-8',
    url: 'https://picsum.photos/seed/conv3img1/400/400',
    conversationId: 'conv-3',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 1000),
    prompt: 'Hoodie Set x4 - Dark',
  },
  {
    id: 'gallery-9',
    url: 'https://picsum.photos/seed/conv3img2/400/400',
    conversationId: 'conv-3',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 1000),
    prompt: 'Hoodie Set x4 - Dark',
  },
  {
    id: 'gallery-10',
    url: 'https://picsum.photos/seed/conv3img3/400/400',
    conversationId: 'conv-3',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 1000),
    prompt: 'Hoodie Set x4 - Dark',
  },
];

// Helper function to generate new conversation
export function createNewConversation(): Conversation {
  return {
    id: `conv-${Date.now()}`,
    title: 'New Conversation',
    description: '',
    timestamp: new Date(),
    messages: [
      {
        id: `msg-${Date.now()}`,
        type: 'system',
        content: 'Hello! Paste an image from clipboard or select a prompt to start generating product images.',
        timestamp: new Date(),
      },
    ],
  };
}

// Helper function to simulate generate API call
export async function mockGenerateImages(
  prompts: Prompt[],
  customText: string,
  uploadedImage?: File
): Promise<string[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2500));

  // Generate 2-4 random images
  const imageCount = 1;// Math.floor(Math.random() * 3) + 2; // 2-4 images
  const images: string[] = [];

  for (let i = 0; i < imageCount; i++) {
    const seed = `generated-${Date.now()}-${i}`;
    images.push(`https://picsum.photos/seed/${seed}/400/400`);
  }

  return images;
}
