import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-4 text-lg">Page not found</p>
      <p className="mt-2 text-muted-foreground">
        The route you are looking for does not exist.
      </p>
      <Button className="mt-6" variant="outline">
        <Link to="/">Go Back</Link>
      </Button>
    </div>
  );
}
