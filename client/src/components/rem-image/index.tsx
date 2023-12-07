import Image, { ImageProps } from "next/image";

interface RemImageProps extends Omit<ImageProps, "width" | "height"> {
  wRem?: number;
  hRem?: number;
}

export default function RemImage(props: RemImageProps) {
  const { wRem, hRem, ...restOfProps } = props;

  const width = wRem ? wRem * 16 : 0;
  const height = hRem ? hRem * 16 : 0;

  return (
    <Image
      {...{
        ...restOfProps,
        width,
        height,
        style: {
          width: wRem ? `${wRem}rem` : "auto",
          minWidth: wRem ? `${wRem}rem` : "auto",
          height: hRem ? `${hRem}rem` : "auto",
          minHeight: hRem ? `${hRem}rem` : "auto",
        },
      }}
    />
  );
}
