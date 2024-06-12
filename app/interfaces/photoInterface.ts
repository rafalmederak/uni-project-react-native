export interface Photo {
    albumId: number;
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
  }
  
  export interface PhotosProps {
    photos: Photo[];
  }
  