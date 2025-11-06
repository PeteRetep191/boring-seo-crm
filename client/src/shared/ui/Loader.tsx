// External UI
import { Spinner } from "@heroui/react";

const Loader = () => {
  return (
    <div className="fixed t-0 l-0 flex flex-col items-center justify-center h-full w-full space-y-4">
      <Spinner size="lg" label="Loading..." />
    </div>
  );
};

export default Loader;
