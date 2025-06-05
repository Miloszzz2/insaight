import { Film, Lightbulb, MessageCircle, Mic, Music } from "lucide-react";

export const categoryConfig = [
	{
		id: "editing",
		name: "Montage / Editing",
		icon: Film,
		count: 0,
		active: true,
	},
	{
		id: "suggestions",
		name: "Future Video Ideas",
		icon: Lightbulb,
		count: 0,
		active: false,
	},
	{ id: "host", name: "Host Feedback", icon: Mic, count: 0, active: false },
	{
		id: "sound",
		name: "Sound / Music",
		icon: Music,
		count: 0,
		active: false,
	},
	{
		id: "general",
		name: "General Impressions",
		icon: MessageCircle,
		count: 0,
		active: false,
	},
];
