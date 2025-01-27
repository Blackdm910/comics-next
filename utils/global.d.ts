// global.d.ts
declare global {
  type Comic = {
    title: string;
    thumbnail: string;
    endpoint: string;
    rating: string;
  };

  interface HistoryItem {
    _id: string;
    title: string;
    chapterId: string;
    thumbnailUrl: string;
    timestamp: string;
  }

  interface Komik {
    judul: string;
    link: string;
    thumbnail: string;
  }

  interface PaginationData {
    currentPage: number;
    totalPages: number;
  }

  type ComicGridProps = {
    comics: Comic[];
    loading: boolean;
  };

  interface HistoryItem {
    _id: string;
    title: string;
    chapterId: number;
    imageUrl?: string;
  }

  interface HistoryListProps {
    history: HistoryItem[];
    loading: boolean;
    onHistoryClick: (title: string, chapterId: number) => void;
    onDeleteHistory: (id: string) => void;
  }
}

// Menambahkan ekspor kosong agar TypeScript mengenali file ini sebagai modul.
export {};
