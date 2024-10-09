"use client";

import ChatContactsClient from "./ChatContactsClient";
import { useContacts } from "./CurrentContactContext";

export const revalidate = 0;

export default function ChatContacts() {
    const contactState = useContacts();

    if (!contactState) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-gray-500">Unable to fetch contacts</div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-white border-r border-gray-200">
            <ChatContactsClient contacts={contactState.contacts} />
        </div>
    );
}
