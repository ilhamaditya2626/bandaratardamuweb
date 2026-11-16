"use client";

import { useEffect, useState, type SyntheticEvent } from "react";
import Image, { type ImageProps } from "next/image";
import { isExternalImageSrc, passthroughImageLoader } from "@/lib/image";

type DynamicImageProps = ImageProps & {
  /** Gambar pengganti saat URL gambar tersimpan sudah tidak tersedia. */
  fallbackSrc?: string;
};

const defaultFallback = "/assets/images/hero-bg.webp";

export function DynamicImage({
  src,
  fallbackSrc = defaultFallback,
  onError,
  ...props
}: DynamicImageProps) {
  const [activeSrc, setActiveSrc] = useState(src);

  // Komponen dapat dipakai kembali untuk artikel lain tanpa menyisakan URL lama.
  useEffect(() => setActiveSrc(src), [src]);

  const isExternal =
    typeof activeSrc === "string" && isExternalImageSrc(activeSrc);

  function handleError(event: SyntheticEvent<HTMLImageElement, Event>) {
    onError?.(event);

    // Hindari perulangan bila gambar cadangan pun tidak ditemukan.
    if (activeSrc !== fallbackSrc) {
      setActiveSrc(fallbackSrc);
    }
  }

  return (
    <Image
      {...props}
      src={activeSrc}
      loader={isExternal ? passthroughImageLoader : props.loader}
      unoptimized={isExternal || props.unoptimized}
      onError={handleError}
    />
  );
}
