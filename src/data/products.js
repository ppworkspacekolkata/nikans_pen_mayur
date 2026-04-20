// Reusable product data
import imgAuram from '../assets/photos/img740.jpg';
import imgAventus from '../assets/photos/img752.jpg';
import imgPentastic from '../assets/photos/img306.jpg';
import imgNeo from '../assets/photos/img502.jpg';
import imgAviator from '../assets/photos/img674.jpg';
import imgKiddo from '../assets/photos/img536.jpg';
import imgChisel from '../assets/photos/img462.jpg';
import imgBold from '../assets/photos/img171.jpg';
import imgSketch from '../assets/photos/img197.jpg';
import imgGel from '../assets/photos/img223.jpg';
import imgPack from '../assets/photos/img803.jpg';
import imgGift from '../assets/photos/img839.jpg';

export const PRODUCTS = [
  { 
    id: 'auram',
    name:'Auram Ball Pen',     
    cat:'Ball Pens',    
    tag:'Premium',  
    tip:'0.7mm', 
    colours:'Blue/Black', 
    units:10,  
    desc:'Nickel silver tip, gold-accented premium ball pen.', 
    img: imgAuram,
    gallery: [
      '/product/auram 1.png',
      imgAuram,
      '/product/aviator 1.png'
    ],
    brochure: '/product/chisel marker 1.png', // Placeholder for brochure photo
    details: 'The Auram range is designed for the professional segment, featuring a signature gold-plated clip and a high-precision nickel silver tip for an effortless writing experience. Engineered for long-term reliability and bulk global distribution.'
  },
  { 
    id: 'aventus',
    name:'Aventus Ball Pen',   
    cat:'Ball Pens',    
    tag:'Signature',
    tip:'1.0mm', 
    colours:'Blue/Black', 
    units:10,  
    desc:'Bold stroke signature pen with technical-blue body.', 
    img: imgAventus,
    gallery: ['/product/aventus 2.png', imgAventus],
    details: 'Aventus offers a bold writing experience with its 1.0mm tip. The technical blue aesthetic and ergonomic grip make it a favorite for signature tasks.'
  },
  { id: 'pentastic', name:'Pentastic Ball Pen', cat:'Ball Pens', tag:'Everyday', tip:'0.7mm', colours:'Multi', units:10, desc:'Transparent body, fine tip everyday writing pen.', img: imgPentastic },
  { id: 'neo', name:'Neo Ball Pen', cat:'Ball Pens', tag:'Smooth', tip:'Ball', colours:'Pastel', units:12, desc:'Super smooth ink flow with distinctive pastel body.', img: imgNeo },
  { id: 'aviator', name:'Aviator Ball Pen', cat:'Ball Pens', tag:'Bold', tip:'Ball', colours:'Multi', units:10, desc:'Aviation-inspired metallic body ball point pen.', img: imgAviator },
  { id: 'kiddo', name:'Kiddo Ball Pen', cat:'Ball Pens', tag:'Student', tip:'Ball', colours:'Fun', units:20, desc:'Child-friendly ergonomic pen for young writers.', img: imgKiddo },
  { id: 'chisel', name:'Chisel Marker', cat:'Markers', tag:'Washable', tip:'Chisel', colours:'10 Shades', units:10, desc:'Bold, washable chisel-tip markers for classrooms.', img: imgChisel },
  { id: 'bold', name:'Bold Washable Marker', cat:'Markers', tag:'Bold', tip:'Jumbo', colours:'10 Shades', units:10, desc:'Extra-bold washable marker for vibrant art work.', img: imgBold },
  { id: 'sketch', name:'Sketch Pen Set', cat:'Sketch Pens', tag:'Art', tip:'Fine', colours:'12 Colours', units:12, desc:'Fine-tip sketch pens for illustrations and colouring.', img: imgSketch },
  { id: 'gel', name:'Gel Pen Set', cat:'Gel Pens', tag:'Smooth', tip:'0.5mm', colours:'Blue/Black', units:12, desc:'Smooth gel ink cartridge for flowing handwriting.', img: imgGel },
  { id: 'pack', name:'Multi-Pack Assorted', cat:'Multi-Packs', tag:'Value', tip:'Mixed', colours:'Assorted', units:20, desc:'Best-value mixed pack across pen and marker categories.', img: imgPack },
  { id: 'gift', name:'Nikan Gift Set', cat:'Gift Sets', tag:'Gifting', tip:'Mixed', colours:'Curated', units:5, desc:'Curated gift-ready packaging with premium pen selection.', img: imgGift },
];
