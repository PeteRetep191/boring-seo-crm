import React from "react";
import { Button } from "@heroui/react";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="absolute t-0 l-0 flex flex-col h-full w-full items-center justify-center gap-4 py-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="text-6xl font-bold">404</div>
        <div className="text-xl">Page not found</div>
        <div className="text-default-500">
          It seems you have followed a non-existent address.
        </div>

        <div className="flex gap-2">
          <Button startContent={<Home />} onPress={() => navigate("/")}>
            Go to Home
          </Button>
          <Button variant="flat" onPress={() => navigate(-1)}>
            Go to back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
