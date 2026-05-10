/\*\*

- Example: How to send chat messages via postChatBody()
-
- Inject ChatSectionComponent and call postChatBody with various payloads
  \*/

// Example 1: Send text-only message
component.postChatBody({
content: 1, // Content ID
character: 5, // Character ID
order: 1,
side: 'left',
message_type: 'text',
text: 'Hello, this is a text message!',
});

// Example 2: Send image-only message
component.postChatBody({
content: 1,
character: 5,
order: 2,
side: 'right',
message_type: 'image',
file: 'data:image/png;base64,...', // Base64 encoded image
file_name: 'screenshot.png',
});

// Example 3: Send file-only message (PDF, doc, etc.)
component.postChatBody({
content: 1,
character: 5,
order: 3,
side: 'left',
message_type: 'file',
file: 'data:application/pdf;base64,...', // Base64 encoded file
file_name: 'document.pdf',
});

// Example 4: Send text + image
component.postChatBody({
content: 1,
character: 5,
order: 4,
side: 'right',
message_type: 'text+image',
text: 'Check out this screenshot!',
file: 'data:image/png;base64,...',
file_name: 'image.png',
});

// Example 5: Send text + file
component.postChatBody({
content: 1,
character: 5,
order: 5,
side: 'left',
message_type: 'text+file',
text: 'Here is the report:',
file: 'data:application/pdf;base64,...',
file_name: 'report.pdf',
});

// Example 6: Minimal payload (all defaults)
component.postChatBody({
text: 'Just text',
message_type: 'text',
});

// The API call will POST to: http://localhost:8000/api/chatbodies/
// With payload matching the ChatMessage interface
