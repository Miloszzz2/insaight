export const getSentimentColor = (sentiment: string) => {
   switch (sentiment) {
      case "positive":
         return "border-l-green-500 bg-green-50"
      case "negative":
         return "border-l-red-500 bg-red-50"
      default:
         return "border-l-gray-500 bg-gray-50"
   }
}