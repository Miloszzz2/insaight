import React from "react";
import * as LucideIcons from "lucide-react";

export const DynamicIcon: React.FC<{ name: string; className: string }> = ({
	name,
	className,
}) => {
	const IconComponent = (LucideIcons as any)[name];

	if (!IconComponent) {
		return <LucideIcons.HelpCircle className={className} />;
	}

	return <IconComponent className={className} />;
};
