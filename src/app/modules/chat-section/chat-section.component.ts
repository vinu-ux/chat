import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '../services/content.service';
import { Character } from 'src/app/models/charactes';
import { UserService } from '../services/user.service';
import { ChatMessage } from 'src/app/models/chat-message';

@Component({
  selector: 'app-chat-section',
  templateUrl: './chat-section.component.html',
  styleUrls: ['./chat-section.component.scss']
})
export class ChatSectionComponent implements OnInit {
  contentId!: string;
  users: Array<Character & { side: 'left' | 'right' }> = [];
  private usersByIndex: Array<(Character & { side: 'left' | 'right' }) | null> = [];
  currentContent: any;
  selectedUser!: Character;
  chatMessages: ChatMessage[] = [];

  // Form controls for chat input
  messageText: string = '';
  selectedFile: File | null = null;
  filePreviewUrl: string | null = null;

  // Edit modal state
  showEditModal: boolean = false;
  editingMessage: ChatMessage | null = null;
  editText: string = '';
  editFile: File | null = null;
  editFilePreviewUrl: string | null = null;
  hoveredMessageId: any = null;

  constructor(
    private router: Router,
    private activeRouter: ActivatedRoute,
    private contentServ: ContentService,
    private userServ: UserService
  ) { }

  ngOnInit(): void {
    this.activeRouter.params.subscribe(params => {
      const contentId = params['id'];
      this.contentId = contentId;
      console.log('Content ID:', contentId);
      this.getContent();
      this.getContentById();
      // You can use the contentId to fetch content data or perform other actions
    });
  }

  getContentById() {
    this.contentServ.chatBYContentId(this.contentId).subscribe({
      next: (res: any) => {
        console.log('Chat body data:', res);
        this.chatMessages = res;
      },
      error: (err) => {
        console.error('Failed to fetch chat body data', err);
      }
    });
  }

  getContent() {
    this.contentServ.contentById(this.contentId).subscribe({
      next: (res) => {
        console.log('Content data:', res);
        this.currentContent = res;
        this.usersByIndex = new Array(this.currentContent.characters.length).fill(null);
        this.users = [];
        this.currentContent.characters.forEach((charId: number, index: number) => {
          this.getUsers(charId, index);
        });
      },
      error: (err) => {
        console.error('Failed to fetch content data', err);
      }
    });
  }

  getUsers(userId: number, index: number) {
    this.userServ.getUserById(userId).subscribe({
      next: (res: any) => {
        const side: 'left' | 'right' = index % 2 === 0 ? 'left' : 'right';
        this.usersByIndex[index] = { ...res, side };
        this.users = this.usersByIndex.filter(
          (u): u is Character & { side: 'left' | 'right' } => u !== null
        );
        this.selectedUser = this.users[0];
        console.log('Users:', this.users);
      },
      error: (err) => {
        console.error('Failed to fetch user data', err);
      }
    });
  }

  /**
   * POST a chat message to the API at /api/chatbodies/
   * Builds a ChatMessage payload and sends it via ContentService
   */
  postChatBody(message: Partial<ChatMessage> = {}): void {
    const payload: ChatMessage = {
      content: message.content ?? null,
      character: message.character ?? null,
      character_name: this.selectedUser?.name ?? null,
      order: message.order ?? 0,
      side: message.side ?? null,
      pinned: message.pinned ?? false,
      is_deleted: message.is_deleted ?? false,
      message_type: message.message_type ?? null,
      text: message.text ?? '',
      file: message.file ?? null,
      file_name: message.file_name ?? '',
      is_edited: message.is_edited ?? false,
    };

    console.log('Posting chat body:', payload);
    this.contentServ.createChatBody(payload).subscribe({
      next: (res) => {
        console.log('Chat message posted successfully:', res);
        this.getContentById();

      },
      error: (err) => {
        console.error('Failed to post chat message:', err);
      }
    });
  }

  /**
   * Handle file selection from the file input
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;

      // If it's an image, show preview
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.filePreviewUrl = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        this.filePreviewUrl = null;
      }
    }
  }

  /**
   * Determine message type based on content
   */
  determineMessageType(): ChatMessage['message_type'] {
    const hasText = this.messageText.trim().length > 0;
    const hasFile = this.selectedFile !== null;

    if (hasText && hasFile) {
      return this.selectedFile!.type.startsWith('image/') ? 'text+image' : 'text+file';
    } else if (hasFile) {
      return this.selectedFile!.type.startsWith('image/') ? 'image' : 'file';
    } else if (hasText) {
      return 'text';
    }
    return null;
  }

