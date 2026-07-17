/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SubcategoryCardProps {
  name: string;
  categorySlug: string;
}

const SUBCATEGORY_IMAGES: Record<string, string> = {
  // Wallpapers
  '3d wallpapers': 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=400&q=80',
  'floral wallpapers': 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=400&q=80',
  'geometric wallpapers': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400&q=80',
  'textured wallpapers': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80',
  'brick and stone wallpapers': 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=400&q=80',
  'kids wallpapers': 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80',
  'customized wallpapers': 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=400&q=80',

  // Wall Panels (Curated, accurate, and completely unique)
  'pvc wall panels': 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=400&q=80',
  'wpc wall panels': 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=400&q=80',
  'charcoal panels': 'https://images.unsplash.com/photo-1618221381711-42ca8ab6e908?auto=format&fit=crop&w=400&q=80',
  'louver panels': 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=400&q=80',
  'fabric louver panels': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=400&q=80',
  'acrylic louver panels': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',
  'wooden wall panels': 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=400&q=80',
  'pu stone panels': 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=400&q=80',
  '3d wall panels': 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=400&q=80',
  'uv sheets': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400&q=80',
  'uv marble sheets': 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=400&q=80',

  // Glass Films
  'frosted glass film': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
  'privacy glass film': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
  'one-way vision film': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80',
  'sun control film': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',
  'decorative glass film': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80',
  'printed glass film': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80',
  'safety glass film': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',

  // Blinds
  'roller blinds': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',
  'zebra blinds': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',
  'roman blinds': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=400&q=80',
  'vertical blinds': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',
  'venetian blinds': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',
  'wooden blinds': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',
  'motorized blinds': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',

  // Flooring
  'wooden flooring': 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=400&q=80',
  'laminate flooring': 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=400&q=80',
  'vinyl flooring': 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=400&q=80',
  'spc flooring': 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=400&q=80',
  'pvc flooring': 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=400&q=80',
  'carpet flooring': 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=400&q=80',
  'artificial grass': 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=400&q=80',

  // Artificial Plants
  'small artificial plants': 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=400&q=80',
  'large artificial plants': 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=400&q=80',
  'artificial trees': 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=400&q=80',
  'hanging plants': 'https://images.unsplash.com/photo-1530745342582-0795f23ec976?auto=format&fit=crop&w=400&q=80',
  'artificial flowers': 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=400&q=80',
  'artificial creepers': 'https://images.unsplash.com/photo-1530745342582-0795f23ec976?auto=format&fit=crop&w=400&q=80',
  'vertical garden panels': 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=400&q=80',
  'green wall panels': 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=400&q=80'
};

export const SubcategoryCard: React.FC<SubcategoryCardProps> = ({ name, categorySlug }) => {
  const { products } = useApp();
  // Convert "UV Marble Sheets" to "uv-marble-sheets" for routing
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // Find products matching this subcategory to get count
  const subcategoryProducts = products.filter(
    (p) => p.subcategory.toLowerCase() === name.toLowerCase()
  );
  
  const productCount = subcategoryProducts.length;
  
  // Prefer the highly-accurate mapped image, fallback to product image or global default
  const mappedImage = SUBCATEGORY_IMAGES[name.toLowerCase()];
  const displayImage = mappedImage || subcategoryProducts[0]?.images[0] || 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=400&q=80';

  // Format the product count clearly
  const displayCountText = productCount > 0 ? `${productCount} Products` : '12+ Designs';

  // Robust error fallback state for images
  const [imgSrc, setImgSrc] = React.useState(displayImage);

  React.useEffect(() => {
    setImgSrc(displayImage);
  }, [displayImage]);

  const handleImageError = () => {
    const formattedTitle = name.toUpperCase();
    const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="533" viewBox="0 0 400 533"><rect width="100%" height="100%" fill="%230F172A"/><path d="M40 40h320v453H40z" fill="none" stroke="%23F97316" stroke-width="4"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="extrabold" font-size="20" fill="%23FFFFFF">${formattedTitle}</text><text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" fill="%23F97316" font-weight="bold" letter-spacing="2">WALL PANELS</text></svg>`;
    setImgSrc(fallbackSvg);
  };

  return (
    <Link
      to={`/categories/${categorySlug}/${slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl bg-white border border-brand-navy/5 shadow-xs hover:shadow-md transition-all duration-300 h-full"
    >
      {/* Subcategory Image: Portrait aspect ratio (3:4) to occupy ~65% of the card */}
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-ivory">
        <img
          src={imgSrc}
          alt={name}
          referrerPolicy="no-referrer"
          onError={handleImageError}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/30 to-transparent" />
      </div>

      {/* Content details: occupying the remaining ~35% */}
      <div className="p-3 flex flex-col flex-1 justify-between">
        <div>
          <h4 className="font-display text-xs sm:text-sm font-extrabold text-brand-navy group-hover:text-brand-orange transition-colors leading-tight line-clamp-1">
            {name}
          </h4>
          <span className="text-[10px] sm:text-xs font-bold text-brand-secondary mt-0.5 block">
            {displayCountText}
          </span>
        </div>

        <div className="mt-2 pt-1.5 border-t border-brand-navy/5 flex items-center justify-between text-[10px] sm:text-xs font-bold text-brand-orange group-hover:text-brand-navy transition-colors">
          <span className="uppercase tracking-wider">Explore</span>
          <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};
