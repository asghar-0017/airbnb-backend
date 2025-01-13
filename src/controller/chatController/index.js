import { database } from '../../firebase.js';

export const chatController = {
  // Create a new chat message
  // createChat: async (req, res) => {
  //   const { hostId, guestId } = req.params;
  //   const { message, senderRole } = req.body; // senderRole can be 'host' or 'guest'
  
  //   if (!hostId || !guestId || !message || !senderRole) {
  //     return res.status(400).json({ error: "All fields are required." });
  //   }
  
  //   // Determine the senderId dynamically
  //   const senderId = hostId ;
  
  //   const conversationId = `${hostId}_${guestId}`;
  
  //   try {
  //     // Reference to the conversation in Firebase
  //     const chatRef = database.ref(`conversations/${conversationId}`).push();
  //     await chatRef.set({
  //       senderId,
  //       senderRole,
  //       message,
  //       timestamp: Date.now(),
  //     });
  
  //     return res.status(200).json({ message: "Message sent!" });
  //   } catch (err) {
  //     console.error('Error creating chat:', err.message);
  //     res.status(500).json({ error: "Failed to send message." });
  //   }
  // },
  





  createChat: async (req, res) => {
    const { hostId, guestId } = req.params;
    const { senderId, message, senderRole } = req.body;

    if (!hostId || !guestId || !senderId || !message || !senderRole) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const conversationId = `${hostId}_${guestId}`;

    try {
      // Reference to the conversation in Firebase
      const chatRef = database.ref(`conversations/${conversationId}`).push();
      await chatRef.set({
        senderId,
        senderRole,
        message,
        timestamp: Date.now(),
      });

      return res.status(200).json({ message: "Message sent!" });
    } catch (err) {
      console.error('Error creating chat:', err.message);
      res.status(500).json({ error: "Failed to send message." });
    }
  },






  // Get all chat messages between host and guest (Fetch all previous messages)
  getChat: async (req, res) => {
    const { hostId, guestId } = req.params;

    if (!hostId || !guestId) {
      return res.status(400).json({ error: "Both hostId and guestId are required." });
    }

    const conversationId1 = `${hostId}_${guestId}`; // Host to Guest
    const conversationId2 = `${guestId}_${hostId}`; // Guest to Host

    try {
      // Reference to both conversations in Firebase
      const chatRef1 = database.ref(`conversations/${conversationId1}`);
      const chatRef2 = database.ref(`conversations/${conversationId2}`);

      // Fetching both conversations
      const snapshot1 = await chatRef1.once("value");
      const snapshot2 = await chatRef2.once("value");

      const messages1 = snapshot1.val() || {};
      const messages2 = snapshot2.val() || {};

      // Combine both messages
      const allMessages = [
        ...Object.values(messages1), // Host-to-Guest messages
        ...Object.values(messages2), // Guest-to-Host messages
      ];

      // Sort messages by timestamp
      const sortedMessages = allMessages.sort((a, b) => a.timestamp - b.timestamp);

      // Return the combined and sorted messages
      res.status(200).json(sortedMessages);

    } catch (err) {
      console.error('Error retrieving chat:', err.message);
      res.status(500).json({ error: "Failed to retrieve messages." });
    }
  },

  // Real-time chat with SSE
  realTimeChat: (req, res) => {
    const { hostId, guestId } = req.params;

    if (!hostId || !guestId) {
      return res.status(400).json({ error: "Both hostId and guestId are required." });
    }

    const conversationId = `${hostId}_${guestId}`;

    // Set up SSE headers for real-time updates
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      // Reference to the conversation in Firebase
      const chatRef = database.ref(`conversations/${conversationId}`);

      // Listening for new messages in real-time
      chatRef.on("child_added", (snapshot) => {
        const message = snapshot.val();
        // Send the new message as SSE
        res.write(`data: ${JSON.stringify(message)}\n\n`);
      });

      // Keep connection open
      req.on('close', () => {
        chatRef.off("child_added");
        res.end();
      });

    } catch (err) {
      console.error('Error in real-time chat:', err.message);
      res.status(500).json({ error: "Real-time chat failed." });
    }
  },

  getAllSendersByReceiver: async (req, res) => {
    const { receiverId } = req.params; // The receiver's ID (host or guest)
  console.log(receiverId);
  
    if (!receiverId) {
      return res.status(400).json({ error: "receiverId is required." });
    }
  
    try {
      // Fetch all conversations from Firebase
      const conversationRef = database.ref('conversations');
      const snapshot = await conversationRef.once('value');
  
      const senderIds = new Set(); // To store unique sender IDs
  
      snapshot.forEach((conversation) => {
        const conversationData = conversation.val();
        const conversationKey = conversation.key; // The conversation key like hostId_guestId
  
        console.log('Conversation Key:', conversationKey); // Log the conversation key
        console.log('Conversation Data:', conversationData); // Log the conversation data
  
        // Split the conversation key into senderId and receiverId parts
        const [id1, id2] = conversationKey.split('_');
  
        // Check if the receiverId is part of the conversation (in either direction)
        if (id1 === receiverId || id2 === receiverId) {
          console.log(`Receiver found in conversation ${conversationKey}`); // Log if receiverId matches
          Object.values(conversationData).forEach((message) => {
            console.log('Message:', message); // Log each message
            const senderId = message.senderId;
  
            // Exclude the receiver from the senders list (they shouldn't appear as a sender)
            if (senderId !== receiverId) {
              senderIds.add(senderId); // Add to the set (unique senderIds)
            }
          });
        }
      });
  
      // Convert the Set to an array and return the result
      return res.status(200).json(Array.from(senderIds));
  
    } catch (err) {
      console.error('Error retrieving senders:', err.message);
      res.status(500).json({ error: "Failed to retrieve senders." });
    }
  }
  
};
