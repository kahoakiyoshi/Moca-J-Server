export const renderShape = (shapeType: string) => {
  switch (shapeType) {
    case "circle":
      return (
        <svg width="100px" height="100px" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="black" strokeWidth="4" fill="none" />
        </svg>
      );
    case "square":
      return (
        <svg width="100px" height="100px" viewBox="0 0 100 100">
          <rect x="5" y="5" width="90" height="90" stroke="black" strokeWidth="4" fill="none" />
        </svg>
      );
    case "diamond":
      return (
        <svg width="100px" height="100px" viewBox="0 0 100 100">
          <path d="M 50 5 L 95 50 L 50 95 L 5 50 Z" stroke="black" strokeWidth="4" fill="none" />
        </svg>
      );
    case "semicircle":
      return <img src="/images/img-7.png" className="h-auto w-[100px]" alt="semicircle" />;
    default:
      return "";
  }
};
