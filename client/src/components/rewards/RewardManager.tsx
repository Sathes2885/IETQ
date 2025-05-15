import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import RewardPopup, { RewardPopupProps } from '@/components/ui/reward-popup';

// Context for reward system
interface RewardContextType {
  showReward: (reward: Omit<RewardPopupProps, 'isOpen' | 'onClose'>) => void;
  currentReward: (RewardPopupProps & { id: string }) | null;
  dismissReward: () => void;
}

const defaultContext: RewardContextType = {
  showReward: () => {},
  currentReward: null,
  dismissReward: () => {},
};

const RewardContext = createContext<RewardContextType>(defaultContext);

// Hook to access reward context
export const useRewards = () => useContext(RewardContext);

// Queue to manage multiple rewards
interface RewardQueue {
  [key: string]: Omit<RewardPopupProps, 'isOpen' | 'onClose'>;
}

// Reward Provider Component
export const RewardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rewardQueue, setRewardQueue] = useState<RewardQueue>({});
  const [currentRewardId, setCurrentRewardId] = useState<string | null>(null);
  
  // Get the current reward from queue if exists
  const currentReward = currentRewardId 
    ? { ...rewardQueue[currentRewardId], id: currentRewardId, isOpen: true, onClose: dismissReward } 
    : null;
  
  // Show a reward popup
  const showReward = (reward: Omit<RewardPopupProps, 'isOpen' | 'onClose'>) => {
    const id = uuidv4();
    setRewardQueue(prev => ({
      ...prev,
      [id]: reward
    }));
  };
  
  // Dismiss the current reward
  function dismissReward() {
    if (currentRewardId) {
      // Remove current reward from queue
      setRewardQueue(prev => {
        const newQueue = { ...prev };
        delete newQueue[currentRewardId];
        return newQueue;
      });
      setCurrentRewardId(null);
    }
  }
  
  // Process queue when it changes
  useEffect(() => {
    // If there's no current reward showing and queue is not empty
    if (!currentRewardId && Object.keys(rewardQueue).length > 0) {
      // Get first reward from queue
      const nextRewardId = Object.keys(rewardQueue)[0];
      setCurrentRewardId(nextRewardId);
    }
  }, [rewardQueue, currentRewardId]);
  
  return (
    <RewardContext.Provider value={{ showReward, currentReward, dismissReward }}>
      {children}
      {currentReward && (
        <RewardPopup
          isOpen={true}
          onClose={dismissReward}
          title={currentReward.title}
          description={currentReward.description}
          image={currentReward.image}
          points={currentReward.points}
          badgeText={currentReward.badgeText}
          type={currentReward.type}
        />
      )}
    </RewardContext.Provider>
  );
};

// Utility function to register components (used by Builder.io)
export const registerRewardComponents = () => {
  // This could be used to register the reward components with a component registry
};

// Utility functions to trigger different reward types
export const triggerReward = (rewards: RewardContextType, rewardData: Omit<RewardPopupProps, 'isOpen' | 'onClose'>) => {
  rewards.showReward(rewardData);
};

export const triggerAchievement = (rewards: RewardContextType, title: string, description?: string, points?: number) => {
  rewards.showReward({
    title,
    description,
    points,
    badgeText: "Achievement Unlocked!",
    type: "achievement"
  });
};

export const triggerMilestone = (rewards: RewardContextType, title: string, description?: string, points?: number) => {
  rewards.showReward({
    title,
    description,
    points,
    badgeText: "Milestone Reached!",
    type: "milestone"
  });
};

export const triggerCertificate = (rewards: RewardContextType, title: string, description?: string, image?: string) => {
  rewards.showReward({
    title,
    description,
    image,
    badgeText: "Certificate Earned!",
    type: "certificate"
  });
};

export const triggerPrize = (rewards: RewardContextType, title: string, description?: string, image?: string, points?: number) => {
  rewards.showReward({
    title,
    description,
    image,
    points,
    badgeText: "Prize Awarded!",
    type: "prize"
  });
};