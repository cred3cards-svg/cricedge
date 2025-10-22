
import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const PlaceholderImages: ImagePlaceholder[] = data.placeholderImages;

export const getPlaceholderImage = (id: string): ImagePlaceholder | undefined => {
    // If the ID looks like a data URI, create a placeholder object on the fly.
    if (id && id.startsWith('data:image')) {
        return {
            id: 'generated-flag',
            description: 'A dynamically generated country flag.',
            imageUrl: id,
            imageHint: 'country flag',
        };
    }
    return PlaceholderImages.find(img => img.id === id);
}

    