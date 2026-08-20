/**
 * Runnable tour of the client. Points at the local dev API by default:
 *
 *   yarn example
 *
 * Point it at production instead with:
 *
 *   TCGPRISER_BASE_URL=https://api.tcgpriser.se yarn example
 */
import { TcgPriser } from '../src/index.js';

const baseUrl = process.env.TCGPRISER_BASE_URL ?? 'http://localhost:5000';
const authToken = process.env.TCGPRISER_AUTH_TOKEN;
const tcgpriser = new TcgPriser({ authToken, advanced: { baseUrl } });

async function main() {
  console.log(`Using API at ${baseUrl}\n`);

  const stats = await tcgpriser.stats.platform();
  console.log('Platform stats:', stats);

  const expansions = await tcgpriser.expansions.list();
  console.log(`\n${expansions.length} expansions. Newest:`, expansions[0]?.name);

  const { data: cards } = await tcgpriser.cards.list({ search: 'pikachu', limit: 3 });
  console.log(`\nFound ${cards.length} cards matching "pikachu":`);
  for (const card of cards) {
    console.log(`  - ${card.name} (${card.expansion?.name ?? 'no set'}): ${card.retailPrice ?? '?'} SEK`);
  }

  const firstCard = cards[0];
  if (firstCard) {
    const matches = await tcgpriser.cards.matches(firstCard.technicalName, { inStock: true, limit: 5 });
    console.log(`\nIn-stock listings for "${firstCard.name}":`);
    for (const match of matches.data) {
      console.log(`  - ${match.shop.name}: ${match.price ?? '?'} ${match.currency ?? ''}`);
    }
  }

  const bargains = await tcgpriser.bargains.list({ type: 'card' });
  console.log(`\nTop card bargains (${bargains.pagination.total} total):`);
  for (const bargain of bargains.data.slice(0, 3)) {
    console.log(
      `  - ${bargain.product.name} at ${bargain.shop.name}: ${bargain.price} SEK ` +
        `(-${bargain.bargain.discountPercent}% vs ${bargain.bargain.referenceSource})`,
    );
  }

  try {
    await tcgpriser.cards.get('this-does-not-exist');
  } catch (error) {
    console.log('\nExpected 404 for a bad id:', error instanceof Error ? error.message : error);
  }

  // Premium needs a subscriber's API token, generated from tcgpriser.se/account/api-token. Pass it
  // here, either as the client's default (set above) or per call: cards.livePricing(id, { authToken: ... }).
  if (firstCard) {
    try {
      const live = await tcgpriser.cards.livePricing(firstCard.technicalName);
      console.log(`\nLive pricing for "${firstCard.name}":`, live.pricing);
    } catch (error) {
      console.log(
        '\nPremium call failed (expected without TCGPRISER_AUTH_TOKEN set):',
        error instanceof Error ? error.message : error,
      );
    }
  }
}

main().catch((error) => {
  console.error('Example failed:', error);
  process.exitCode = 1;
});
