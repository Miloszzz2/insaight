import { ThumbsDown, ThumbsUp, Minus } from "lucide-react";
import { FC } from "react";
import React from "react"
export const getSentimentIcon = (sentiment: string) => {
   switch (sentiment) {
      case "positive":
         return React.createElement(ThumbsUp, { className: "w-4 h-4 text-green-500" })
      case "negative":
         return React.createElement(ThumbsDown, { className: "w-4 h-4 text-red-500" })
      default:
         return React.createElement(Minus, { className: "w-4 h-4 text-gray-500" })
   }
}