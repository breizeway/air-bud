import Image, { ImageProps } from "next/image";

interface ScalingImageProps extends Omit<ImageProps, "width" | "height"> {
  wRem?: number;
  hRem?: number;
  wEm?: number;
  hEm?: number;
}

export default function ScalingImage(props: ScalingImageProps) {
  const { wRem, hRem, hEm, wEm, style, ...restOfProps } = props;

  const formatSize = (
    rem: number | undefined = undefined,
    em: number | undefined = undefined
  ) =>
    rem !== undefined ? `${rem}rem` : em !== undefined ? `${em}em` : "auto";

  return (
    <Image
      {...{
        width: 0,
        height: 0,
        style: {
          width: formatSize(wRem, wEm),
          minWidth: formatSize(wRem, wEm),
          height: formatSize(hRem, hEm),
          minHeight: formatSize(hRem, hEm),
          ...style,
        },
        ...restOfProps,
      }}
    />
  );
}
