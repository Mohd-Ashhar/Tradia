import { Star, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  helpful: number;
  verified: boolean;
}

const reviews: Review[] = [
  {
    id: "1",
    author: "Sarah Mitchell",
    rating: 5,
    date: "January 15, 2024",
    title: "Absolutely stunning quality",
    content:
      "This bag exceeded all my expectations. The craftsmanship is impeccable, and the leather feels so luxurious. The emerald color is even more beautiful in person. Worth every penny!",
    helpful: 24,
    verified: true,
  },
  {
    id: "2",
    author: "Emma Rodriguez",
    rating: 5,
    date: "January 8, 2024",
    title: "Perfect everyday luxury",
    content:
      "I use this bag daily and it still looks brand new after months of use. The size is perfect for work and the compartments are very practical. Highly recommend!",
    helpful: 18,
    verified: true,
  },
  {
    id: "3",
    author: "Jessica Chen",
    rating: 4,
    date: "December 28, 2023",
    title: "Beautiful but slightly heavy",
    content:
      "Gorgeous bag with excellent quality. My only note is that it's a bit heavier than expected when fully packed, but the style makes up for it.",
    helpful: 12,
    verified: true,
  },
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            "h-4 w-4",
            index < rating ? "fill-accent text-accent" : "fill-muted text-muted"
          )}
        />
      ))}
    </div>
  );
};

export const ProductReviews = () => {
  const averageRating = 4.8;
  const totalReviews = 127;

  return (
    <section className="space-y-8">
      {/* Reviews Header */}
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <h2 className="mb-2 text-3xl font-bold">Customer Reviews</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold text-gradient">
                {averageRating}
              </span>
              <div>
                <StarRating rating={Math.floor(averageRating)} />
                <p className="mt-1 text-sm text-muted-foreground">
                  Based on {totalReviews} reviews
                </p>
              </div>
            </div>
          </div>
        </div>
        <button className="rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-white transition-all hover:scale-105 hover:shadow-[var(--shadow-premium)]">
          Write a Review
        </button>
      </div>

      {/* Review List */}
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div
            key={review.id}
            className="glass-morphism rounded-2xl p-6 transition-all hover:shadow-lg animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                    {review.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{review.author}</h3>
                    {review.verified && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <StarRating rating={review.rating} />
                    <span className="text-sm text-muted-foreground">
                      {review.date}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h4 className="mb-2 text-lg font-semibold">{review.title}</h4>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              {review.content}
            </p>

            <div className="flex items-center gap-4 border-t border-border/50 pt-4">
              <button className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <ThumbsUp className="h-4 w-4" />
                Helpful ({review.helpful})
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
