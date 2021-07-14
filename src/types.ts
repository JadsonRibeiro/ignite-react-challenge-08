export interface ImagesData {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

export interface ImagesQueryResponse {
  after?: {
    id: string;
  };
  data: ImagesData[];
}
