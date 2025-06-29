export type IBlog = {
  title: string;
  description: string;
  image: string[];
};
export type UpdateBlogPayload = Partial<IBlog> & {
  imagesToDelete?: string[];
};
