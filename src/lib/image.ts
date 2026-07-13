import type { ImageLoader } from "next/image";

export function isExternalImageSrc(src: string) {
  return /^https?:\/\//i.test(src);
}

export const passthroughImageLoader: ImageLoader = ({ src }) => src;
