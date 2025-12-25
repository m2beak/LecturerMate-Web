export interface VideoNote {
  id: string;
  videoId: string;
  videoTitle: string;
  videoUrl: string;
  thumbnailUrl: string;
  content: string;
  timestamps: Timestamp[];
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  folder?: string;
}

export interface Timestamp {
  id: string;
  time: number;
  label: string;
  note?: string;
}

export interface DictionaryResult {
  word: string;
  phonetic?: string;
  phonetics: Array<{
    text?: string;
    audio?: string;
  }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms: string[];
    }>;
  }>;
}
