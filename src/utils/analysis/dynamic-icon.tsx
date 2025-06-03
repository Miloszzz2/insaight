// Method 1: Using dynamic imports with icon mapping
import React from 'react';
import * as LucideIcons from 'lucide-react';



// Method 1: Direct mapping approach
export const DynamicIcon: React.FC<{ name: string, className: string }> = ({ name, className }) => {
   // Cast to access icons dynamically
   const IconComponent = (LucideIcons as any)[name];

   if (!IconComponent) {
      // Fallback icon if the requested icon doesn't exist
      return <LucideIcons.HelpCircle className={className} />;
   }

   return <IconComponent className={className} />;
};
