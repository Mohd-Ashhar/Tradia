export const LoadingState = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="relative">
        {/* Animated Logo */}
        <div className="mb-8 animate-pulse-slow">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-r from-primary to-accent shadow-xl">
            <span className="font-heading text-4xl font-bold text-white">T</span>
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="flex justify-center">
          <div className="relative h-12 w-12">
            <div className="absolute h-12 w-12 animate-spin rounded-full border-4 border-muted"></div>
            <div className="absolute h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-primary"></div>
          </div>
        </div>

        {/* Loading Text */}
        <p className="mt-6 animate-pulse text-center text-sm font-medium text-muted-foreground">
          Loading luxury...
        </p>

        {/* Shimmer Effect */}
        <div className="mt-8 space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-2 w-48 overflow-hidden rounded-full bg-muted"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <div
                className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-primary/20 to-transparent"
                style={{
                  backgroundSize: '1000px 100%',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] rounded-3xl bg-muted mb-4" />
      <div className="space-y-2">
        <div className="h-4 w-20 rounded bg-muted" />
        <div className="h-5 w-full rounded bg-muted" />
        <div className="h-6 w-24 rounded bg-muted" />
      </div>
    </div>
  );
};
