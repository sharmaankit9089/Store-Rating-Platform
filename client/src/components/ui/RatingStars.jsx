import { useState } from "react";
import { Star } from "lucide-react";

const RatingStars = ({ rating, onRate, readonly = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={`focus:outline-none ${readonly ? "cursor-default" : "cursor-pointer"}`}
          onClick={() => onRate && onRate(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        >
          <Star
            className={`h-6 w-6 transition-colors ${
              star <= (hover || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-slate-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default RatingStars;
