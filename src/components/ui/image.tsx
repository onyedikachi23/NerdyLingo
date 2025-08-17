/** @format */

import { createImage } from "@gluestack-ui/core/image/creator";
import type { VariantProps } from "@gluestack-ui/utils/nativewind-utils";
import { tva } from "@gluestack-ui/utils/nativewind-utils";
import { Image as EXImage } from "expo-image";
import { cssInterop } from "nativewind";
import React from "react";

const imageStyle = tva({
	base: "max-w-full",
	variants: {
		size: {
			"2xs": "h-6 w-6",
			xs: "h-10 w-10",
			sm: "h-16 w-16",
			md: "h-20 w-20",
			lg: "h-24 w-24",
			xl: "h-32 w-32",
			"2xl": "h-64 w-64",
			full: "h-full w-full",
			none: "",
		},
	},
});

const UIImage = createImage({ Root: EXImage });
cssInterop(UIImage, {
	className: "style",
});

type BaseImageProps = SafeOmit<
	VariantProps<typeof imageStyle> & React.ComponentProps<typeof UIImage>,
	"ref"
> & { ref?: React.Ref<EXImage> };

type ImageProps = Prettify<RequireKeys<BaseImageProps, "alt">>;

const Image: React.FC<ImageProps> = ({
	ref,
	size = "md",
	className,
	...props
}) => {
	return (
		<UIImage
			{...props}
			ref={
				ref as React.Ref<Omit<ImageProps, "source" | "alt">> // gluestack got this type incorrect
			}
			className={imageStyle({ size, class: className })}
		/>
	);
};

export { Image };
export type { ImageProps };
