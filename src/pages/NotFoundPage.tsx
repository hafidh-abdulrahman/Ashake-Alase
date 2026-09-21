import { EmptyState } from '@/components/ui/PageState'

export default function NotFoundPage() {
  return <EmptyState title="Page not found" text="The page you are looking for does not exist or has moved." actionLabel="Back to home" actionTo="/" />
}
