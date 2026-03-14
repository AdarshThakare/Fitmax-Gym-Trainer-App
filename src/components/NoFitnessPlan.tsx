import Link from "next/link";
import CornerElements from "./CornerElements";
import { Button } from "./ui/button";
import { ArrowRightIcon } from "lucide-react";

const NoFitnessPlan = () => {
  return (
    <div className="relative backdrop-blur-sm border border-border rounded-none p-8 text-center flex flex-col items-center">
      <CornerElements />

      <h2 className="text-2xl font-bold mb-4 font-mono">
        <span className="text-primary">No</span> fitness plans yet
      </h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm md:text-base">
        Start by creating a personalized fitness and diet plan tailored to your specific goals and
        needs
      </p>
      <Button
        size="sm"
        asChild
        className="relative overflow-hidden bg-primary text-primary-foreground px-5 py-2 text-sm md:px-8 md:py-6 md:text-lg font-medium rounded-none md:size-lg w-fit mx-auto"
      >
        <Link href="/generate-program">
          <span className="relative flex items-center">
            Create Your First Plan
            <ArrowRightIcon className="ml-2 h-4 w-4 md:h-5 md:w-5" />
          </span>
        </Link>
      </Button>
    </div>
  );
};
export default NoFitnessPlan;
