"use client";

import { DBTables } from "@/lib/enums/Tables";
import { Contact } from "@/types/contact";
import { createClient } from "@/utils/supabase-browser";
import { useEffect, useState, useCallback } from "react";
import ContactUI from "./ContactUI";
import { Search } from "lucide-react";

export default function ChatContactsClient({ contacts }: { contacts: Contact[] }) {
    const [supabase] = useState(() => createClient());
    const [contactsState, setContacts] = useState<Contact[]>(contacts);

    const sortContactsByLastMessage = useCallback((contacts: Contact[]) => {
        return contacts.sort((a, b) => {
            const dateA = new Date(a.last_message_at || 0);
            const dateB = new Date(b.last_message_at || 0);
            return dateB.getTime() - dateA.getTime();
        });
    }, []);

    useEffect(() => {
        const channel = supabase
            .channel("realtime contacts")
            .on<Contact>(
                "postgres_changes",
                { event: "*", schema: "public", table: DBTables.Contacts },
                (payload) => {
                    switch (payload.eventType) {
                        case "INSERT":
                            setContacts((prev) => [payload.new, ...prev]);
                            break;
                        case "UPDATE":
                            setContacts((prev) => {
                                const updated = [...prev];
                                const index = updated.findIndex(
                                    (contact) => contact.wa_id === payload.old.wa_id,
                                );
                                if (index !== -1) {
                                    updated[index] = payload.new;
                                    return sortContactsByLastMessage(updated);
                                } else {
                                    console.warn(
                                        `Could not find contact to update contact for id: ${payload.old.wa_id}`,
                                    );
                                }

                                return prev;
                            });
                            break;
                        case "DELETE":
                            setContacts((prev) =>
                                prev.filter((contact) => contact.wa_id !== payload.old.wa_id),
                            );
                            break;
                    }
                },
            )
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, setContacts, sortContactsByLastMessage]);

    return (
        <div className="flex flex-col h-full">
            {/* Contact List */}
            <div className="flex-1 overflow-y-auto">
                {contactsState &&
                    contactsState.map((contact) => {
                        return <ContactUI key={contact.wa_id} contact={contact} />;
                    })}
                {!contactsState && <div>No contacts to show</div>}
            </div>
        </div>
    );
}
