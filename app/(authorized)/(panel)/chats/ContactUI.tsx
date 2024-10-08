import Link from "next/link";
import { Contact } from "@/types/contact";
import BlankUser from "./BlankUser";
import { UPDATE_CURRENT_CONTACT, useCurrentContactDispatch } from "./CurrentContactContext";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { formatDateTime } from "@/lib/format";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

interface ContactUIProps {
    contact: Contact;
}

export default function ContactUI({ contact }: ContactUIProps) {
    const pathname = usePathname();
    const isSelected = pathname === `/chats/${contact.wa_id}`;
    const setCurrentContact = useCurrentContactDispatch();
    const [copied, setCopied] = useState(false);
    const lastMessageTime = contact.last_message_at
        ? formatDateTime(new Date(contact.last_message_at), process.env.NEXT_PUBLIC_LOCALE)
        : "";

    const handleCopy = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            if (typeof window !== "undefined") {
                await window.navigator.clipboard.writeText("+" + contact.wa_id);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = "+" + contact.wa_id;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand("copy");
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("Failed to copy text: ", err);
            }
            document.body.removeChild(textArea);
        }
    };

    return (
        <Link
            href={`/chats/${contact.wa_id}`}
            onClick={() => {
                setCurrentContact?.({
                    type: UPDATE_CURRENT_CONTACT,
                    waId: contact.wa_id,
                });
            }}
            className="block" // Added to fix Link formatting
        >
            <div
                className={`flex items-center p-3 hover:bg-background-default-hover cursor-pointer border-b border-gray-100 last:border-b-0 ${
                    isSelected ? "bg-gray-100" : "hover:bg-background-default-hover"
                }`}>
                {/* Avatar Section */}
                <div className="flex-none w-12 h-12 relative rounded-full overflow-hidden mr-3">
                    <BlankUser className="w-full h-full" />
                </div>

                {/* Contact Info Section */}
                <div className="flex flex-1 justify-between min-w-0 relative">
                    <div className="flex flex-col">
                        <div className="font-medium text-gray-900 truncate">
                            {contact.profile_name}
                        </div>
                        <span className="flex-none text-xs text-gray-500 ml-2 absolute top-0 right-0">
                            {lastMessageTime}
                        </span>
                        <div className="flex items-center space-x-1">
                            <span className="text-sm text-gray-500">+{contact.wa_id}</span>
                            <div className="flex items-center">
                                {copied ? (
                                    <Check className="w-4 h-4 text-green-500 cursor-pointer" />
                                ) : (
                                    <Copy
                                        className="w-3 h-3 text-gray-300 hover:text-gray-500 cursor-pointer"
                                        onClick={handleCopy}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Unread Count Badge */}
                    {typeof contact.unread_count === "number" && contact.unread_count > 0 && (
                        <div className="flex-none ml-2 self-center absolute bottom-0 right-0">
                            <span className="bg-green-500 text-white px-1 py-1 rounded-full text-xs min-w-[20px] h-5 flex items-center justify-center">
                                {contact.unread_count}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
