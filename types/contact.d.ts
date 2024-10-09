export type Contact = {
    wa_id: number;
    created_at: string | null;
    last_message_at: string | null;
    last_message_received_at: string | null;
    profile_name: string | null;
    tags: string[] | null;
    is_current?: boolean;
    in_chat: boolean;
    unread_count: number | null;
};
