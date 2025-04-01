import { Size } from "../interfaces/ai-tools.interface";

/**
 * Canvas sizes available in the system
 */
export const CANVAS_SIZES = {
    SQUARE: "square",
    PORTAIT: "portrait",
    RECTANGLE: "rectangle",
};
  
/**
 * Predefined canvas size configurations with dimensions
 */



export const GENERAL_SIZES : Size[] = [
  { sizeId: CANVAS_SIZES.SQUARE, name: 'Square', description: '1080 x 1080 px', width: 1080, height: 1080, aspectRatio: "1:1", imageUrl: 'square.png' },
  { sizeId: CANVAS_SIZES.PORTAIT, name: 'Portrait', description: '1080 x 1350 px', width: 1080, height: 1350, aspectRatio: "4:5", imageUrl: 'portrait.png' },
  { sizeId: CANVAS_SIZES.RECTANGLE, name: 'Rectangle', description: '1080 x 720 px', width: 1080, height: 720, aspectRatio: "3:2", imageUrl: 'rectangle.png' },
];
  


  