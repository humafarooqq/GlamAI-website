"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import VirtualMakeupModal from "@/components/VirtualMakeupModal";
import { api, IProduct } from "@/utils/api";
import {
  AiFillStar,
  AiOutlineStar,
  AiOutlineShoppingCart,
  AiOutlineHeart,
} from "react-icons/ai";
import { MdCompareArrows } from "react-icons/md";
import { FaFacebookSquare, FaTwitter, FaInstagram } from "react-icons/fa";
import Link from "next/link";
import { useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/features/cartSlice";
import { toast } from "react-hot-toast";
import { API_CONFIG } from "@/config";

interface CartItem {
  id: string;
  name: string;
  img: string;
  price: string | number | { $numberInt: string };
  quantity: number;
}

const DetailPage = () => {
  const [productData, setProductData] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params?.id) {
        setError('Product ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await api.getProduct(params.id as string);
        setProductData(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch product details');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

      fetchProduct();
  }, [params?.id]);

  const formatPrice = (price: any) => {
    if (typeof price === 'object' && price.$numberInt) {
      return (Number(price.$numberInt) / 100).toFixed(2);
    }
    if (typeof price === 'string') {
      return (Number(price) / 100).toFixed(2);
    }
    if (typeof price === 'number') {
      return price.toFixed(2);
    }
    return '0.00';
  };

  const getImageUrl = () => {
    if (!productData) return '';
    
    // If img is a MongoDB ObjectId, use the GridFS endpoint
    if (typeof productData.img === 'string' && productData.img.length === 24) {
      return `https://makeupmongo.duckdns.org/api/images/${productData.img}`;
    }
    // If mainImage is a MongoDB ObjectId, use the GridFS endpoint
    if (typeof productData.mainImage === 'string' && productData.mainImage.length === 24) {
      return `https://makeupmongo.duckdns.org/api/images/${productData.mainImage}`;
    }
    // If no valid image ID is found, return empty string to trigger error handling
    return '';
  };

  const addProductToCart = () => {
    if (!productData) return;
    const cartItem: CartItem = {
      id: productData._id,
      name: productData.name,
      img: getImageUrl(),
      price: productData.price,
      quantity: 1
    };
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  // Map shades to the format expected by VirtualMakeupModal
  const mappedShades = productData?.shades?.map((shade) => {
    let refId = '';
    if (typeof shade.referenceImage === 'string') {
      refId = shade.referenceImage;
    } else if (shade.referenceImage && typeof shade.referenceImage === 'object' && shade.referenceImage.$oid) {
      refId = shade.referenceImage.$oid;
    }
    return {
      name: shade.name,
      src: refId.length === 24 ? `${API_CONFIG.API_URL}/images/${refId}` : '',
    };
  }) || [];

  if (loading) {
    return (
      <div className="container pt-32 text-center">
        <h2 className="text-2xl">Loading product details...</h2>
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="container pt-32 text-center">
        <h2 className="text-2xl text-red-500">{error || 'Product not found'}</h2>
      </div>
    );
  }

  return (
    <div className="pt-8">
      <div className="bg-gray-100 py-4">
        <div className="container flex gap-4 items-center text-gray-500">
          <Link href="/" className="cursor-pointer hover:text-accent">
            Home
          </Link>
          <div className="w-[30px] h-[2px] bg-gray-400" />
          <p className="capitalize">{productData.category}</p>
          <div className="w-[30px] h-[2px] bg-gray-400" />
          <p>{productData.name}</p>
        </div>
      </div>

      <div className="container pt-8">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            {getImageUrl() ? (
            <Image
              className="w-full h-auto"
                src={getImageUrl()}
              width={1000}
              height={1200}
                alt={productData.name}
            />
            ) : (
              <div className="w-full h-[500px] bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center text-accent">
              {Array.from({ length: 5 }).map((_, index) => (
                index < Math.floor(productData.rating || 0) ? 
                  <AiFillStar key={index} /> : 
                  <AiOutlineStar key={index} />
              ))}
              <p className="text-gray-400 text-[14px] ml-2 hover:text-accent cursor-pointer">
                ({productData.rating || 0} customer review)
              </p>
            </div>

            <div className="text-[#161616] space-y-6">
              <h2 className="text-3xl font-semibold">{productData.name}</h2>
              <p className="text-xl">${formatPrice(productData.price)}</p>
            </div>
            <p className="text-gray-500 text-[14px]">
              {productData.description || 'No description available'}
            </p>
            <p className="text-gray-500 text-[14px]">
              {productData.shades?.reduce((total, shade) => total + (typeof shade.stock === 'object' ? Number(shade.stock.$numberInt) : shade.stock), 0) || 0} in stock
            </p>

            <button
              className="uppercase bg-accent py-4 px-8 rounded-lg text-white flex gap-2 items-center hover:bg-black"
              onClick={addProductToCart}
            >
              <AiOutlineShoppingCart className="text-[24px]" />
              Add to cart
            </button>

            <button
              className="uppercase bg-accent py-4 px-8 rounded-lg text-white flex gap-2 items-center hover:bg-black"
              onClick={() => setIsModalOpen(true)}
            >
              Try Virtual Makeup
            </button>

            {isModalOpen && (
              <VirtualMakeupModal
                closeModal={() => setIsModalOpen(false)}
                shades={mappedShades}
                category={productData.category}
              />
            )}

            <div className="flex gap-4 items-center uppercase py-4 text-[14px]">
              <div className="flex gap-1 items-center">
                <AiOutlineHeart />
                Add to Wish List
              </div>
              <div className="flex gap-1 items-center">
                <MdCompareArrows />
                Compare
              </div>
            </div>

            <div className="w-[30px] h-[2px] bg-gray-400" />
            <div>Name: {productData.name}</div>
            <div className="capitalize">
              Category: {productData.category}
            </div>
            <div className="flex gap-1 items-center capitalize">
              Brand: {productData.brand}
            </div>
            <div className="w-[30px] h-[2px] bg-gray-400" />

            {productData.shades && productData.shades.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Available Shades:</h3>
                <div className="flex flex-wrap gap-2">
                  {productData.shades.map((shade) => (
                    <div key={shade._id} className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: shade.colorCode }}
                      />
                      <span>{shade.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-1 items-center pt-4">
              SHARE:{" "}
              <div className="flex gap-2 items-center text-[18px]">
                <FaFacebookSquare /> <FaTwitter /> <FaInstagram />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
