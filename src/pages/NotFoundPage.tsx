import { EmptyState } from "@/components/ui/PageState";
import { Seo } from "@/components/Seo";

export default function NotFoundPage() {
  return (
    <>
      <Seo
        title="Page Not Found | Ashake Alase"
        description="The requested Ashake Alase page could not be found."
        path="/404"
        indexable={false}
      />
      <EmptyState
        title="Page not found"
        text="The page you are looking for does not exist or has moved."
        actionLabel="Back to home"
        actionTo="/"
      />
    </>
  );
}
