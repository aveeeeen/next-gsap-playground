export interface Product {
  id: number;
  title: string;
  tags: string[];
  year: number;
  summary: string;
  imageData: imageData;
}

export interface ProductDetail {
  productId: number;
  title: string;
  description: string;
  imageData?: imageData;
}

export type imageData = {
  url: string;
  type: "video" | "image"
}

export const products: Product[] = [
  {
    id: 1,
    title: "blocklet",
    tags: ["Icon", "Corporate Design", "UI", "Web"],
    year: 2025,
    summary: "Blocket is Sweden’s biggest marketplace where you can virtually find everything that you need. 98% of Sweden’s population knows Blocket! The market troughput is worth 14% of Sweden’s GDP.",
    imageData: {
      url: "https://www.iconwerk.com/images/iconwerk-blocket-101_2x2.jpg?crc=4202447090",
      type: "image"
    }
  },
  {
    id: 2,
    title: 'Braun',
    tags: ["Typography", "Corporate Design"],
    year: 2025,
    summary: 'A new typeface for Braun.',
    imageData: {
      url: "https://www.iconwerk.com/images/bildschirmfoto%202023-11-11%20um%20185355740x360.png?crc=3775202793",
      type: "image"
    }
  }
]

export const productDetails: ProductDetail[] = [
  {
    productId: 1,
    title: "The super-ellipse.",
    description: "The shape of the round icons derives from the super-ellipse shape of the new logotype. This connects the icon system to the corporate design.",
    imageData: {
      url: "https://www.iconwerk.com/images/iconwerk-blocket-super-elpse_2x.png?crc=419592740",
      type: "image"
    }
  },
  {
    productId: 1,
    title: 'The visual voice.',
    description: 'Blocket wants to be a positive force in society and make it easier for people to make smart, economical and sustainable decisions in their daily lives, and change how we consume for the better. The new icons reflect this position and speak in the most friendly and positive visual voice.',
    imageData: {
      url: "https://www.iconwerk.com/images/iconwerk-blocket-icon_2x.jpg?crc=4233333793",
      type: "image"
    }
  },
  {
    productId: 1,
    title: 'Solid & Outlined.',
    description: 'All new icons come in solid & outlined form. Both versions base on the exact  same vector master shape.',
    imageData: {
      url: 'https://www.iconwerk.com/images/iconwerk-blocket-icons_2x.jpg?crc=114894631',
      type: 'image'
    }
  },
  {
    productId: 2,
    title: 'Braun Linear is the new typeface for Braun.',
    description: 'It has very little modulation in the line strength, so we called it »Braun Linear«. \n And here you see the result. A sleek, useful, friendly, german, modern typeface that expands the communication of the new Braun and became a valuable corporate asset.',
    imageData: {
      url: 'https://www.iconwerk.com/images/bildschirmfoto%202022-09-18%20um%20122503_2x.jpg?crc=3986910768',
      type: 'image'
    }
  }
]
