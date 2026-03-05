const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('./resource/78 Tarot Cards 3-Step Interpretation_ Empathy, Insight, Positive Message.csv', { encoding: 'utf8' });

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const cards = [];
  let isFirstLine = true;
  let linesRead = 0;

  for await (let line of rl) {
    if (isFirstLine) {
      isFirstLine = false;
      continue;
    }
    linesRead++;
    if (linesRead > 22) break;

    // Parse CSV line. Since there are quotes in the CSV, we need a simple CSV parser
    const regex = /(?:^|,)(?:"([^"]*)"|([^,]*))/g;
    let matches;
    const parts = [];
    while (matches = regex.exec(line)) {
      parts.push(matches[1] || matches[2] || '');
    }

    // parts format [name, empathy, insight, affirmation, ...]
    if (parts.length >= 4) {
      const name = parts[0].trim();
      const numMatch = name.match(/^(\d+)/);
      const id = numMatch ? parseInt(numMatch[1], 10) : linesRead - 1;
      
      cards.push({
        id: id,
        name: name,
        image_url: `/image/${name}.jpg`,
        step1_empathy: parts[1].trim(),
        step2_insight: parts[2].trim(),
        step3_affirmation: parts[3].trim()
      });
    }
  }

  // Write to src/data/tarotData.json
  fs.writeFileSync('./src/data/tarotData.json', JSON.stringify(cards, null, 2), 'utf8');
  console.log(`Generated ${cards.length} cards in src/data/tarotData.json`);
}

processLineByLine();