  /**
   * Send chat message with text and/or file to API
   */
  sendMessage(): void {
    const hasText = this.messageText.trim().length > 0;
    const hasFile = this.selectedFile !== null;

    if (!hasText && !hasFile) {
      console.warn('Message is empty');
      return;
    }

    const messageType = this.determineMessageType();

    if (hasFile) {
      // Use FormData for file uploads
      const formData = new FormData();
      formData.append('content', this.currentContent?.id ?? '');
      formData.append('character', this.selectedUser?.id ?? '');
      formData.append('side', this.selectedUser?.side ?? 'left');
      formData.append('message_type', messageType ?? 'file');
      formData.append('text', this.messageText.trim());
      formData.append('file', this.selectedFile!);
      formData.append('file_name', this.selectedFile!.name);
      formData.append('pinned', 'false');
      formData.append('is_deleted', 'false');
      formData.append('is_edited', 'false');
      formData.append('order', '0');

      console.log('Posting chat body with file via FormData');
      this.contentServ.createChatBodyWithFile(formData).subscribe({
        next: (res) => {
          console.log('Chat message with file posted successfully:', res);
          this.clearMessage();
          this.getContentById();
        },
        error: (err) => {
          console.error('Failed to post chat message with file:', err);
        }
      });
    } else {
      // Use JSON for text-only messages
      this.postChatBody({
        content: this.currentContent?.id ?? null,
        character: this.selectedUser?.id ?? null,
        side: this.selectedUser?.side ?? null,
        message_type: messageType,
        text: this.messageText.trim(),
        file: null,
        file_name: '',
      });
      this.clearMessage();
    }
  }

  /**
   * Clear the message form
   */
  clearMessage(): void {
    this.messageText = '';
    this.selectedFile = null;
    this.filePreviewUrl = null;
  }

  /**
   * Open edit modal with the selected message
   */
  openEditModal(message: ChatMessage): void {
    this.editingMessage = message;
    this.editText = message.text || '';
    this.editFile = null;
    this.editFilePreviewUrl = null;
    this.showEditModal = true;
  }

  /**
   * Close edit modal
   */
  closeEditModal(): void {
    this.showEditModal = false;
    this.editingMessage = null;
    this.editText = '';
    this.editFile = null;
    this.editFilePreviewUrl = null;
  }

  /**
   * Handle file selection in edit modal
   */
  onEditFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.editFile = file;

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.editFilePreviewUrl = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        this.editFilePreviewUrl = null;
      }
    }
  }

  /**
   * Save edited message
   */
  saveEditedMessage(): void {
    if (!this.editingMessage) return;

    const trimmedText = this.editText.trim();
    const existingFile = this.editingMessage.file ?? null;
    const existingFileName = this.editingMessage.file_name ?? '';
    const existingMessageType = this.editingMessage.message_type ?? 'text';

    if (this.editFile) {
      // Update with file via FormData
      const formData = new FormData();
      formData.append('id', String(this.editingMessage.id || ''));
      formData.append('content', String(this.editingMessage.content ?? ''));
      formData.append('character', String(this.editingMessage.character ?? ''));
      formData.append('order', String(this.editingMessage.order ?? '0'));
      formData.append('side', String(this.editingMessage.side ?? 'left'));
      formData.append('pinned', String(this.editingMessage.pinned ?? false));
      formData.append('is_deleted', String(this.editingMessage.is_deleted ?? false));
      formData.append('text', trimmedText);
      formData.append('file', this.editFile);
      formData.append('file_name', this.editFile.name);
      formData.append('message_type', trimmedText ? (this.editFile.type.startsWith('image/') ? 'text+image' : 'text+file') : (this.editFile.type.startsWith('image/') ? 'image' : 'file'));
      formData.append('is_edited', 'true');

      this.contentServ.updateChatBody(this.editingMessage.id, formData).subscribe({
        next: (res) => {
          console.log('Message updated successfully:', res);
          this.closeEditModal();
          this.getContentById();
        },
        error: (err) => {
          console.error('Failed to update message:', err);
        }
      });
    } else {
      // Update text only, but keep existing attachment fields if present
      const payload: Partial<ChatMessage> = {
        content: this.editingMessage.content ?? null,
        character: this.editingMessage.character ?? null,
        character_name: this.editingMessage.character_name ?? null,
        order: this.editingMessage.order ?? null,
        side: this.editingMessage.side ?? null,
        pinned: this.editingMessage.pinned ?? false,
        is_deleted: this.editingMessage.is_deleted ?? false,
        text: trimmedText,
        file: existingFile,
        file_name: existingFileName,
        message_type: existingFile ? existingMessageType : 'text',
        is_edited: true,
      };

      this.contentServ.updateChatBodyJson(this.editingMessage.id, payload).subscribe({
        next: (res) => {
          console.log('Message updated successfully:', res);
          this.closeEditModal();
          this.getContentById();
        },
        error: (err) => {
          console.error('Failed to update message:', err);
        }
      });
    }
  }

  getChatBodyUserImage(userId: any) {
    return this.users.find(u => u.id === userId)?.picture;
  }

  /**
   * Delete a message
   */
  deleteMessage(message: ChatMessage): void {
    if (!confirm('Delete this message?')) return;

    const payload: Partial<ChatMessage> = {
      is_deleted: true,
    };

    this.contentServ.updateChatBodyJson(message.id, payload).subscribe({
      next: (res) => {
        console.log('Message deleted successfully:', res);
        this.getContentById();
      },
      error: (err) => {
        console.error('Failed to delete message:', err);
      }
    });
  }

  /**
   * Pin/unpin a message
   */
  togglePinMessage(message: ChatMessage): void {
    const payload: Partial<ChatMessage> = {
      pinned: !message.pinned,
    };

    this.contentServ.updateChatBodyJson(message.id, payload).subscribe({
      next: (res) => {
        console.log('Message pin toggled:', res);
        this.getContentById();
      },
      error: (err) => {
        console.error('Failed to toggle pin:', err);
      }
    });
  }

}
