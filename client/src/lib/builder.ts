import { builder, Builder } from '@builder.io/react';
import { registerRewardComponents } from '@/components/rewards/RewardManager';

// Set your Builder API key
const apiKey = import.meta.env.VITE_BUILDER_API_KEY || '';

export const initBuilder = () => {
  // Initialize builder with your API key
  builder.init(apiKey);
  
  // Register custom components that can be used in the Builder editor
  registerComponents();
  
  // Enable right-click to open the Builder.io editor
  if (process.env.NODE_ENV !== 'production') {
    const originalInit = builder.init;
    builder.init = (apiKey: string, ...rest: any[]) => {
      const res = originalInit.call(builder, apiKey, ...rest);
      return res;
    };
  }
};

export const registerComponents = () => {
  // Register any custom components that can be used in Builder.io
  registerRewardComponents();
  
  // Example of registering a custom component
  // Builder.registerComponent(
  //   YourReactComponent, 
  //   { 
  //     name: 'Custom Component',
  //     inputs: [
  //       { name: 'text', type: 'string' }
  //     ],
  //   }
  // );
};

export const setUserRole = (role: 'student' | 'teacher' | 'admin') => {
  // Set user attributes for targeting content in Builder.io
  builder.setUserAttributes({
    role
  });
};

export const getContent = async (modelName: string, options = {}) => {
  // Get content from Builder.io by model name
  return await builder.get(modelName, {
    cachebust: true,
    ...options
  }).promise();
};