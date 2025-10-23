// External UI
import { Spinner } from "@heroui/react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <Spinner size="lg" label="Loading..." />
    </div>
  );
};

export default Loader;
