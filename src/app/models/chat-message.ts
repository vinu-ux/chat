export type ChatSide = 'left' | 'right';

export type ChatMessageType =
    | 'text'
    | 'image'
    | 'file'
    | 'text+image'
    | 'text+file';

// Matches the payload shape you described.
// `file` is stored as a string (data URL) so it can be sent as JSON.
export interface ChatMessage {
    id?: any;
    content: number | string | null;
    character: number | null;
    character_name: string | null;
    order: number | null;
    side: ChatSide | null;
    pinned: boolean;
    is_deleted: boolean;
    message_type: ChatMessageType | null;
    updated_at?: string;
    text: string;
    file: string | null;
    file_name: string;
    is_edited: boolean;
}
