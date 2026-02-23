import crypto from 'crypto';

function getWikiUrl(filename) {
    const safeFilename = filename.replace(/ /g, '_');
    const hash = crypto.createHash('md5').update(safeFilename).digest('hex');
    const a = hash.substring(0, 1);
    const ab = hash.substring(0, 2);
    return `https://upload.wikimedia.org/wikipedia/commons/${a}/${ab}/${safeFilename}`;
}

const files = [
    'Muscles_anterior.png',
    'Muscles_posterior.png'
];

files.forEach(f => {
    console.log(`${f}|${getWikiUrl(f)}`);
});
