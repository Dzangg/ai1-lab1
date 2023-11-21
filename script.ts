const styles: Style[] = [
	{
		name: 'default',
		src: 'css/style.css',
	},
	{
		name: 'second',
		src: 'css/style2.css',
	},
];

type Style = {
	name: string;
	src: string;
};

let nextStyleIndex: number = 1;

let currentStyle: Style = styles[0];

const generateLinks = (): void => {
	const footerContainer = document.getElementById(
		'footer-container'
	) as HTMLDivElement;

	while (footerContainer.lastChild instanceof HTMLAnchorElement) {
		footerContainer.removeChild(footerContainer.lastChild);
	}

	for (const style of styles) {
		if (currentStyle !== style) {
			const newALink = document.createElement('a');
			newALink.innerText = style.name;
			newALink.onclick = () => {
				toggleStyle(style);
			};

			const footerContainer = document.getElementById(
				'footer-container'
			) as HTMLDivElement;

			footerContainer.appendChild(newALink);
		}
	}
	console.log(footerContainer);
};

const toggleStyle = (style: Style) => {
	currentStyle = style;
	generateLinks();
	document.getElementById('theme')?.setAttribute('href', style.src);
};

window.onload = () => {
	generateLinks();
};
