
export interface Restaurant {
  id: string;
  name: string;
  rating?: number;
  reviewCount?: number;
  description: string;
  address?: string;
  mapUrl: string;
  category?: string;
  matchReason: string;
  reviewSnippets?: string[];
}

export interface SearchState {
  isLoading: boolean;
  error: string | null;
  results: Restaurant[];
  aiResponse: string;
  groundingSources: Array<{title: string, uri: string}>;
}

export interface GroundingChunk {
  maps?: {
    uri: string;
    title: string;
  };
}
