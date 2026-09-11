import Image, { type ImageProps } from "next/image";
export function ParallaxImage({ alt, ...props }: ImageProps) {
  return <div className="parallax-image" data-parallax><Image {...props} alt={alt} /></div>;
}
