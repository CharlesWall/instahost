#!/usr/bin/env node
import express, { NextFunction, Request, Response } from 'express';
import { readdir, stat } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import { IncomingMessage, ServerResponse } from 'http';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const cliOptions = {
	port: 3000,
	hostPath: process.cwd()
};

(() => {
	for(var i = 2; i < process.argv.length; i++){
		var arg = process.argv[i];
		switch(arg){
			case '-p':
				cliOptions.port = parseInt(process.argv[++i])
				break;
			default:
				cliOptions.hostPath = arg;
				break;
		}
	}
})();

const app = express();
app.set('port', cliOptions.port);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');

console.log(cliOptions);

app.use(showSlideShow);
app.use(showDirectory);
app.use('/favicon.ico', express.static(__dirname + 'assets/favicon.ico'))
// Serve static files from the hostpath directory
app.use(express.static(path.join(cliOptions.hostPath)));

app.listen(cliOptions.port, () => {
    console.log(`Server listening on port ${cliOptions.port}`);
});

async function showDirectory(req: Request, res: Response, next: NextFunction) {
	const requestPath = decodeURIComponent(req.path);
	const localPath = path.join(cliOptions.hostPath, requestPath);

	try {
		const fileStats = await stat(localPath);
		if (!fileStats.isDirectory()) {
			return next();
		}
	} catch(error) {
		console.error(error);
		return next();
	}

	const fileLinkList = await getLinksFromDir(localPath, requestPath);

	res.render('index', {
		title: `Instahost: ${requestPath}`,
		links: fileLinkList
	});
}


async function showSlideShow(req: Request, res: Response, next: NextFunction) {
	if (!req.path.startsWith('/_slideshow/')) {
		return next();
	}

	const assetUrlPath = decodeURIComponent(req.path.replace('/_slideshow/', '/'));

	const assetParentPath = path.parse(assetUrlPath).dir;
	const localParentPath = path.join(cliOptions.hostPath, assetParentPath);

	const siblings = await getLinksFromDir(localParentPath, assetParentPath);
	const imageSiblings = siblings.filter(({href}) => isImagePath(href));

	const assetIndex = imageSiblings.findIndex(({href}) => {
		return href === assetUrlPath
	});

	const prevLink = imageSiblings[assetIndex - 1];
	const nextLink = imageSiblings[assetIndex + 1];

	res.render('slideshow', {
		title: `Instahost: ${assetUrlPath}`,
		asset: assetUrlPath,
		prevLink,
		nextLink,
		dirLink: assetParentPath,
	});
}


async function getLinksFromDir(localPath: string, requestPath: string): Promise<Array<{name: string, href: string}>> {
	const filenameList = await readdir(localPath);
	
	return filenameList.sort().map((filename) => {
		const href = path.join(requestPath, filename);
		const slideShowUrl = isImagePath(filename) ? '/_slideshow' + href : undefined;

		return {
			name: filename,
			href,
			slideShowUrl
		};
	});
}

function isImagePath(imagePath: string): boolean {
	return ['.jpg', '.jpeg', '.png', '.gif'].some((extension) => imagePath.endsWith(extension));
}