import Image, { ImageProps } from "next/image";

interface RemImageProps extends Omit<ImageProps, "width" | "height"> {
  wRem?: number;
  hRem?: number;
}

export default function RemImage(props: RemImageProps) {
  const { wRem, hRem, style, ...restOfProps } = props;

  const formatSize = (rem: number | undefined) =>
    rem !== undefined ? `${rem}rem` : "auto";

  return (
    <Image
      {...{
        width: 0,
        height: 0,
        style: {
          width: formatSize(wRem),
          minWidth: formatSize(wRem),
          height: formatSize(hRem),
          minHeight: formatSize(hRem),
          ...style,
        },
        ...restOfProps,
      }}
    />
  );
}
