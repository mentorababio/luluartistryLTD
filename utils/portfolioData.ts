// Import product images from assets
import browmapping from "@/assets/images/brow mapping pen.png";
import browsealant from "@/assets/images/brow sealant.png";
import Dbed from "@/assets/images/DBed cover.png";
import DoubleArm from "@/assets/images/Double ARM LIGHT.png";
import Dummyhead from "@/assets/images/Dummy head.png";
import ExScrup from "@/assets/images/ExScrup.png";
import eyePatches from "@/assets/images/eye patch.png";
import Ibprimer from "@/assets/images/Ib primer.png";
import lashbed from "@/assets/images/lash bed.png";
import lashblanket from "@/assets/images/lash bed blanket.png";
import lashwash from "@/assets/images/lash wash brush.png";
import OneBtm from "@/assets/images/One BTM.png";
import twoBtm from "@/assets/images/two btm.png";
import oneBtmCover from "@/assets/images/One BTM cover.png";
import Rqfr from "@/assets/images/Rose QFR.png";
import Igone from "@/assets/images/IG1.png";
import Igtwo from "@/assets/images/IG2.png";
import Igthree from "@/assets/images/IG3.png";
import Igfour from "@/assets/images/IG4.png";
import stool from "@/assets/images/stool.png";
import moonLight from "@/assets/images/moon light tray.png";
import moonLightInches from "@/assets/images/moon light inches.png";
import Glove from "@/assets/images/Glove.png";
import EasyLash from "@/assets/images/Easy lash fan tray.png";
import ClassicLash from "@/assets/images/classic lash fan.png";
import LashGlueTen from "@/assets/images/lash glue ten.png";
import LashGlueFive from "@/assets/images/lash glue five.png";
import LashBreathTape from "@/assets/images/lash breathable table.png";
import LashTransTape from "@/assets/images/lash trans tape.png";
import volumetweazer from "@/assets/images/volume tweezer.png";
import fibertweazer from "@/assets/images/fiber tip tweezer.png";
import lashfan from "@/assets/images/lash fan.png";
import gluering from "@/assets/images/glue ring.png";
import CurvedIsolation from "@/assets/images/curvad isolation.png";
import lashsealant from "@/assets/images/lash sealant.png";
import gluestorage from "@/assets/images/Glue Storage.png";
import Luxuryspa from "@/assets/images/Luxury spa body oil.png";
import Herbalsalt from "@/assets/images/Herbal Bath salts.png";
import Aromatherapy from "@/assets/images/Aromatherapy.png";
import greentea from "@/assets/images/green tea.png";
import claydetox from "@/assets/images/clay detox.png";
import coolingeye from "@/assets/images/cooling eye.png";
import Eucalyptus from "@/assets/images/Eucalyptus.png";
import coconutmilk from "@/assets/images/coconut milk.png";
import footscrub from "@/assets/images/Foot scrub.png";
import silksleep from "@/assets/images/Silk sleep.png";
import Detox from "@/assets/images/Detox.png";
import messagebalm from "@/assets/images/message balm.png";
import hydratingsheet from "@/assets/images/Hydrating sheet.png";
import spaTowelSet from "@/assets/images/spa towel set.png";
import rose from "@/assets/images/rose.png";
import spaIncense from "@/assets/images/spa incense.png";
import luxuryspaGift from "@/assets/images/luxury spa gift.png";
import MastP60 from "@/assets/images/P60.png";
import FandE from "@/assets/images/FandE (1).png";
import GoldenRose from "@/assets/images/GoldenRose.png";
import tag45 from "@/assets/images/tag45.png";
import numb from "@/assets/images/numb.png";
import mastpro from "@/assets/images/mastpro.png";
import mappingstring from "@/assets/images/mapping string.png";

import type { StaticImageData } from "next/image";


