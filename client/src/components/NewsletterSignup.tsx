import { useState } from "react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const subscribeMutation = trpc.newsletter.subscribe.useMutation();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      await subscribeMutation.mutateAsync({
        email,
        name: name || undefined,
      });
      setIsSubmitted(true);
      setEmail("");
      setName("");
      toast.success("Successfully subscribed to our newsletter!");

      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (error: any) {
      if (error.message.includes("already subscribed")) {
        toast.error("This email is already subscribed to our newsletter");
      } else {
        toast.error("Failed to subscribe. Please try again.");
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-lg p-6 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-800 mb-2">Welcome to Nuta!</h3>
        <p className="text-gray-600">
          Check your email for exclusive offers and updates about our products.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-6 border border-orange-200">
      <div className="flex items-center gap-3 mb-4">
        <Mail className="w-6 h-6 text-orange-600" />
        <h3 className="text-xl font-bold text-gray-800">Subscribe to Our Newsletter</h3>
      </div>

      <p className="text-gray-600 mb-4">
        Get exclusive recipes, tips, and special offers delivered to your inbox. 100% natural, no spam.
      </p>

      <form onSubmit={handleSubscribe} className="space-y-3">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <div className="flex gap-2">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <Button
            type="submit"
            disabled={subscribeMutation.isPending}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 rounded-lg"
          >
            {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
          </Button>
        </div>

        <p className="text-xs text-gray-500">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </form>
    </div>
  );
}
