"use client";

import Image, { type ImageProps } from "next/image";
import { isExternalImageSrc, passthroughImageLoader } from "@/lib/image";

export function DynamicImage(props: ImageProps) {
  const isExternal = typeof props.src === "string" && isExternalImageSrc(props.src);

  return (
    <Image
      {...props}
      loader={isExternal ? passthroughImageLoader : props.loader}
      unoptimized={isExternal || props.unoptimized}
    />
  );
}