export interface PortfolioItem {
  id: string;
  title: string;
  category: 'lashes' | 'nails' | 'tattoos' | 'brows' | 'makeup';
  image: string;
  description: string;
  tags: string[];
  featured: boolean;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'lashes' | 'nails' | 'tattoos' | 'brows' | 'tools' | 'spa';
  price: number;
  originalPrice?: number;
  image: string | StaticImageData;
  images: (string | StaticImageData)[];
  description: string;
  features: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
  tags: string[];
  featured: boolean;
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: '1',
    title: 'Dramatic Volume Lashes',
    category: 'lashes',
    image: '/api/placeholder/400/500',
    description: 'Full volume lash set with dramatic curl and length for special occasions.',
    tags: ['volume', 'dramatic', 'special occasion'],
    featured: true,
    date: '2024-01-15'
  },
  {
    id: '2',
    title: 'Natural Classic Set',
    category: 'lashes',
    image: '/api/placeholder/400/500',
    description: 'Subtle enhancement for everyday wear with natural-looking lashes.',
    tags: ['natural', 'classic', 'everyday'],
    featured: false,
    date: '2024-01-10'
  },
  {
    id: '3',
    title: 'Glamour Nail Art',
    category: 'nails',
    image: '/api/placeholder/400/500',
    description: 'Intricate nail art with rhinestones and metallic accents.',
    tags: ['glamour', 'rhinestones', 'metallic'],
    featured: true,
    date: '2024-01-12'
  },
  {
    id: '4',
    title: 'Minimalist Tattoo Design',
    category: 'tattoos',
    image: '/api/placeholder/400/500',
    description: 'Clean, minimalist tattoo design with fine line work.',
    tags: ['minimalist', 'fine line', 'clean'],
    featured: false,
    date: '2024-01-08'
  },
  {
    id: '5',
    title: 'Perfect Brow Shaping',
    category: 'brows',
    image: '/api/placeholder/400/500',
    description: 'Professional brow shaping and tinting for the perfect arch.',
    tags: ['shaping', 'tinting', 'professional'],
    featured: true,
    date: '2024-01-14'
  },
  {
    id: '6',
    title: 'Bridal Makeup Look',
    category: 'makeup',
    image: '/api/placeholder/400/500',
    description: 'Elegant bridal makeup with long-lasting, photo-ready finish.',
    tags: ['bridal', 'elegant', 'long-lasting'],
    featured: true,
    date: '2024-01-16'
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Moon Ligth Tray',
    category: 'tools',
    price: 20000,
    image: moonLight,
    images: [moonLight],
    description: 'Professional lash bed for comfortable client positioning during lash extension services.',
    features: ['Adjustable height', 'Comfortable padding', 'Professional grade', 'Easy to clean'],
    inStock: true,
    rating: 4.5,
    reviews: 127,
    tags: ['professional', 'lashes', 'equipment'],
    featured: true
  },
  {
    id: '2',
    name: 'Stool',
    category: 'tools',
    price: 40000,
    image: stool,
    images: [stool],
    description: 'Professional lash bed for comfortable client positioning during lash extension services.',
    features: ['Adjustable height', 'Comfortable padding', 'Professional grade', 'Easy to clean'],
    inStock: true,
    rating: 4.5,
    reviews: 127,
    tags: ['professional', 'lashes', 'equipment'],
    featured: true
  },
  {
    id: '3',
    name: 'Lash Bed',
    category: 'tools',
    price: 230000,
    image: lashbed,
    images: [lashbed, lashblanket],
    description: 'Professional lash bed for comfortable client positioning during lash extension services.',
    features: ['Adjustable height', 'Comfortable padding', 'Professional grade', 'Easy to clean'],
    inStock: true,
    rating: 4.5,
    reviews: 127,
    tags: ['professional', 'lashes', 'equipment'],
    featured: true
  },
  {
    id: '4',
    name: 'Disposable Bed Cover',
    category: 'tools',
    price: 24000,
    image: Dbed,
    images: [Dbed],
    description: 'Hygienic disposable bed cover for maintaining cleanliness during beauty services.',
    features: ['Disposable', 'Hygienic', 'Easy to use', 'Comfortable'],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    tags: ['hygienic', 'disposable', 'professional'],
    featured: false
  },
  {
    id: '5',
    name: 'Glove',
    category: 'tools',
    price: 13000,
    image: Glove,
    images: [Glove],
    description: 'Professional single battery tattoo machine for precise and consistent work.',
    features: ['Single battery', 'Precise control', 'Professional grade', 'Lightweight'],
    inStock: true,
    rating: 4.9,
    reviews: 78,
    tags: ['tattoo', 'professional', 'battery'],
    featured: false
  }, 
  {
    id: '6',
    name: 'One Battery Tattoo Machine',
    category: 'tools',
    price: 55000,
    image: OneBtm,
    images: [OneBtm, oneBtmCover],
    description: 'Professional single battery tattoo machine for precise and consistent work.',
    features: ['Single battery', 'Precise control', 'Professional grade', 'Lightweight'],
    inStock: true,
    rating: 4.9,
    reviews: 78,
    tags: ['tattoo', 'professional', 'battery'],
    featured: false
  },
  {
    id: '7',
    name: 'Two Battery Tattoo Machine',
    category: 'tools',
    price: 45000,
    image: twoBtm,
    images: [twoBtm],
    description: 'Dual battery tattoo machine for extended operation and consistent performance.',
    features: ['Dual battery', 'Extended runtime', 'Consistent performance', 'Professional grade'],
    inStock: true,
    rating: 4.4,
    reviews: 92,
    tags: ['tattoo', 'professional', 'dual battery'],
    featured: false
  },
  {
    id: '8',
    name: 'Moon Ligth 26 Inches',
    category: 'tools',
    price: 130000,
    image: moonLightInches,
    images: [moonLight, moonLightInches],
    description: 'Professional lash bed for comfortable client positioning during lash extension services.',
    features: ['Adjustable height', 'Comfortable padding', 'Professional grade', 'Easy to clean'],
    inStock: true,
    rating: 4.5,
    reviews: 127,
    tags: ['professional', 'lashes', 'equipment'],
    featured: true
  },
  {
    id: '9',
    name: 'Eye Patch',
    category: 'tools',
    price: 5000,
    image: eyePatches,
    images: [eyePatches],
    description: 'Protective eye patches for safe beauty treatments and procedures.',
    features: ['Protective', 'Comfortable', 'Disposable', 'Safe'],
    inStock: true,
    rating: 4.4,
    reviews: 67,
    tags: ['protection', 'eye care', 'professional'],
    featured: false
  },
  {
    id: '10',
    name: 'Lash Bed Blanket',
    category: 'tools',
    price: 25000,
    image: lashblanket,
    images: [lashblanket],
    description: 'Comfortable blanket for lash bed to enhance client comfort during treatments.',
    features: ['Comfortable', 'Washable', 'Soft material', 'Fits perfectly'],
    inStock: true,
    rating: 4.6,
    reviews: 89,
    tags: ['comfort', 'lashes', 'accessory'],
    featured: false
  },
  {
    id: '11',
    name: 'Brow Mapping Pen',
    category: 'brows',
    price: 4500,
    image: browmapping,
    images: [browmapping],
    description: 'Professional brow mapping pen for precise brow design and symmetry.',
    features: ['Precise marking', 'Water-soluble', 'Professional tool', 'Easy to use'],
    inStock: true,
    rating: 4.6,
    reviews: 112,
    tags: ['brows', 'professional', 'mapping'],
    featured: true
  },
  {
    id: '12',
    name: 'Lash Wash Brush',
    category: 'tools',
    price: 2000,
    image: lashwash,
    images: [lashwash],
    description: 'Gentle brush for cleaning and maintaining lash extensions.',
    features: ['Gentle bristles', 'Easy to use', 'Effective cleaning', 'Professional'],
    inStock: true,
    rating: 4.8,
    reviews: 156,
    tags: ['lashes', 'cleaning', 'maintenance'],
    featured: false
  },
  {
    id: '13',
    name: 'IB Primer',
    category: 'tools',
    price: 10000,
    image: Ibprimer,
    images: [Ibprimer],
    description: 'Professional primer for improved product adherence and long-lasting results.',
    features: ['Professional grade', 'Long-lasting', 'Improves adherence', 'Lightweight'],
    inStock: true,
    rating: 4.7,
    reviews: 134,
    tags: ['primer', 'professional', 'base'],
    featured: true
  },
  {
    id: '14',
    name: 'Brow Sealant',
    category: 'brows',
    price: 10000,
    image: browsealant,
    images: [browsealant],
    description: 'Long-lasting brow sealant to keep brows in place all day.',
    features: ['Long-lasting', 'Waterproof', 'Easy application', 'Natural finish'],
    inStock: true,
    rating: 4.5,
    reviews: 98,
    tags: ['brows', 'sealant', 'styling'],
    featured: false
  },
  {
    id: '15',
    name: 'Dummy Head',
    category: 'tools',
    price: 6500,
    image: Dummyhead,
    images: [Dummyhead],
    description: 'Professional training dummy head for practicing lash and brow techniques.',
    features: ['Training tool', 'Realistic', 'Durable', 'Professional'],
    inStock: true,
    rating: 4.5,
    reviews: 54,
    tags: ['training', 'practice', 'professional'],
    featured: false
  },
  {
    id: '16',
    name: 'Double Arm Light',
    category: 'tools',
    price: 65000,
    image: DoubleArm,
    images: [DoubleArm],
    description: 'Professional double arm adjustable lighting for optimal visibility during treatments.',
    features: ['Double arm design', 'Adjustable', 'Bright LED', 'Professional grade'],
    inStock: true,
    rating: 4.9,
    reviews: 76,
    tags: ['lighting', 'professional', 'adjustable'],
    featured: true
  },
  // {
  //   id: '3',
  //   name: 'Exfoliating Body Scrub',
  //   category: 'tools',
  //   price: 14000,
  //   image: ExScrup,
  //   images: [ExScrup],
  //   description: 'Gentle exfoliating body scrub for smooth, radiant skin.',
  //   features: ['Gentle exfoliation', 'Moisturizing', 'Natural ingredients', 'All skin types'],
  //   inStock: true,
  //   rating: 4.3,
  //   reviews: 156,
  //   tags: ['skincare', 'exfoliating', 'body care'],
  //   featured: true
  // },
  // {
  //   id: '4',
  //   name: 'Rose Quartz Facial Roll',
  //   category: 'tools',
  //   price: 12000,
  //   image: Rqfr,
  //   images: [Rqfr],
  //   description: 'Premium rose quartz facial roller for reducing puffiness and promoting circulation.',
  //   features: ['Rose quartz', 'Dual-sided', 'Promotes circulation', 'Reduces puffiness'],
  //   inStock: true,
  //   rating: 4.7,
  //   reviews: 203,
  //   tags: ['facial', 'skincare', 'massage'],
  //   featured: false
  // },
  // {
  //   id: '7',
  //   name: 'One Battery Tattoo Machine Cover',
  //   category: 'tools',
  //   price: 500,
  //   image: oneBtmCover,
  //   images: [oneBtmCover],
  //   description: 'Protective cover for one battery tattoo machine to maintain hygiene.',
  //   features: ['Protective', 'Hygienic', 'Easy to clean', 'Fits perfectly'],
  //   inStock: true,
  //   rating: 4.2,
  //   reviews: 145,
  //   tags: ['tattoo', 'accessory', 'hygienic'],
  //   featured: false
  // },

  
  // Lashes Category Products
  {
    id: '17',
    name: 'Eye Patch',
    category: 'lashes',
    price: 5000,
    image: eyePatches,
    images: [eyePatches],
    description: 'Protective eye patches for safe beauty treatments and procedures.',
    features: ['Protective', 'Comfortable', 'Disposable', 'Safe'],
    inStock: true,
    rating: 4.4,
    reviews: 67,
    tags: ['protection', 'eye care', 'professional'],
    featured: false
  },
  {
    id: '18',
    name: 'Lash Bed Blanket',
    category: 'lashes',
    price: 25000,
    image: lashblanket,
    images: [lashblanket],
    description: 'Comfortable blanket for lash bed to enhance client comfort during treatments.',
    features: ['Comfortable', 'Washable', 'Soft material', 'Fits perfectly'],
    inStock: true,
    rating: 4.6,
    reviews: 89,
    tags: ['comfort', 'lashes', 'accessory'],
    featured: false
  },
  {
    id: '19',
    name: 'Brow Mapping Pen',
    category: 'lashes',
    price: 4500,
    image: browmapping,
    images: [browmapping],
    description: 'Professional brow mapping pen for precise brow design and symmetry.',
    features: ['Precise marking', 'Water-soluble', 'Professional tool', 'Easy to use'],
    inStock: true,
    rating: 4.6,
    reviews: 112,
    tags: ['brows', 'professional', 'mapping'],
    featured: true
  },
  {
    id: '20',
    name: 'Lash Wash Brush',
    category: 'lashes',
    price: 2000,
    image: lashwash,
    images: [lashwash],
    description: 'Gentle brush for cleaning and maintaining lash extensions.',
    features: ['Gentle bristles', 'Easy to use', 'Effective cleaning', 'Professional'],
    inStock: true,
    rating: 4.8,
    reviews: 156,
    tags: ['lashes', 'cleaning', 'maintenance'],
    featured: false
  },
  {
    id: '21',
    name: 'Lash Bed',
    category: 'lashes',
    price: 230000,
    image: lashbed,
    images: [lashbed, lashblanket],
    description: 'Professional lash bed for comfortable client positioning during lash extension services.',
    features: ['Adjustable height', 'Comfortable padding', 'Professional grade', 'Easy to clean'],
    inStock: true,
    rating: 4.5,
    reviews: 127,
    tags: ['professional', 'lashes', 'equipment'],
    featured: true
  }, 
  {
    id: '22',
    name: 'Disposable Bed Cover',
    category: 'lashes',
    price: 24000,
    image: Dbed,
    images: [Dbed],
    description: 'Hygienic disposable bed cover for maintaining cleanliness during beauty services.',
    features: ['Disposable', 'Hygienic', 'Easy to use', 'Comfortable'],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    tags: ['hygienic', 'disposable', 'professional'],
    featured: false
  },
  {
    id: '23',
    name: 'Easy Lash Fan Tray',
    category: 'lashes',
    price: 9000,
    image: EasyLash,
    images: [EasyLash],
    description: 'Hygienic disposable bed cover for maintaining cleanliness during beauty services.',
    features: ['Disposable', 'Hygienic', 'Easy to use', 'Comfortable'],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    tags: ['hygienic', 'disposable', 'professional'],
    featured: false
  },
  {
    id: '24',
    name: 'Classic Lash Fan',
    category: 'lashes',
    price: 9000,
    image: ClassicLash,
    images: [ClassicLash],
    description: 'Hygienic disposable bed cover for maintaining cleanliness during beauty services.',
    features: ['Disposable', 'Hygienic', 'Easy to use', 'Comfortable'],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    tags: ['hygienic', 'disposable', 'professional'],
    featured: false
  },
  {
    id: '25',
    name: 'Glove',
    category: 'lashes',
    price: 13000,
    image: Glove,
    images: [Glove],
    description: 'Hygienic disposable bed cover for maintaining cleanliness during beauty services.',
    features: ['Disposable', 'Hygienic', 'Easy to use', 'Comfortable'],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    tags: ['hygienic', 'disposable', 'professional'],
    featured: false
  },
  {
    id: '26',
    name: 'Lash Glue 10Ml',
    category: 'lashes',
    price: 20000,
    image: LashGlueTen,
    images: [LashGlueTen],
    description: 'Hygienic disposable bed cover for maintaining cleanliness during beauty services.',
    features: ['Disposable', 'Hygienic', 'Easy to use', 'Comfortable'],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    tags: ['hygienic', 'disposable', 'professional'],
    featured: false
  },
  {
    id: '27',
    name: 'Lash Glue 5Ml',
    category: 'lashes',
    price: 16000,
    image: LashGlueFive,
    images: [LashGlueFive],
    description: 'Hygienic disposable bed cover for maintaining cleanliness during beauty services.',
    features: ['Disposable', 'Hygienic', 'Easy to use', 'Comfortable'],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    tags: ['hygienic', 'disposable', 'professional'],
    featured: false
  },
  {
    id: '28',
    name: 'Lash Breathable Tape',
    category: 'lashes',
    price: 1200,
    image: LashBreathTape,
    images: [LashBreathTape],
    description: 'Hygienic disposable bed cover for maintaining cleanliness during beauty services.',
    features: ['Disposable', 'Hygienic', 'Easy to use', 'Comfortable'],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    tags: ['hygienic', 'disposable', 'professional'],
    featured: false
  },
  {
    id: '29',
    name: 'Lash Transparent Tape',
    category: 'lashes',
    price: 1000,
    image: LashTransTape,
    images: [LashTransTape],
    description: 'Hygienic disposable bed cover for maintaining cleanliness during beauty services.',
    features: ['Disposable', 'Hygienic', 'Easy to use', 'Comfortable'],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    tags: ['hygienic', 'disposable', 'professional'],
    featured: false
  },
  {
    id: '30',
    name: 'Volume Tweezer',
    category: 'lashes',
    price: 7500,
    image: volumetweazer,
    images: [volumetweazer],
    description: 'Hygienic disposable bed cover for maintaining cleanliness during beauty services.',
    features: ['Disposable', 'Hygienic', 'Easy to use', 'Comfortable'],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    tags: ['hygienic', 'disposable', 'professional'],
    featured: false
  },
  {
    id: '31',
    name: 'Fiber Tip Tweezer',
    category: 'lashes',
    price: 8000,
    image: fibertweazer,
    images: [fibertweazer],
    description: 'Hygienic disposable bed cover for maintaining cleanliness during beauty services.',
    features: ['Disposable', 'Hygienic', 'Easy to use', 'Comfortable'],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    tags: ['hygienic', 'disposable', 'professional'],
    featured: false
  },
  {
    id: '32',
    name: 'Lash Fan',
    category: 'lashes',
    price: 6500,
    image: lashfan,
    images: [lashfan],
    description: 'Hygienic disposable bed cover for maintaining cleanliness during beauty services.',
    features: ['Disposable', 'Hygienic', 'Easy to use', 'Comfortable'],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    tags: ['hygienic', 'disposable', 'professional'],
    featured: false
  },
  {
    id: '33',
    name: 'Glue Ring',
    category: 'lashes',
    price: 5000,
    image: gluering,
    images: [gluering],
    description: 'Hygienic disposable bed cover for maintaining cleanliness during beauty services.',
    features: ['Disposable', 'Hygienic', 'Easy to use', 'Comfortable'],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    tags: ['hygienic', 'disposable', 'professional'],
    featured: false
  },
  {
    id: '34',
    name: 'Curved Isolation Tweezer',
    category: 'lashes',
    price: 7000,
    image: CurvedIsolation ,
    images: [CurvedIsolation ],
    description: 'Hygienic disposable bed cover for maintaining cleanliness during beauty services.',
    features: ['Disposable', 'Hygienic', 'Easy to use', 'Comfortable'],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    tags: ['hygienic', 'disposable', 'professional'],
    featured: false
  },
  {
    id: '35',
    name: 'Lash Sealant',
    category: 'lashes',
    price: 8000,
    image: lashsealant,
    images: [lashsealant],
    description: 'Hygienic disposable bed cover for maintaining cleanliness during beauty services.',
    features: ['Disposable', 'Hygienic', 'Easy to use', 'Comfortable'],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    tags: ['hygienic', 'disposable', 'professional'],
    featured: false
  },
  {
    id: '36',
    name: 'Glue Storage',
    category: 'lashes',
    price: 5000,
    image: gluestorage,
    images: [gluestorage],
    description: 'Hygienic disposable bed cover for maintaining cleanliness during beauty services.',
    features: ['Disposable', 'Hygienic', 'Easy to use', 'Comfortable'],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    tags: ['hygienic', 'disposable', 'professional'],
    featured: false
  },
  {
    id: '37',
    name: 'IB Primer',
    category: 'lashes',
    price: 10000,
    image: Ibprimer,
    images: [Ibprimer],
    description: 'Professional primer for improved product adherence and long-lasting results.',
    features: ['Professional grade', 'Long-lasting', 'Improves adherence', 'Lightweight'],
    inStock: true,
    rating: 4.7,
    reviews: 134,
    tags: ['primer', 'professional', 'base'],
    featured: true
  },

 
  
  // Tattoos Category Products
  {
    id: '38',
    name: 'Mast P60 Machine',
    category: 'tattoos',
    price: 450000,
    image: MastP60,
    images: [MastP60],
    description: 'Professional training dummy head for practicing tattoo techniques.',
    features: ['Training tool', 'Realistic', 'Durable', 'Professional'],
    inStock: true,
    rating: 4.5,
    reviews: 54,
    tags: ['training', 'practice', 'professional'],
    featured: false
  },
  {
    id: '39',
    name: 'One Battery Tattoo Machine',
    category: 'tattoos',
    price: 55000,
    image: OneBtm,
    images: [OneBtm, oneBtmCover],
    description: 'Professional single battery tattoo machine for precise and consistent work.',
    features: ['Single battery', 'Precise control', 'Professional grade', 'Lightweight'],
    inStock: true,
    rating: 4.9,
    reviews: 78,
    tags: ['tattoo', 'professional', 'battery'],
    featured: true
  },
  {
    id: '40',
    name: 'Two Battery Tattoo Machine',
    category: 'tattoos',
    price: 45000,
    image: twoBtm,
    images: [twoBtm],
    description: 'Dual battery tattoo machine for extended operation and consistent performance.',
    features: ['Dual battery', 'Extended runtime', 'Consistent performance', 'Professional grade'],
    inStock: true,
    rating: 4.4,
    reviews: 92,
    tags: ['tattoo', 'professional', 'dual battery'],
    featured: false
  },
  {
    id: '41',
    name: 'One Battery Tattoo Machine Cover',
    category: 'tattoos',
    price: 500,
    image: oneBtmCover,
    images: [oneBtmCover],
    description: 'Protective cover for one battery tattoo machine to maintain hygiene.',
    features: ['Protective', 'Hygienic', 'Easy to clean', 'Fits perfectly'],
    inStock: true,
    rating: 4.2,
    reviews: 145,
    tags: ['tattoo', 'accessory', 'hygienic'],
    featured: false
  },
  {
    id: '42',
    name: 'F&E Primary Cream',
    category: 'tattoos',
    price: 18000,
    image: FandE,
    images: [FandE],
    description: 'Protective cover for one battery tattoo machine to maintain hygiene.',
    features: ['Protective', 'Hygienic', 'Easy to clean', 'Fits perfectly'],
    inStock: true,
    rating: 4.2,
    reviews: 145,
    tags: ['tattoo', 'accessory', 'hygienic'],
    featured: false
  },
  {
    id: '43',
    name: 'Golden Rose Anesthe',
    category: 'tattoos',
    price: 10000,
    image: GoldenRose ,
    images: [GoldenRose],
    description: 'Protective cover for one battery tattoo machine to maintain hygiene.',
    features: ['Protective', 'Hygienic', 'Easy to clean', 'Fits perfectly'],
    inStock: true,
    rating: 4.2,
    reviews: 145,
    tags: ['tattoo', 'accessory', 'hygienic'],
    featured: false
  },
  {
    id: '44',
    name: 'Tag 45 Secondary Num ',
    category: 'tattoos',
    price: 15000,
    image: tag45,
    images: [tag45],
    description: 'Protective cover for one battery tattoo machine to maintain hygiene.',
    features: ['Protective', 'Hygienic', 'Easy to clean', 'Fits perfectly'],
    inStock: true,
    rating: 4.2,
    reviews: 145,
    tags: ['tattoo', 'accessory', 'hygienic'],
    featured: false
  },
  {
    id: '45',
    name: 'Primary Numb Cream',
    category: 'tattoos',
    price: 15000,
    image: numb,
    images: [numb],
    description: 'Protective cover for one battery tattoo machine to maintain hygiene.',
    features: ['Protective', 'Hygienic', 'Easy to clean', 'Fits perfectly'],
    inStock: true,
    rating: 4.2,
    reviews: 145,
    tags: ['tattoo', 'accessory', 'hygienic'],
    featured: false
  },
  {
    id: '46',
    name: 'Mast Pro Catridge 20pi',
    category: 'tattoos',
    price: 28000,
    image: mastpro,
    images: [mastpro],
    description: 'Protective cover for one battery tattoo machine to maintain hygiene.',
    features: ['Protective', 'Hygienic', 'Easy to clean', 'Fits perfectly'],
    inStock: true,
    rating: 4.2,
    reviews: 145,
    tags: ['tattoo', 'accessory', 'hygienic'],
    featured: false
  },
  {
    id: '47',
    name: 'Mapping Strings',
    category: 'tattoos',
    price: 15000,
    image: mappingstring,
    images: [mappingstring],
    description: 'Protective cover for one battery tattoo machine to maintain hygiene.',
    features: ['Protective', 'Hygienic', 'Easy to clean', 'Fits perfectly'],
    inStock: true,
    rating: 4.2,
    reviews: 145,
    tags: ['tattoo', 'accessory', 'hygienic'],
    featured: false
  },

 
  // Spa Category Products
{
  id: '48',
  name: 'Luxury Spa Body Oil',
  category: 'spa',
  price: 18000,
  image: Luxuryspa,
  images: [Luxuryspa],
  description: 'Gentle exfoliating body scrub for smooth, radiant skin.',
  features: ['Gentle exfoliation', 'Moisturizing', 'Natural ingredients', 'All skin types'],
  inStock: true,
  rating: 4.3,
  reviews: 156,
  tags: ['skincare', 'exfoliating', 'body care'],
  featured: true
},
{
  id: '49',
  name: 'Herbal Bath Salt',
  category: 'spa',
  price: 12500,
  image: Herbalsalt,
  images: [Herbalsalt],
  description: 'Gentle exfoliating body scrub for smooth, radiant skin.',
  features: ['Gentle exfoliation', 'Moisturizing', 'Natural ingredients', 'All skin types'],
  inStock: true,
  rating: 4.3,
  reviews: 156,
  tags: ['skincare', 'exfoliating', 'body care'],
  featured: true
},
{
  id: '50',
  name: 'Aromatherapy Candle',
  category: 'spa',
  price: 10000,
  image: Aromatherapy ,
  images: [Aromatherapy],
  description: 'Gentle exfoliating body scrub for smooth, radiant skin.',
  features: ['Gentle exfoliation', 'Moisturizing', 'Natural ingredients', 'All skin types'],
  inStock: true,
  rating: 4.3,
  reviews: 156,
  tags: ['skincare', 'exfoliating', 'body care'],
  featured: true
},
  {
    id: '51',
    name: 'Green Tea Facial Mask',
    category: 'spa',
    price: 14000,
    image: greentea,
    images: [greentea],
    description: 'Gentle exfoliating body scrub for smooth, radiant skin.',
    features: ['Gentle exfoliation', 'Moisturizing', 'Natural ingredients', 'All skin types'],
    inStock: true,
    rating: 4.3,
    reviews: 156,
    tags: ['skincare', 'exfoliating', 'body care'],
    featured: true
  },
  {
    id: '52',
    name: 'Exfoliating Body Scrub',
    category: 'spa',
    price: 14000,
    image: ExScrup,
    images: [ExScrup],
    description: 'Gentle exfoliating body scrub for smooth, radiant skin.',
    features: ['Gentle exfoliation', 'Moisturizing', 'Natural ingredients', 'All skin types'],
    inStock: true,
    rating: 4.3,
    reviews: 156,
    tags: ['skincare', 'exfoliating', 'body care'],
    featured: true
  },
  {
    id: '53',
    name: 'Rose Quartz Facial Roll',
    category: 'spa',
    price: 12000,
    image: Rqfr,
    images: [Rqfr],
    description: 'Premium rose quartz facial roller for reducing puffiness and promoting circulation.',
    features: ['Rose quartz', 'Dual-sided', 'Promotes circulation', 'Reduces puffiness'],
    inStock: true,
    rating: 4.7,
    reviews: 203,
    tags: ['facial', 'skincare', 'massage'],
    featured: false
  },
  {
    id: '54',
    name: 'Clay Detox Mask',
    category: 'spa',
    price: 13000,
    image: claydetox,
    images: [claydetox],
    description: 'Professional primer for improved product adherence and long-lasting results.',
    features: ['Professional grade', 'Long-lasting', 'Improves adherence', 'Lightweight'],
    inStock: true,
    rating: 4.7,
    reviews: 134,
    tags: ['primer', 'professional', 'base'],
    featured: true
  },
  {
    id: '55',
    name: 'Cooling Eye Gel Pad',
    category: 'spa',
    price: 11000,
    image: coolingeye,
    images: [coolingeye],
    description: 'Hygienic disposable bed cover for maintaining cleanliness during spa services.',
    features: ['Disposable', 'Hygienic', 'Easy to use', 'Comfortable'],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    tags: ['hygienic', 'disposable', 'professional'],
    featured: false
  },
  {
    id: '56',
    name: 'Eucalyptus Shower Ste',
    category: 'spa',
    price: 10000,
    image: Eucalyptus,
    images: [Eucalyptus],
    description: 'Hygienic disposable bed cover for maintaining cleanliness during spa services.',
    features: ['Disposable', 'Hygienic', 'Easy to use', 'Comfortable'],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    tags: ['hygienic', 'disposable', 'professional'],
    featured: false
  },
  {
    id: '57',
    name: 'Coconut Milk Bath Soak',
    category: 'spa',
    price: 16000,
    image: coconutmilk,
    images: [coconutmilk],
    description: 'Hygienic disposable bed cover for maintaining cleanliness during spa services.',
    features: ['Disposable', 'Hygienic', 'Easy to use', 'Comfortable'],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    tags: ['hygienic', 'disposable', 'professional'],
    featured: false
  },
  {
    id: '58',
    name: 'Luxury Foot Scrub',
    category: 'spa',
    price: 13000,
    image: footscrub,
    images: [footscrub],
    description: 'Hygienic disposable bed cover for maintaining cleanliness during spa services.',
    features: ['Disposable', 'Hygienic', 'Easy to use', 'Comfortable'],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    tags: ['hygienic', 'disposable', 'professional'],
    featured: false
  },
  {
    id: '59',
    name: 'Silk Sleep Mask',
    category: 'spa',
    price: 10500,
    image: silksleep,
    images: [silksleep],
    description: 'Hygienic disposable bed cover for maintaining cleanliness during spa services.',
    features: ['Disposable', 'Hygienic', 'Easy to use', 'Comfortable'],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    tags: ['hygienic', 'disposable', 'professional'],
    featured: false
  },
  {
    id: '60',
    name: 'Detox Herbal Tea Blend',
    category: 'spa',
    price: 11000,
    image: Detox,
    images: [Detox],
    description: 'Hygienic disposable bed cover for maintaining cleanliness during spa services.',
    features: ['Disposable', 'Hygienic', 'Easy to use', 'Comfortable'],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    tags: ['hygienic', 'disposable', 'professional'],
    featured: false
  },
  {
    id: '61',
    name: 'Body Massage Balm',
    category: 'spa',
    price: 16000,
    image: messagebalm,
    images: [messagebalm],
    description: 'Hygienic disposable bed cover for maintaining cleanliness during spa services.',
    features: ['Disposable', 'Hygienic', 'Easy to use', 'Comfortable'],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    tags: ['hygienic', 'disposable', 'professional'],
    featured: false
  },
  {
    id: '62',
    name: 'Hydrating Sheet Mask ',
    category: 'spa',
    price: 14000,
    image: hydratingsheet,
    images: [hydratingsheet],
    description: 'Hygienic disposable bed cover for maintaining cleanliness during spa services.',
    features: ['Disposable', 'Hygienic', 'Easy to use', 'Comfortable'],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    tags: ['hygienic', 'disposable', 'professional'],
    featured: false
  },
  {
    id: '63',
    name: 'Luxury Spa Towel Set',
    category: 'spa',
    price: 20000,
    image: spaTowelSet,
    images: [spaTowelSet],
    description: 'Hygienic disposable bed cover for maintaining cleanliness during spa services.',
    features: ['Disposable', 'Hygienic', 'Easy to use', 'Comfortable'],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    tags: ['hygienic', 'disposable', 'professional'],
    featured: false
  },
  {
    id: '64',
    name: 'Rose Infused Toner Mist',
    category: 'spa',
    price: 14000,
    image: rose,
    images: [rose],
    description: 'Hygienic disposable bed cover for maintaining cleanliness during spa services.',
    features: ['Disposable', 'Hygienic', 'Easy to use', 'Comfortable'],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    tags: ['hygienic', 'disposable', 'professional'],
    featured: false
  },
  {
    id: '65',
    name: ' Spa Incense Sticks',
    category: 'spa',
    price: 10000,
    image: spaIncense,
    images: [spaIncense],
    description: 'Hygienic disposable bed cover for maintaining cleanliness during spa services.',
    features: ['Disposable', 'Hygienic', 'Easy to use', 'Comfortable'],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    tags: ['hygienic', 'disposable', 'professional'],
    featured: false
  },
  {
    id: '66',
    name: 'Luxury Spa Gift Set',
    category: 'spa',
    price: 28000,
    image: luxuryspaGift,
    images: [luxuryspaGift],
    description: 'Hygienic disposable bed cover for maintaining cleanliness during spa services.',
    features: ['Disposable', 'Hygienic', 'Easy to use', 'Comfortable'],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    tags: ['hygienic', 'disposable', 'professional'],
    featured: false
  },

];

export const categories = [
  { id: 'all', name: 'All', count: portfolioItems.length },
  { id: 'lashes', name: 'Lashes', count: portfolioItems.filter(item => item.category === 'lashes').length },
  { id: 'nails', name: 'Nails', count: portfolioItems.filter(item => item.category === 'nails').length },
  { id: 'tattoos', name: 'Tattoos', count: portfolioItems.filter(item => item.category === 'tattoos').length },
  { id: 'brows', name: 'Brows', count: portfolioItems.filter(item => item.category === 'brows').length },
  { id: 'makeup', name: 'Makeup', count: portfolioItems.filter(item => item.category === 'makeup').length }
];
