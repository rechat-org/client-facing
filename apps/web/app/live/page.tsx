"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { ChatList, ChatProvider, MessageInput, Messages } from "@chatscale/react";
import { DebugPanel } from "@/components/live/debug-panel";
import { useRouter, useSearchParams } from "next/navigation";
import { clsx } from "clsx";

function generateRandomUsername(): string {
  const animals = [
    'lion', 'wolf', 'eagle', 'fox', 'bear', 'tiger', 'owl', 'shark', 'dolphin',
    'panther', 'wolf', 'hawk', 'leopard', 'cheetah', 'cobra', 'raven', 'jaguar',
    'gorilla', 'elephant', 'rhino', 'koala', 'lynx', 'hyena', 'gazelle', 'serpent'
  ];

  const habitats = [
    'mountain', 'forest', 'ocean', 'desert', 'jungle', 'river', 'canyon', 'plains',
    'tundra', 'savanna', 'cave', 'island', 'reef', 'prairie', 'peak', 'valley',
    'glacier', 'swamp', 'meadow', 'wilderness'
  ];

  const titles = [
    'Wild', 'Silent', 'Swift', 'Brave', 'Gentle', 'Fierce', 'Noble', 'Ancient',
    'Wise', 'Lone', 'Free', 'Bold', 'Hidden', 'Mystic', 'Shadow', 'Light',
    'Storm', 'Calm', 'Spirit', 'Guardian'
  ];

  const animal = animals[Math.floor(Math.random() * animals.length)];
  const habitat = habitats[Math.floor(Math.random() * habitats.length)];
  const title = titles[Math.floor(Math.random() * titles.length)];

  return `${title} ${animal} of ${habitat}`;
}

export default function Live() {
  const searchParams = useSearchParams();
  const channelName = searchParams.get('cn') || '';
  const [selectedChat, setSelectedChat] = useState<string | null>(channelName);
  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  const router = useRouter();

  useEffect(() => {
    // Check if user data already exists in localStorage
    let storedUserId = localStorage.getItem('chatUserId');
    let storedUserName = localStorage.getItem('chatUserName');

    // If no user data exists, generate new ones
    if (!storedUserId || !storedUserName) {
      storedUserId = uuidv4();
      storedUserName = generateRandomUsername();

      // Store in localStorage
      localStorage.setItem('chatUserId', storedUserId);
      localStorage.setItem('chatUserName', storedUserName);
    }

    // Set the user ID and name in state
    setUserId(storedUserId);
    setUserName(storedUserName);
  }, []);

  const handleChannelSelection = (channel: string) => {
    setSelectedChat(channel);
    router.replace(`?cn=${channel}`, { scroll: false });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Live Chat Demo</h1>

        <div className="p-6 rounded-lg bg-card border">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Test Configuration</h2>
            <p className="text-muted-foreground">
              This is a live demo of the ChatScale components. Connect to a test channel and try it out.
            </p>
            {userId && (
              <p className="text-sm text-muted-foreground mt-2">
                Your User ID: {userId}
              </p>
            )}
          </div>

          <ChatProvider
            userName={userName}
            userId={userId}
            channelName={channelName}
            organizationToken="test_token"
            options={{ debug: true }}
          >
            <DebugPanel/>

            <div className="grid grid-cols-12 gap-6 mt-6">
              {/* Sidebar with chat list */}
              <div className="col-span-4 border rounded-lg p-4">
                <h3 className="font-medium mb-4">Channels</h3>
                <ChatList
                  renderItem={(chat) => <div className={clsx({
                    'bg-accent': selectedChat === chat.name,
                  }, 'rounded-lg hover:bg-neutral-200 cursor-pointer p-3')}># {chat.name}</div>}
                  onChatSelect={handleChannelSelection}
                  customStyles={{
                    container: 'space-y-2',
                  }}
                />
              </div>

              {/* Main chat area */}
              <div className="col-span-8 border rounded-lg p-4">
                <div className="flex flex-col h-[600px]">
                  {/* Chat header */}
                  <div className="border-b pb-4">
                    <h3 className="font-medium">
                      {selectedChat ? `Channel: ${selectedChat}` : 'Select a channel'}
                    </h3>
                  </div>

                  {/* Messages area */}
                  <div className="flex-1 overflow-y-auto py-4">
                    {selectedChat ? (
                      <div className="space-y-4">
                        <Messages
                          containerClassName="px-6"
                          messageClassName={clsx(
                            'rounded-xl shadow-sm bg-gray-100 w-fit px-4 py-2',
                          )}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        Select a chat to start messaging
                      </div>
                    )}
                  </div>

                  {/* Message input */}
                  <div className="border-t pt-4">
                    <MessageInput
                      placeholder="Type your message..."
                      onSend={(message) => console.log('Sending:', message)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </ChatProvider>
        </div>
      </div>
    </div>
  );
}