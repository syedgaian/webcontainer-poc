import React from "react";
import parser from "html-react-parser";

interface HtmlToReactComponentProps {
	htmlString: string;
}

const HtmlToReactComponent: React.FC<HtmlToReactComponentProps> = ({
	htmlString,
}) => {
	return <div>{parser(htmlString)}</div>;
};

export default HtmlToReactComponent;
