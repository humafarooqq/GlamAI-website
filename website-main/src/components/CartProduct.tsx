import { useAppDispatch } from "@/redux/hooks";
import { RxCross1 } from "react-icons/rx";
import { removeFromCart } from "@/redux/features/cartSlice";

interface CartProductProps {
  id: string;
  img?: string;
  mainImage?: string;
  name: string;
  price: string | number | { $numberInt: string };
  quantity: number;
}

const CartProduct: React.FC<CartProductProps> = ({
  id,
  img,
  mainImage,
  name,
  price,
  quantity,
}) => {
  const dispatch = useAppDispatch();

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
    // If img is a MongoDB ObjectId, use the GridFS endpoint
    if (typeof img === 'string' && img.length === 24) {
      return `http://localhost:5000/api/images/${img}`;
    }
    // If mainImage is a MongoDB ObjectId, use the GridFS endpoint
    if (typeof mainImage === 'string' && mainImage.length === 24) {
      return `http://localhost:5000/api/images/${mainImage}`;
    }
    // If no valid image ID is found, return empty string to trigger error handling
    return '';
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        {getImageUrl() ? (
          <img className="h-[80px]" src={getImageUrl()} alt={name} />
        ) : (
          <div className="h-[80px] w-[80px] bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-xs">No image</span>
          </div>
        )}
        <div className="space-y-2">
          <h3 className="font-medium">{name}</h3>
          <p className="text-gray-600 text-[14px]">
            {quantity} x ${formatPrice(price)}
          </p>
        </div>
      </div>

      <RxCross1
        className="cursor-pointer"
        onClick={() => dispatch(removeFromCart(id))}
      />
    </div>
  );
};

export default CartProduct;
