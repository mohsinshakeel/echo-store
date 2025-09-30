export const customImageLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) => {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  return src;
};

export const isValidImageUrl = (url: string): boolean => {
  try {
    new URL(url);
    return url.startsWith("http://") || url.startsWith("https://");
  } catch {
    return false;
  }
};
