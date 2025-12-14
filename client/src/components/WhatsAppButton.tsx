import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const whatsappNumber = "254742101089"; // Nuta WhatsApp number
  const whatsappMessage = encodeURIComponent(
    "Hi Nuta! I'm interested in your peanut products. Can you help me?"
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
