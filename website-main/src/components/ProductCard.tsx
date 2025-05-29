import { addToCart } from "@/redux/features/cartSlice";
import { useAppDispatch } from "@/redux/hooks";
import { IProduct } from "@/utils/api";
import Image from "next/image";
// import Link from "next/link"; // Link component is not used
import { useRouter } from "next/navigation";
import React from "react"; 
import { toast } from "react-hot-toast";
import {
  AiFillStar,
  AiOutlineStar,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { motion } from "framer-motion";

const ProductCard = ({ _id, img, mainImage, name, price, sale, rating = 0 }: IProduct) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const getRatingStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<AiFillStar key={`full-${i}`} className="text-pink-500 dark:text-pink-400" />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<AiOutlineStar key={`empty-${i}`} className="text-pink-400 dark:text-pink-500" />); 
    }
    return stars;
  };

  const getImageUrlToDisplay = () => {
    if (typeof img === 'string' && img.length === 24) {
      return `http://localhost:5000/api/images/${img}`;
    }
    if (typeof mainImage === 'string' && mainImage.length === 24) {
      return `http://localhost:5000/api/images/${mainImage}`;
    }
    return ''; 
  };

  const imageUrl = getImageUrlToDisplay();

  const formatPriceValue = (priceValue: any): string => {
    let numericPrice: number;
    if (typeof priceValue === 'object' && priceValue !== null && priceValue.$numberInt) {
      numericPrice = Number(priceValue.$numberInt) / 100;
    } else if (typeof priceValue === 'string') {
      const cleanedPrice = priceValue.replace(/[^\d.-]/g, ''); 
      numericPrice = Number(cleanedPrice);
      // If the cleaned price is likely in cents (e.g. no decimal or large number)
      if (!cleanedPrice.includes('.') || (numericPrice > 1000 && Math.floor(numericPrice) === numericPrice)){
          numericPrice = numericPrice / 100;
      }
      if (isNaN(numericPrice)) numericPrice = 0; // Fallback for totally invalid strings

    } else if (typeof priceValue === 'number') {
      // Heuristic: if price is a large number with no decimal, assume cents
      if (priceValue > 1000 && !priceValue.toString().includes('.')) { 
        numericPrice = priceValue / 100;
      } else {
        numericPrice = priceValue;
      }
    } else {
      numericPrice = 0;
    }
    return numericPrice.toFixed(2);
  };
  const formattedPrice = formatPriceValue(price);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => { // Changed HTMLDivElement to HTMLButtonElement
    e.stopPropagation(); 
    const priceForCart = parseFloat(formattedPrice);
    if (isNaN(priceForCart)) {
        console.error("Invalid price for cart:", formattedPrice);
        toast.error("Error adding product: Invalid price");
        return;
    }
    const payload = {
      id: _id,
      name,
      img: imageUrl,
      price: priceForCart,
      quantity: 1,
    };
    dispatch(addToCart(payload));
    toast.success("Added To Cart", {
      position: "bottom-center",
      style: {
        backgroundColor: '#333',
        color: '#fff',
      }
    });
  };


  return (
    <motion.div
      className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden group cursor-pointer border border-transparent hover:border-pink-300 dark:hover:border-pink-600 transition-all duration-300"
      onClick={() => router.push(`/details/${_id}`)}
      whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)" }} // Slightly increased shadow on hover
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="relative w-full aspect-square"> 
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            layout="fill"
            objectFit="cover" 
            className="transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-neutral-100 dark:bg-neutral-700 flex flex-col items-center justify-center text-neutral-500 dark:text-neutral-400">
            <AiOutlineShoppingCart className="text-5xl opacity-40" /> 
            <span className="mt-2 text-sm">No Image</span>
          </div>
        )}

        {sale && (
          <motion.div 
            initial={{scale:0.8, opacity:0, x: -10}}
            animate={{scale:1, opacity:1, x:0}}
            transition={{delay:0.2, type: "spring", stiffness:200, damping: 12}}
            className="absolute top-3 left-3 bg-pink-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
            SALE
          </motion.div>
        )}

        {/* Hover Actions Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
          <motion.div 
             initial={{ y: 20, opacity: 0}}
             animate={{ y: 0, opacity: 1}}
             exit={{y:20, opacity:0}}
             transition={{delay: 0.1, duration:0.25, ease:"easeInOut"}}
             className="flex justify-center gap-3" >
            <motion.button
              whileHover={{ scale: 1.15, rotate: -5, backgroundColor: 'rgba(255,255,255,1)'}}
              whileTap={{ scale: 0.9 }}
              className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm w-11 h-11 text-lg text-neutral-700 dark:text-neutral-200 rounded-full flex items-center justify-center shadow-lg hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
              onClick={(e) => { e.stopPropagation(); toast.success("Added to Wishlist!", {icon: '💖'}); }} 
              aria-label="Add to wishlist"
            >
              <AiOutlineHeart />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.15, rotate: 5, backgroundColor: 'rgba(255,255,255,1)' }}
              whileTap={{ scale: 0.9 }}
              className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm w-11 h-11 text-lg text-neutral-700 dark:text-neutral-200 rounded-full flex items-center justify-center shadow-lg hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
              onClick={handleAddToCart} 
              aria-label="Add to cart"
            >
              <AiOutlineShoppingCart />
            </motion.button>
          </motion.div>
        </div>
      </div>

      <div className="p-4 md:p-5">
        <div className="flex items-center mb-1.5">
          {getRatingStars()} 
          {rating > 0 && <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400">({rating.toFixed(1)} / 5)</span>}
        </div>
        <h3 className="font-semibold text-base md:text-lg text-neutral-800 dark:text-neutral-100 truncate group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-200 mb-1 h-6 md:h-7" title={name}>
          {name}
        </h3>
        <p className="text-pink-600 dark:text-pink-400 font-bold text-lg md:text-xl">
          ${formattedPrice}
        </p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
