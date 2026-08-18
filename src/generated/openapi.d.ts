// GENERATED FILE — do not edit by hand.
// Run `yarn generate:types` to regenerate from a live API instance.
// Source: http://localhost:5000/premium-openapi.json

export interface paths {
    "/bargains": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Latest bargains
         * @description Returns the top 3 latest in-stock bargains (matches at least 10% below a reference price). Optionally filter by product type.
         */
        get: {
            parameters: {
                query?: {
                    type?: "sealed" | "card" | "all";
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Up to 3 bargain listings */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": [
                         *         {
                         *           "url": "https://www.samlarhobby.se/products/fezandipiti-ex-asc-288-ascended-heroes",
                         *           "price": 800,
                         *           "currency": "SEK",
                         *           "shop": {
                         *             "technicalName": "samlarhobby",
                         *             "name": "Samlarhobby"
                         *           },
                         *           "inStock": true,
                         *           "matchedAt": "2026-08-06T06:45:10.000Z",
                         *           "product": {
                         *             "id": "69808864100d0aea4dc3f7f4",
                         *             "kind": "card",
                         *             "name": "Mega Evolution Ascended Heroes Fezandipiti ex",
                         *             "technicalName": "mega-evolution-ascended-heroes-fezandipiti-ex",
                         *             "imageUrl": "https://ik.imagekit.io/xgtytqdnv/products/eng-mega-evolution-ascended-heroes-fezandipiti-ex.webp"
                         *           },
                         *           "bargain": {
                         *             "discountPercent": 46.67,
                         *             "referenceSource": "tradera"
                         *           }
                         *         },
                         *         {
                         *           "url": "https://www.shinycards.se/pokemon/singles-loskort/venusaur-ex-mew003-black-star-promo-pokmon-scarlet-violet-151",
                         *           "price": 79,
                         *           "currency": "SEK",
                         *           "shop": {
                         *             "technicalName": "shinycards",
                         *             "name": "Shinycards"
                         *           },
                         *           "inStock": true,
                         *           "matchedAt": "2026-07-29T03:30:08.000Z",
                         *           "product": {
                         *             "id": "684aea450554072ffe597b44",
                         *             "kind": "sealed",
                         *             "name": "Scarlet & Violet Booster Pack",
                         *             "technicalName": "scarlet-violet-booster-pack",
                         *             "imageUrl": "https://ik.imagekit.io/xgtytqdnv/products/eng-scarlet-violet-booster-pack.png"
                         *           },
                         *           "bargain": {
                         *             "discountPercent": 43.06,
                         *             "referenceSource": "tradera"
                         *           }
                         *         },
                         *         {
                         *           "url": "https://www.swepoke.se/pokemon/singles-and-graded-cards/singles/kyurem-dragon-vault-drv-2120",
                         *           "price": 2500,
                         *           "currency": "SEK",
                         *           "shop": {
                         *             "technicalName": "swepoke",
                         *             "name": "Swepoke"
                         *           },
                         *           "inStock": true,
                         *           "matchedAt": "2026-07-16T10:25:12.000Z",
                         *           "product": {
                         *             "id": "684aea470554072ffe597c8d",
                         *             "kind": "sealed",
                         *             "name": "Black & White Dragon Vault Booster Pack",
                         *             "technicalName": "black-white-dragon-vault-booster-pack",
                         *             "imageUrl": "https://ik.imagekit.io/xgtytqdnv/products/eng-black-white-dragon-vault-booster-pack.png"
                         *           },
                         *           "bargain": {
                         *             "discountPercent": 42.79,
                         *             "referenceSource": "cardmarket"
                         *           }
                         *         }
                         *       ],
                         *       "pagination": {
                         *         "total": 3,
                         *         "limit": 3,
                         *         "skip": 0,
                         *         "hasMore": true
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["BargainListResponse"];
                    };
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bargains/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Search bargains with filters
         * @description **Requires the `premium` level.** Full paginated bargain search with filters for shop, reference source, discount minimum, card variant dimensions, and free-text search on product name.
         */
        get: {
            parameters: {
                query?: {
                    limit?: number;
                    skip?: number;
                    type?: "sealed" | "card" | "all";
                    /** @description Filter by shop technicalName */
                    shop?: string;
                    /** @description Filter by which reference price source qualified the bargain */
                    referenceSource?: "retail" | "tradera" | "cardmarket";
                    /** @description Minimum discount percentage (default 10) */
                    minDiscount?: number;
                    /** @description Filter by stock status (default true) */
                    inStock?: boolean;
                    /** @description Card variant filter */
                    cardType?: "loose" | "graded";
                    /** @description Card condition filter */
                    itemCondition?: "NM" | "LP" | "MP" | "HP" | "DMG";
                    /** @description Grading company filter */
                    gradingCompany?: "PSA" | "BGS" | "CGC" | "SGC" | "ACE" | "TAG" | "GMA";
                    /** @description Numeric grade filter */
                    grade?: number;
                    /** @description Free-text search on product name / technicalName */
                    search?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Paginated bargain listings */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": [
                         *         {
                         *           "url": "https://www.shinycards.se/pokemon/elite-trainer-box/pokemon-mega-evolution-5-pitch-black-elite-trainer-box",
                         *           "price": 999,
                         *           "currency": "SEK",
                         *           "shop": {
                         *             "technicalName": "shinycards",
                         *             "name": "Shinycards"
                         *           },
                         *           "inStock": true,
                         *           "matchedAt": "2026-07-18T03:30:20.000Z",
                         *           "product": {
                         *             "id": "697a009b3dc6cf27e18310b2",
                         *             "kind": "sealed",
                         *             "name": "Mega Evolution Elite Trainer Box [Mega Lucario]",
                         *             "technicalName": "mega-evolution-elite-trainer-box-mega-lucario",
                         *             "imageUrl": "https://ik.imagekit.io/xgtytqdnv/products/eng-mega-evolution-mega-evolution-elite-trainer-box-mega-lucario.jpg"
                         *           },
                         *           "bargain": {
                         *             "discountPercent": 16.82,
                         *             "referenceSource": "tradera"
                         *           }
                         *         }
                         *       ],
                         *       "pagination": {
                         *         "total": 1,
                         *         "limit": 20,
                         *         "skip": 0,
                         *         "hasMore": false
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["BargainSearchResponse"];
                    };
                };
                /** @description Invalid query parameters */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Premium subscription required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/cards": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List/search cards */
        get: {
            parameters: {
                query?: {
                    search?: string;
                    limit?: number;
                    skip?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Cards in the standard list envelope */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": [
                         *         {
                         *           "id": "6a7c95eafcba9642616149f4",
                         *           "kind": "card",
                         *           "name": "Mega Evolution Ascended Heroes Fezandipiti ex",
                         *           "shortName": "Fezandipiti ex",
                         *           "technicalName": "mega-evolution-ascended-heroes-fezandipiti-ex-288-217",
                         *           "brand": {
                         *             "id": "6841cfd656b8f021ecb0483b",
                         *             "name": "Pokémon",
                         *             "technicalName": "pokemon",
                         *             "createdAt": "2025-06-05T17:11:50.316Z",
                         *             "updatedAt": "2025-06-05T17:11:50.316Z"
                         *           },
                         *           "manufacturer": "Pokemon",
                         *           "modelNumber": "me02.5-288",
                         *           "category": {
                         *             "id": "6980884f100d0aea4dc3f5bd",
                         *             "name": "Pokemon",
                         *             "technicalName": "pokemon"
                         *           },
                         *           "expansion": {
                         *             "id": "697f9b3a033da0c17a751c24",
                         *             "name": "Mega Evolution Ascended Heroes",
                         *             "shortName": "Ascended Heroes",
                         *             "technicalName": "eng-mega-evolution-ascended-heroes",
                         *             "language": "ENG",
                         *             "code": "me2pt5",
                         *             "cardCode": "ASC",
                         *             "seriesName": "Mega Evolution",
                         *             "releaseDate": "2026-01-30T00:00:00.000Z",
                         *             "logoUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/eng-mega-evolution-ascended-heroes-logo.png",
                         *             "symbolUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/eng-mega-evolution-ascended-heroes-symbol.png",
                         *             "imageUrl": null
                         *           },
                         *           "language": "ENG",
                         *           "alternativeNames": [],
                         *           "supportsMultipackPricing": true,
                         *           "imageUrl": "https://ik.imagekit.io/xgtytqdnv/products/eng-mega-evolution-ascended-heroes-fezandipiti-ex-288-217.webp",
                         *           "retailPrice": null,
                         *           "estimatedValue": null,
                         *           "shopCount": 0,
                         *           "pricingDataPoints": 0,
                         *           "pricingUpdatedAt": null,
                         *           "createdAt": "2026-08-12T15:48:58.811Z",
                         *           "updatedAt": "2026-08-12T15:48:58.811Z",
                         *           "cardNumber": "288/217",
                         *           "rarity": "Special illustration rare",
                         *           "artist": "SIE NANAHARA",
                         *           "cardmarketId": "869899",
                         *           "tcgplayerId": "676100",
                         *           "variants": {
                         *             "normal": false,
                         *             "holo": true,
                         *             "reverse": false,
                         *             "firstEdition": false,
                         *             "wPromo": false
                         *           },
                         *           "prisjaktId": null,
                         *           "lowestShopOffer": null,
                         *           "referencePriceSnapshotsByProvider": {
                         *             "cardmarket": {
                         *               "provider": "cardmarket",
                         *               "price": 46.73,
                         *               "currency": "EUR",
                         *               "priceSek": 512.32,
                         *               "snapshotDate": "2026-08-12T00:00:00.000Z"
                         *             },
                         *             "tcgplayer": {
                         *               "provider": "tcgplayer",
                         *               "price": 59.54,
                         *               "currency": "USD",
                         *               "priceSek": 565.65,
                         *               "snapshotDate": "2026-08-12T00:00:00.000Z"
                         *             }
                         *           }
                         *         },
                         *         {
                         *           "id": "698093fb3830469b48e39b35",
                         *           "kind": "card",
                         *           "name": "Scarlet & Violet Prismatic Evolutions Fezandipiti",
                         *           "shortName": "Fezandipiti",
                         *           "technicalName": "scarlet-violet-prismatic-evolutions-fezandipiti",
                         *           "brand": {
                         *             "id": "6841cfd656b8f021ecb0483b",
                         *             "name": "Pokémon",
                         *             "technicalName": "pokemon",
                         *             "createdAt": "2025-06-05T17:11:50.316Z",
                         *             "updatedAt": "2025-06-05T17:11:50.316Z"
                         *           },
                         *           "manufacturer": "Pokemon",
                         *           "modelNumber": "sv08.5-045",
                         *           "category": {
                         *             "id": "6980884f100d0aea4dc3f5bd",
                         *             "name": "Pokemon",
                         *             "technicalName": "pokemon"
                         *           },
                         *           "expansion": {
                         *             "id": "684add666f3d257c659c73cb",
                         *             "name": "Scarlet & Violet Prismatic Evolutions",
                         *             "shortName": "Prismatic Evolutions",
                         *             "technicalName": "eng-scarlet-violet-prismatic-evolutions",
                         *             "language": "ENG",
                         *             "code": "sv8pt5",
                         *             "cardCode": "PRE",
                         *             "seriesName": "Scarlet & Violet",
                         *             "releaseDate": "2025-01-17T00:00:00.000Z",
                         *             "logoUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/eng-scarlet-violet-prismatic-evolutions-logo.png",
                         *             "symbolUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/eng-scarlet-violet-prismatic-evolutions-symbol.png",
                         *             "imageUrl": null
                         *           },
                         *           "language": "ENG",
                         *           "alternativeNames": [],
                         *           "supportsMultipackPricing": true,
                         *           "imageUrl": "https://ik.imagekit.io/xgtytqdnv/products/eng-scarlet-violet-prismatic-evolutions-fezandipiti.webp",
                         *           "retailPrice": null,
                         *           "estimatedValue": null,
                         *           "shopCount": 0,
                         *           "pricingDataPoints": 0,
                         *           "pricingUpdatedAt": "2026-08-12T09:00:01.416Z",
                         *           "createdAt": "2026-02-02T12:09:31.934Z",
                         *           "updatedAt": "2026-08-12T09:00:01.656Z",
                         *           "cardNumber": "045/131",
                         *           "rarity": "Rare",
                         *           "artist": "Kouki Saitou",
                         *           "cardmarketId": "805434",
                         *           "tcgplayerId": "610400",
                         *           "variants": {
                         *             "normal": false,
                         *             "holo": true,
                         *             "reverse": true,
                         *             "firstEdition": false,
                         *             "wPromo": false
                         *           },
                         *           "prisjaktId": null,
                         *           "lowestShopOffer": null,
                         *           "referencePriceSnapshotsByProvider": {
                         *             "cardmarket": {
                         *               "provider": "cardmarket",
                         *               "price": 0.32,
                         *               "currency": "EUR",
                         *               "priceSek": 3.51,
                         *               "snapshotDate": "2026-08-12T00:00:00.000Z"
                         *             },
                         *             "tcgplayer": {
                         *               "provider": "tcgplayer",
                         *               "price": 0.2,
                         *               "currency": "USD",
                         *               "priceSek": 1.9,
                         *               "snapshotDate": "2026-08-12T00:00:00.000Z"
                         *             }
                         *           }
                         *         }
                         *       ],
                         *       "pagination": {
                         *         "total": 6,
                         *         "limit": 2,
                         *         "skip": 0,
                         *         "hasMore": true
                         *       }
                         *     }
                         */
                        "application/json": {
                            data?: components["schemas"]["CardWithPricing"][];
                            pagination?: components["schemas"]["PageMeta"];
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/cards/{id}/matches": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get shop matches for a specific card (returns latest per shop)
         * @description The latest match per shop for this card — the current shop price. History across time is the `premium` level's `/shop-match-stats` surface.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Filter by stock status */
                    inStock?: boolean;
                    limit?: number;
                    skip?: number;
                };
                header?: never;
                path: {
                    /** @description Card _id or technicalName */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List of shop matches for the card */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "item": {
                         *         "id": "69808864100d0aea4dc3f7f4",
                         *         "name": "Mega Evolution Ascended Heroes Fezandipiti ex"
                         *       },
                         *       "data": [
                         *         {
                         *           "id": "6a757f013f38ef493c70c063",
                         *           "shop": {
                         *             "technicalName": "samlarhobby",
                         *             "name": "Samlarhobby",
                         *             "delivery": {
                         *               "cost": null,
                         *               "currency": null,
                         *               "daysMin": null,
                         *               "daysMax": null,
                         *               "freeShippingThreshold": 2000,
                         *               "supportsLocalPickup": null,
                         *               "note": null
                         *             }
                         *           },
                         *           "url": "https://www.samlarhobby.se/products/fezandipiti-ex-asc-288-ascended-heroes",
                         *           "shopUrlId": "6a3f717581e84af694733f39",
                         *           "price": 800,
                         *           "currency": "SEK",
                         *           "inStock": true,
                         *           "inPreorder": false,
                         *           "inMonitor": false,
                         *           "isFullyBooked": false,
                         *           "scrapedName": "Fezandipiti ex (ASC 288) Ascended Heroes",
                         *           "scrapedType": "Pokemon TCG",
                         *           "matchScore": 90,
                         *           "hasCategoryMismatch": false,
                         *           "cardType": null,
                         *           "itemCondition": null,
                         *           "gradingCompany": null,
                         *           "grade": null,
                         *           "matchedAt": "2026-08-07T06:45:11.000Z",
                         *           "updatedAt": "2026-08-12T14:18:16.455Z",
                         *           "bargain": null
                         *         }
                         *       ],
                         *       "pagination": {
                         *         "total": 1,
                         *         "limit": 2,
                         *         "skip": 0,
                         *         "hasMore": false
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ItemShopMatches"];
                    };
                };
                /** @description Card not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/cards/{id}/reference-prices": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get the cmapi reference price history (cardmarket/tcgplayer) for a card
         * @description **Requires the `premium` level.** Daily reference prices ingested from cmapi, grouped into one series per price dimension (provider, graded/non-graded, grading company + grade). Prices are in each provider's native currency — no SEK conversion is applied — so `currency` is per series.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Rolling window ending today. Ignored when from/to are supplied. */
                    days?: number;
                    from?: string;
                    to?: string;
                    provider?: "cardmarket" | "tcgplayer" | "ebay" | "tradera";
                    cardType?: "loose" | "graded";
                };
                header?: never;
                path: {
                    /** @description Card _id or technicalName */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Grouped daily reference price series for the card */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "item": {
                         *         "id": "69808864100d0aea4dc3f7f4",
                         *         "name": "Mega Evolution Ascended Heroes Fezandipiti ex"
                         *       },
                         *       "fromDate": "2026-05-15",
                         *       "toDate": "2026-08-12",
                         *       "metric": "price",
                         *       "currencyMode": "native",
                         *       "series": [
                         *         {
                         *           "source": "tcgdex",
                         *           "provider": "cardmarket",
                         *           "variant": "holo",
                         *           "cardType": "loose",
                         *           "gradingCompany": null,
                         *           "grade": null,
                         *           "currency": "EUR",
                         *           "sampleSize": null,
                         *           "points": [
                         *             {
                         *               "snapshotDate": "2026-07-29T00:00:00.000Z",
                         *               "price": 3.4
                         *             },
                         *             {
                         *               "snapshotDate": "2026-07-30T00:00:00.000Z",
                         *               "price": 3.4
                         *             },
                         *             {
                         *               "snapshotDate": "2026-07-31T00:00:00.000Z",
                         *               "price": 3.4
                         *             }
                         *           ]
                         *         }
                         *       ]
                         *     }
                         */
                        "application/json": components["schemas"]["ItemReferencePrices"];
                    };
                };
                /** @description Invalid query parameters */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Card not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/cards/{id}/prices": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get marketplace auction prices for a specific card
         * @description **Requires the `premium` level.** The same user JWT as any signed-in request, plus an active or trialing subscription — a valid token without one is answered 403 `premiumRequired`. A `ServiceToken` from `API_AUTH_TOKENS` is accepted in place of the subscription, so our own back-end services can read this without holding a seat.
         */
        get: {
            parameters: {
                query?: {
                    limit?: number;
                    skip?: number;
                };
                header?: never;
                path: {
                    /** @description Card _id or technicalName */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List of marketplace auction prices for the card */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "item": {
                         *         "id": "69808864100d0aea4dc3f7f4",
                         *         "name": "Mega Evolution Ascended Heroes Fezandipiti ex"
                         *       },
                         *       "data": [
                         *         {
                         *           "id": "6a7ab56965c48e8508841825",
                         *           "url": "https://www.tradera.com/item/743412041",
                         *           "price": 35,
                         *           "currency": "SEK",
                         *           "soldAt": "2026-08-10T16:49:57.000Z",
                         *           "itemId": "743412041",
                         *           "source": "tradera"
                         *         },
                         *         {
                         *           "id": "6a741d901d1c8cf12b3e36de",
                         *           "url": "https://www.tradera.com/item/743391838",
                         *           "price": 10,
                         *           "currency": "SEK",
                         *           "soldAt": "2026-08-05T21:10:17.000Z",
                         *           "itemId": "743391838",
                         *           "source": "tradera"
                         *         }
                         *       ],
                         *       "pagination": {
                         *         "total": 4,
                         *         "limit": 2,
                         *         "skip": 0,
                         *         "hasMore": true
                         *       },
                         *       "premiumRequired": true
                         *     }
                         */
                        "application/json": components["schemas"]["ItemSoldPrices"];
                    };
                };
                /** @description Missing or invalid bearer token */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Valid token but no active Premium subscription */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Card not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Rate limit exceeded */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/cards/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a card by id or technicalName, including pricing info */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description The card, with its cached pricing */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "id": "69808864100d0aea4dc3f7f4",
                         *       "kind": "card",
                         *       "name": "Mega Evolution Ascended Heroes Fezandipiti ex",
                         *       "shortName": "Fezandipiti ex",
                         *       "technicalName": "mega-evolution-ascended-heroes-fezandipiti-ex",
                         *       "brand": {
                         *         "id": "6841cfd656b8f021ecb0483b",
                         *         "name": "Pokémon",
                         *         "technicalName": "pokemon",
                         *         "createdAt": "2025-06-05T17:11:50.316Z",
                         *         "updatedAt": "2025-06-05T17:11:50.316Z"
                         *       },
                         *       "manufacturer": "Pokemon",
                         *       "modelNumber": "me02.5-142",
                         *       "category": {
                         *         "id": "6980884f100d0aea4dc3f5bd",
                         *         "name": "Pokemon",
                         *         "technicalName": "pokemon"
                         *       },
                         *       "expansion": {
                         *         "id": "697f9b3a033da0c17a751c24",
                         *         "name": "Mega Evolution Ascended Heroes",
                         *         "shortName": "Ascended Heroes",
                         *         "technicalName": "eng-mega-evolution-ascended-heroes",
                         *         "language": "ENG",
                         *         "code": "me2pt5",
                         *         "cardCode": "ASC",
                         *         "seriesName": "Mega Evolution",
                         *         "releaseDate": "2026-01-30T00:00:00.000Z",
                         *         "logoUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/eng-mega-evolution-ascended-heroes-logo.png",
                         *         "symbolUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/eng-mega-evolution-ascended-heroes-symbol.png",
                         *         "imageUrl": null
                         *       },
                         *       "language": "ENG",
                         *       "alternativeNames": [],
                         *       "supportsMultipackPricing": true,
                         *       "imageUrl": "https://ik.imagekit.io/xgtytqdnv/products/eng-mega-evolution-ascended-heroes-fezandipiti-ex.webp",
                         *       "retailPrice": 800,
                         *       "estimatedValue": 22.5,
                         *       "shopCount": 2,
                         *       "pricingDataPoints": 2,
                         *       "pricingUpdatedAt": "2026-08-12T09:00:01.416Z",
                         *       "createdAt": "2026-02-02T11:20:04.997Z",
                         *       "updatedAt": "2026-08-12T09:00:01.655Z",
                         *       "cardNumber": "142/217",
                         *       "rarity": "Double rare",
                         *       "artist": "takuyoa",
                         *       "cardmarketId": "869753",
                         *       "tcgplayerId": "675954",
                         *       "variants": {
                         *         "normal": false,
                         *         "holo": true,
                         *         "reverse": false,
                         *         "firstEdition": false,
                         *         "wPromo": false
                         *       },
                         *       "prisjaktId": null,
                         *       "lowestShopOffer": {
                         *         "shop": {
                         *           "technicalName": "samlarhobby",
                         *           "name": "Samlarhobby"
                         *         },
                         *         "url": "https://www.samlarhobby.se/products/fezandipiti-ex-asc-288-ascended-heroes",
                         *         "price": 800,
                         *         "currency": "SEK",
                         *         "inStock": true,
                         *         "inPreorder": false,
                         *         "inMonitor": false,
                         *         "isFullyBooked": false,
                         *         "matchedAt": "2026-08-07T06:45:11.000Z",
                         *         "updatedAt": "2026-08-12T14:18:16.455Z",
                         *         "bargain": null
                         *       },
                         *       "referencePriceSnapshotsByProvider": {
                         *         "cardmarket": {
                         *           "provider": "cardmarket",
                         *           "price": 3.46,
                         *           "currency": "EUR",
                         *           "priceSek": 37.93,
                         *           "snapshotDate": "2026-08-12T00:00:00.000Z"
                         *         },
                         *         "tcgplayer": {
                         *           "provider": "tcgplayer",
                         *           "price": 3.52,
                         *           "currency": "USD",
                         *           "priceSek": 33.44,
                         *           "snapshotDate": "2026-08-12T00:00:00.000Z"
                         *         },
                         *         "tradera": {
                         *           "provider": "tradera",
                         *           "price": 35,
                         *           "currency": "SEK",
                         *           "priceSek": 35,
                         *           "snapshotDate": "2026-08-10T00:00:00.000Z"
                         *         }
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["CardWithPricing"];
                    };
                };
                /** @description Card not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/cards/{id}/pricing/live": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get freshly computed pricing for a card
         * @description Recomputes rather than reading the cached figures on the card. Signed-in users only, and rate limited to 30 requests per minute per client.
         *
         *     **Requires the `premium` level.** The same user JWT as any signed-in request, plus an active or trialing subscription — a valid token without one is answered 403 `premiumRequired`. A `ServiceToken` from `API_AUTH_TOKENS` is accepted in place of the subscription, so our own back-end services can read this without holding a seat.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Card _id or technicalName */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Live pricing for the item */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "id": "69808864100d0aea4dc3f7f4",
                         *       "name": "Mega Evolution Ascended Heroes Fezandipiti ex",
                         *       "technicalName": "mega-evolution-ascended-heroes-fezandipiti-ex",
                         *       "pricing": {
                         *         "retailPrice": 800,
                         *         "estimatedValue": 22.5,
                         *         "shopCount": 2,
                         *         "pricingDataPoints": 2,
                         *         "calculatedAt": "2026-08-12T16:33:08.025Z"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["LivePricingForItem"];
                    };
                };
                /** @description Missing or invalid bearer token */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Card not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Rate limit exceeded */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/expansions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all expansions */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Every expansion, in the standard list envelope. Deliberately not paginated — the set is small and bounded, and the scraper caches it wholesale. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": [
                         *         {
                         *           "id": "6a577711abc1ce71383d3e10",
                         *           "name": "Mega Evolution 30th Celebration",
                         *           "shortName": "30th Celebration",
                         *           "technicalName": "jpn-mega-evolution-30th-celebration",
                         *           "language": "JPN",
                         *           "code": "m6a",
                         *           "cardCode": "m6a",
                         *           "seriesName": "Mega Evolution",
                         *           "releaseDate": "2026-09-16T00:00:00.000Z",
                         *           "logoUrl": null,
                         *           "symbolUrl": null,
                         *           "imageUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/jpn-mega-evolution-30th-celebration-image.webp",
                         *           "year": null,
                         *           "brand": {
                         *             "id": "6841cfd656b8f021ecb0483b",
                         *             "name": "Pokémon",
                         *             "technicalName": "pokemon",
                         *             "createdAt": "2025-06-05T17:11:50.316Z",
                         *             "updatedAt": "2025-06-05T17:11:50.316Z"
                         *           },
                         *           "alternativeNames": [
                         *             {
                         *               "name": "30th Celebration",
                         *               "shortName": "30th Celebration"
                         *             }
                         *           ],
                         *           "sealedCount": 0,
                         *           "cardCount": 0,
                         *           "productCount": 0,
                         *           "createdAt": "2026-07-15T12:03:29.322Z",
                         *           "updatedAt": "2026-07-22T12:26:27.158Z"
                         *         },
                         *         {
                         *           "id": "6a5f8693d7d69cc373a5d74f",
                         *           "name": "Mega Evolution 30th Celebration",
                         *           "shortName": "30th Celebration",
                         *           "technicalName": "eng-mega-evolution-30th-celebration",
                         *           "language": "ENG",
                         *           "code": "30c",
                         *           "cardCode": null,
                         *           "seriesName": "Mega Evolution",
                         *           "releaseDate": "2026-09-16T00:00:00.000Z",
                         *           "logoUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/eng-mega-evolution-30th-celebration-logo.png",
                         *           "symbolUrl": null,
                         *           "imageUrl": null,
                         *           "year": 2026,
                         *           "brand": {
                         *             "id": "6841cfd656b8f021ecb0483b",
                         *             "name": "Pokémon",
                         *             "technicalName": "pokemon",
                         *             "createdAt": "2025-06-05T17:11:50.316Z",
                         *             "updatedAt": "2025-06-05T17:11:50.316Z"
                         *           },
                         *           "alternativeNames": [],
                         *           "sealedCount": 30,
                         *           "cardCount": 0,
                         *           "productCount": 30,
                         *           "createdAt": "2026-07-21T14:47:47.786Z",
                         *           "updatedAt": "2026-08-12T14:03:19.234Z"
                         *         }
                         *       ],
                         *       "pagination": {
                         *         "total": 524,
                         *         "limit": 524,
                         *         "skip": 0,
                         *         "hasMore": false
                         *       }
                         *     }
                         */
                        "application/json": {
                            data?: components["schemas"]["Expansion"][];
                            pagination?: components["schemas"]["PageMeta"];
                        };
                    };
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/expansions/{technicalName}/products": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all products for a given expansion */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Technical name of the expansion (e.g., 'eng-scarlet-violet-base-set' or legacy 'scarlet-violet-base-set') */
                    technicalName: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List of products for the expansion */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": [
                         *         {
                         *           "id": "6a607b9c954cf540a81602bb",
                         *           "kind": "sealed",
                         *           "name": "Mega Evolution 30th Celebration Lapras & Drifloon Mini Tin",
                         *           "shortName": "30th Celebration Lapras & Drifloon Mini Tin",
                         *           "technicalName": "mega-evolution-30th-celebration-lapras-drifloon-mini-tin",
                         *           "brand": {
                         *             "id": "6841cfd656b8f021ecb0483b",
                         *             "name": "Pokémon",
                         *             "technicalName": "pokemon",
                         *             "createdAt": "2025-06-05T17:11:50.316Z",
                         *             "updatedAt": "2025-06-05T17:11:50.316Z"
                         *           },
                         *           "manufacturer": "Pokemon",
                         *           "modelNumber": null,
                         *           "category": {
                         *             "id": "6a6c6a414e7c9ac6337fc9a2",
                         *             "name": "Mini Tin",
                         *             "technicalName": "mini-tin"
                         *           },
                         *           "expansion": {
                         *             "id": "6a5f8693d7d69cc373a5d74f",
                         *             "name": "Mega Evolution 30th Celebration",
                         *             "shortName": "30th Celebration",
                         *             "technicalName": "eng-mega-evolution-30th-celebration",
                         *             "language": "ENG",
                         *             "code": "30c",
                         *             "cardCode": null,
                         *             "seriesName": "Mega Evolution",
                         *             "releaseDate": "2026-09-16T00:00:00.000Z",
                         *             "logoUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/eng-mega-evolution-30th-celebration-logo.png",
                         *             "symbolUrl": null,
                         *             "imageUrl": null
                         *           },
                         *           "language": "ENG",
                         *           "alternativeNames": [],
                         *           "supportsMultipackPricing": false,
                         *           "imageUrl": "https://ik.imagekit.io/xgtytqdnv/products/eng-mega-evolution-30th-celebration-lapras-drifloon-mini-tin.png",
                         *           "retailPrice": null,
                         *           "estimatedValue": null,
                         *           "shopCount": 0,
                         *           "pricingDataPoints": 0,
                         *           "pricingUpdatedAt": "2026-08-12T09:00:01.416Z",
                         *           "createdAt": "2026-07-22T08:13:16.268Z",
                         *           "updatedAt": "2026-08-12T09:00:01.623Z",
                         *           "upc": null,
                         *           "asin": null,
                         *           "epid": null,
                         *           "priceChartingId": null,
                         *           "prisjaktId": null,
                         *           "lowestShopOffer": null,
                         *           "referencePriceSnapshotsByProvider": {
                         *             "cardmarket": {
                         *               "provider": "cardmarket",
                         *               "price": 29.93,
                         *               "currency": "EUR",
                         *               "priceSek": 328.14,
                         *               "snapshotDate": "2026-08-12T00:00:00.000Z"
                         *             }
                         *           }
                         *         },
                         *         {
                         *           "id": "6a607b9c954cf540a81602bd",
                         *           "kind": "sealed",
                         *           "name": "Mega Evolution 30th Celebration Binder Collection",
                         *           "shortName": "30th Celebration Binder Collection",
                         *           "technicalName": "mega-evolution-30th-celebration-binder-collection",
                         *           "brand": {
                         *             "id": "6841cfd656b8f021ecb0483b",
                         *             "name": "Pokémon",
                         *             "technicalName": "pokemon",
                         *             "createdAt": "2025-06-05T17:11:50.316Z",
                         *             "updatedAt": "2025-06-05T17:11:50.316Z"
                         *           },
                         *           "manufacturer": "Pokemon",
                         *           "modelNumber": null,
                         *           "category": {
                         *             "id": "696a3ab4683b8133873c1b0d",
                         *             "name": "Binder Collection",
                         *             "technicalName": "binder-collection"
                         *           },
                         *           "expansion": {
                         *             "id": "6a5f8693d7d69cc373a5d74f",
                         *             "name": "Mega Evolution 30th Celebration",
                         *             "shortName": "30th Celebration",
                         *             "technicalName": "eng-mega-evolution-30th-celebration",
                         *             "language": "ENG",
                         *             "code": "30c",
                         *             "cardCode": null,
                         *             "seriesName": "Mega Evolution",
                         *             "releaseDate": "2026-09-16T00:00:00.000Z",
                         *             "logoUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/eng-mega-evolution-30th-celebration-logo.png",
                         *             "symbolUrl": null,
                         *             "imageUrl": null
                         *           },
                         *           "language": "ENG",
                         *           "alternativeNames": [],
                         *           "supportsMultipackPricing": false,
                         *           "imageUrl": "https://ik.imagekit.io/xgtytqdnv/products/eng-mega-evolution-30th-celebration-binder-collection.png",
                         *           "retailPrice": null,
                         *           "estimatedValue": null,
                         *           "shopCount": 0,
                         *           "pricingDataPoints": 0,
                         *           "pricingUpdatedAt": "2026-08-12T09:00:01.416Z",
                         *           "createdAt": "2026-07-22T08:13:16.271Z",
                         *           "updatedAt": "2026-08-12T09:00:01.623Z",
                         *           "upc": null,
                         *           "asin": null,
                         *           "epid": null,
                         *           "priceChartingId": null,
                         *           "prisjaktId": null,
                         *           "lowestShopOffer": null,
                         *           "referencePriceSnapshotsByProvider": {
                         *             "cardmarket": {
                         *               "provider": "cardmarket",
                         *               "price": 84.99,
                         *               "currency": "EUR",
                         *               "priceSek": 931.79,
                         *               "snapshotDate": "2026-08-12T00:00:00.000Z"
                         *             }
                         *           }
                         *         },
                         *         {
                         *           "id": "6a607b9c954cf540a81602bf",
                         *           "kind": "sealed",
                         *           "name": "Mega Evolution 30th Celebration Eevee 2-Pack Blister",
                         *           "shortName": "30th Celebration Eevee 2-Pack Blister",
                         *           "technicalName": "mega-evolution-30th-celebration-eevee-2-pack-blister",
                         *           "brand": {
                         *             "id": "6841cfd656b8f021ecb0483b",
                         *             "name": "Pokémon",
                         *             "technicalName": "pokemon",
                         *             "createdAt": "2025-06-05T17:11:50.316Z",
                         *             "updatedAt": "2025-06-05T17:11:50.316Z"
                         *           },
                         *           "manufacturer": "Pokemon",
                         *           "modelNumber": null,
                         *           "category": {
                         *             "id": "6a607b9b954cf540a816028c",
                         *             "name": "Eevee 2-Pack Blister",
                         *             "technicalName": "eevee-2-pack-blister"
                         *           },
                         *           "expansion": {
                         *             "id": "6a5f8693d7d69cc373a5d74f",
                         *             "name": "Mega Evolution 30th Celebration",
                         *             "shortName": "30th Celebration",
                         *             "technicalName": "eng-mega-evolution-30th-celebration",
                         *             "language": "ENG",
                         *             "code": "30c",
                         *             "cardCode": null,
                         *             "seriesName": "Mega Evolution",
                         *             "releaseDate": "2026-09-16T00:00:00.000Z",
                         *             "logoUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/eng-mega-evolution-30th-celebration-logo.png",
                         *             "symbolUrl": null,
                         *             "imageUrl": null
                         *           },
                         *           "language": "ENG",
                         *           "alternativeNames": [],
                         *           "supportsMultipackPricing": false,
                         *           "imageUrl": "https://ik.imagekit.io/xgtytqdnv/products/eng-mega-evolution-30th-celebration-eevee-2-pack-blister.png",
                         *           "retailPrice": null,
                         *           "estimatedValue": null,
                         *           "shopCount": 0,
                         *           "pricingDataPoints": 0,
                         *           "pricingUpdatedAt": "2026-08-12T09:00:01.416Z",
                         *           "createdAt": "2026-07-22T08:13:16.305Z",
                         *           "updatedAt": "2026-08-12T09:00:01.623Z",
                         *           "upc": null,
                         *           "asin": null,
                         *           "epid": null,
                         *           "priceChartingId": null,
                         *           "prisjaktId": null,
                         *           "lowestShopOffer": null,
                         *           "referencePriceSnapshotsByProvider": {
                         *             "cardmarket": {
                         *               "provider": "cardmarket",
                         *               "price": 24.99,
                         *               "currency": "EUR",
                         *               "priceSek": 273.98,
                         *               "snapshotDate": "2026-08-12T00:00:00.000Z"
                         *             }
                         *           }
                         *         }
                         *       ],
                         *       "pagination": {
                         *         "total": 30,
                         *         "limit": 30,
                         *         "skip": 0,
                         *         "hasMore": false
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ExpansionContents"];
                    };
                };
                /** @description Multiple expansions found with the same name (legacy slug) - returns options to choose from */
                300: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Redirect to the new URL format (when a unique legacy slug is found) */
                301: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Expansion not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/expansions/{technicalName}/products/live-pricing": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get freshly computed pricing for every product in an expansion
         * @description The one Premium-gated read in the API: a signed-in user without an active subscription gets 403 `premiumRequired`, not 401. Rate limited per client.
         *
         *     **Requires the `premium` level.** The same user JWT as any signed-in request, plus an active or trialing subscription — a valid token without one is answered 403 `premiumRequired`. A `ServiceToken` from `API_AUTH_TOKENS` is accepted in place of the subscription, so our own back-end services can read this without holding a seat.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Expansion technicalName */
                    technicalName: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Live pricing for the expansion's products */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "expansion": {
                         *         "technicalName": "eng-mega-evolution-30th-celebration"
                         *       },
                         *       "items": [
                         *         {
                         *           "id": "6a607b9c954cf540a81602bb",
                         *           "name": "Mega Evolution 30th Celebration Lapras & Drifloon Mini Tin",
                         *           "technicalName": "mega-evolution-30th-celebration-lapras-drifloon-mini-tin",
                         *           "pricing": {
                         *             "retailPrice": null,
                         *             "estimatedValue": null,
                         *             "shopCount": 0,
                         *             "pricingDataPoints": 0,
                         *             "calculatedAt": "2026-08-12T16:34:43.410Z"
                         *           }
                         *         },
                         *         {
                         *           "id": "6a607b9c954cf540a81602bd",
                         *           "name": "Mega Evolution 30th Celebration Binder Collection",
                         *           "technicalName": "mega-evolution-30th-celebration-binder-collection",
                         *           "pricing": {
                         *             "retailPrice": null,
                         *             "estimatedValue": null,
                         *             "shopCount": 0,
                         *             "pricingDataPoints": 0,
                         *             "calculatedAt": "2026-08-12T16:34:43.417Z"
                         *           }
                         *         },
                         *         {
                         *           "id": "6a607b9c954cf540a81602bf",
                         *           "name": "Mega Evolution 30th Celebration Eevee 2-Pack Blister",
                         *           "technicalName": "mega-evolution-30th-celebration-eevee-2-pack-blister",
                         *           "pricing": {
                         *             "retailPrice": null,
                         *             "estimatedValue": null,
                         *             "shopCount": 0,
                         *             "pricingDataPoints": 0,
                         *             "calculatedAt": "2026-08-12T16:34:43.427Z"
                         *           }
                         *         }
                         *       ]
                         *     }
                         */
                        "application/json": components["schemas"]["ExpansionLivePricing"];
                    };
                };
                /** @description Missing or invalid bearer token */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Active Premium subscription required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Expansion not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Rate limit exceeded */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/pack-rates": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List all pack pull rates
         * @description Returns the per-expansion pack pull-rate buckets. An expansion with no entry has no custom rates; consumers should fall back to defaults.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description All pack rate documents */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data?: components["schemas"]["PackRate"][];
                            pagination?: components["schemas"]["PageMeta"];
                        };
                    };
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/pack-rates/{expansionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get pack pull rates for one expansion */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    expansionId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description The pack rate document */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["PackRate"];
                    };
                };
                /** @description No custom rates for this expansion */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/price-stats/daily": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get daily price stats for products */
        get: {
            parameters: {
                query?: {
                    /** @description Start date (YYYY-MM-DD) */
                    startDate?: string;
                    /** @description End date (YYYY-MM-DD) */
                    endDate?: string;
                    /** @description Product name */
                    productName?: string;
                    /** @description Technical name */
                    technicalName?: string;
                    /** @description PriceCharting ID */
                    priceChartingId?: string;
                    /** @description Model number */
                    modelNumber?: string;
                    /** @description Category technical name */
                    category?: string;
                    /** @description Expansion technical name */
                    expansion?: string;
                    /** @description Category ID (ObjectId) */
                    categoryId?: string;
                    /** @description Expansion ID (ObjectId) */
                    expansionId?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Success */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": [
                         *         {
                         *           "item": {
                         *             "id": "684aea450554072ffe597b44",
                         *             "name": "Scarlet & Violet Booster Pack"
                         *           },
                         *           "dailyStats": [
                         *             {
                         *               "statDate": "2025-05-11",
                         *               "averagePrice": 50
                         *             },
                         *             {
                         *               "statDate": "2025-05-31",
                         *               "averagePrice": 45
                         *             },
                         *             {
                         *               "statDate": "2025-06-25",
                         *               "averagePrice": 45
                         *             }
                         *           ]
                         *         }
                         *       ],
                         *       "pagination": {
                         *         "total": 1,
                         *         "limit": 1,
                         *         "skip": 0,
                         *         "hasMore": false
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ItemDailyStats"];
                    };
                };
                /** @description Invalid date format */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description No products found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/price-stats/estimated-values": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get estimated values for products based on recent sales data */
        get: {
            parameters: {
                query?: {
                    /** @description Page number for pagination */
                    page?: number;
                    /** @description Number of products per page (max 100) */
                    limit?: number;
                    /** @description Product name */
                    productName?: string;
                    /** @description Technical name */
                    technicalName?: string;
                    /** @description PriceCharting ID */
                    priceChartingId?: string;
                    /** @description Model number */
                    modelNumber?: string;
                    /** @description Category technical name */
                    category?: string;
                    /** @description Expansion technical name */
                    expansion?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Success */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": [
                         *         {
                         *           "item": {
                         *             "id": "6841dfb7c410f0c69bf724a8",
                         *             "name": "Scarlet & Violet The Glory of Team Rocket Booster Box"
                         *           },
                         *           "estimate": {
                         *             "estimatedValue": 450,
                         *             "estimateUpdatedAt": "2025-12-19T00:00:00.000Z",
                         *             "dataPointCount": 1
                         *           }
                         *         },
                         *         {
                         *           "item": {
                         *             "id": "6841e0ac62cf62d1b52de8a4",
                         *             "name": "Scarlet & Violet Crimson Haze Booster Box"
                         *           },
                         *           "estimate": {
                         *             "estimatedValue": 636,
                         *             "estimateUpdatedAt": "2026-03-20T00:00:00.000Z",
                         *             "dataPointCount": 1
                         *           }
                         *         }
                         *       ],
                         *       "pagination": {
                         *         "total": 9759,
                         *         "limit": 2,
                         *         "skip": 0,
                         *         "hasMore": true
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ItemEstimatedValue"];
                    };
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/price-stats/product/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get all info about a product, including price stats
         * @description **Requires the `premium` level.** The same user JWT as any signed-in request, plus an active or trialing subscription — a valid token without one is answered 403 `premiumRequired`. A `ServiceToken` from `API_AUTH_TOKENS` is accepted in place of the subscription, so our own back-end services can read this without holding a seat.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Product _id or technicalName */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Product info with price stats */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "item": {
                         *         "id": "684aea450554072ffe597b44",
                         *         "kind": "sealed",
                         *         "name": "Scarlet & Violet Booster Pack",
                         *         "shortName": "Scarlet & Violet Booster Pack",
                         *         "technicalName": "scarlet-violet-booster-pack",
                         *         "brand": {
                         *           "id": "6841cfd656b8f021ecb0483b",
                         *           "name": "Pokémon",
                         *           "technicalName": "pokemon",
                         *           "createdAt": "2025-06-05T17:11:50.316Z",
                         *           "updatedAt": "2025-06-05T17:11:50.316Z"
                         *         },
                         *         "manufacturer": "Pokemon",
                         *         "modelNumber": "4954135",
                         *         "category": {
                         *           "id": "6841d175d5919761e8ec14ed",
                         *           "name": "Booster Pack",
                         *           "technicalName": "booster-pack"
                         *         },
                         *         "expansion": {
                         *           "id": "684add666f3d257c659c73ad",
                         *           "name": "Scarlet & Violet Scarlet & Violet",
                         *           "shortName": "Scarlet & Violet",
                         *           "technicalName": "eng-scarlet-violet-scarlet-violet",
                         *           "language": "ENG",
                         *           "code": "sv1",
                         *           "cardCode": "SVI",
                         *           "seriesName": "Scarlet & Violet",
                         *           "releaseDate": "2023-03-31T00:00:00.000Z",
                         *           "logoUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/eng-scarlet-violet-scarlet-violet-logo.png",
                         *           "symbolUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/eng-scarlet-violet-scarlet-violet-symbol.png",
                         *           "imageUrl": null
                         *         },
                         *         "language": "ENG",
                         *         "alternativeNames": [
                         *           {
                         *             "name": "Scarlet & Violet Booster (6 Cards)",
                         *             "shortName": "Scarlet & Violet Booster (6 Cards)"
                         *           }
                         *         ],
                         *         "supportsMultipackPricing": true,
                         *         "imageUrl": "https://ik.imagekit.io/xgtytqdnv/products/eng-scarlet-violet-booster-pack.png",
                         *         "retailPrice": 65.67,
                         *         "estimatedValue": 138.75,
                         *         "shopCount": 5,
                         *         "pricingDataPoints": 4,
                         *         "pricingUpdatedAt": "2026-08-12T09:00:01.416Z",
                         *         "createdAt": "2025-06-12T14:55:01.203Z",
                         *         "updatedAt": "2026-08-12T09:00:01.623Z",
                         *         "upc": null,
                         *         "asin": null,
                         *         "epid": null,
                         *         "priceChartingId": "4954135",
                         *         "prisjaktId": null
                         *       },
                         *       "dailyStats": [
                         *         {
                         *           "statDate": "2025-05-11",
                         *           "averagePrice": 50
                         *         },
                         *         {
                         *           "statDate": "2025-05-31",
                         *           "averagePrice": 45
                         *         },
                         *         {
                         *           "statDate": "2025-06-25",
                         *           "averagePrice": 45
                         *         }
                         *       ],
                         *       "estimate": {
                         *         "estimatedValue": 138.75,
                         *         "estimateUpdatedAt": "2026-08-02T00:00:00.000Z",
                         *         "dataPointCount": 4
                         *       },
                         *       "variantStats": {
                         *         "variantCount": 1,
                         *         "looseCount": 60,
                         *         "gradedCount": 0
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ItemStats"];
                    };
                };
                /** @description Missing or invalid bearer token */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Valid token but no active Premium subscription */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Product not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Rate limit exceeded */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/price-stats/product/{id}/full": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get complete product information with all stats, estimated values, and shop matches
         * @description Combined endpoint that returns all product data in a single request for SSG optimization.
         *
         *     **Requires the `premium` level.** The same user JWT as any signed-in request, plus an active or trialing subscription — a valid token without one is answered 403 `premiumRequired`. A `ServiceToken` from `API_AUTH_TOKENS` is accepted in place of the subscription, so our own back-end services can read this without holding a seat.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Product ID (MongoDB ObjectId) or technical name */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Complete stats for the item */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "item": {
                         *         "id": "684aea450554072ffe597b44",
                         *         "kind": "sealed",
                         *         "name": "Scarlet & Violet Booster Pack",
                         *         "shortName": "Scarlet & Violet Booster Pack",
                         *         "technicalName": "scarlet-violet-booster-pack",
                         *         "brand": {
                         *           "id": "6841cfd656b8f021ecb0483b",
                         *           "name": "Pokémon",
                         *           "technicalName": "pokemon",
                         *           "createdAt": "2025-06-05T17:11:50.316Z",
                         *           "updatedAt": "2025-06-05T17:11:50.316Z"
                         *         },
                         *         "manufacturer": "Pokemon",
                         *         "modelNumber": "4954135",
                         *         "category": {
                         *           "id": "6841d175d5919761e8ec14ed",
                         *           "name": "Booster Pack",
                         *           "technicalName": "booster-pack"
                         *         },
                         *         "expansion": {
                         *           "id": "684add666f3d257c659c73ad",
                         *           "name": "Scarlet & Violet Scarlet & Violet",
                         *           "shortName": "Scarlet & Violet",
                         *           "technicalName": "eng-scarlet-violet-scarlet-violet",
                         *           "language": "ENG",
                         *           "code": "sv1",
                         *           "cardCode": "SVI",
                         *           "seriesName": "Scarlet & Violet",
                         *           "releaseDate": "2023-03-31T00:00:00.000Z",
                         *           "logoUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/eng-scarlet-violet-scarlet-violet-logo.png",
                         *           "symbolUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/eng-scarlet-violet-scarlet-violet-symbol.png",
                         *           "imageUrl": null
                         *         },
                         *         "language": "ENG",
                         *         "alternativeNames": [
                         *           {
                         *             "name": "Scarlet & Violet Booster (6 Cards)",
                         *             "shortName": "Scarlet & Violet Booster (6 Cards)"
                         *           }
                         *         ],
                         *         "supportsMultipackPricing": true,
                         *         "imageUrl": "https://ik.imagekit.io/xgtytqdnv/products/eng-scarlet-violet-booster-pack.png",
                         *         "retailPrice": 65.67,
                         *         "estimatedValue": 138.75,
                         *         "shopCount": 5,
                         *         "pricingDataPoints": 4,
                         *         "pricingUpdatedAt": "2026-08-12T09:00:01.416Z",
                         *         "createdAt": "2025-06-12T14:55:01.203Z",
                         *         "updatedAt": "2026-08-12T09:00:01.623Z",
                         *         "upc": null,
                         *         "asin": null,
                         *         "epid": null,
                         *         "priceChartingId": "4954135",
                         *         "prisjaktId": null
                         *       },
                         *       "stats": {
                         *         "dailyStats": [
                         *           {
                         *             "statDate": "2025-05-11",
                         *             "averagePrice": 50
                         *           },
                         *           {
                         *             "statDate": "2025-05-31",
                         *             "averagePrice": 45
                         *           },
                         *           {
                         *             "statDate": "2025-06-25",
                         *             "averagePrice": 45
                         *           }
                         *         ],
                         *         "variantStats": {
                         *           "variantCount": 1,
                         *           "looseCount": 60,
                         *           "gradedCount": 0
                         *         }
                         *       },
                         *       "estimate": {
                         *         "estimatedValue": 138.75,
                         *         "estimateUpdatedAt": "2026-08-02T00:00:00.000Z",
                         *         "dataPointCount": 4
                         *       },
                         *       "shopMatches": {
                         *         "data": [
                         *           {
                         *             "id": "6a6ab7374e7c9ac6337e3e06",
                         *             "shop": {
                         *               "technicalName": "tcgstore",
                         *               "name": "Tcgstore",
                         *               "delivery": {
                         *                 "cost": null,
                         *                 "currency": null,
                         *                 "daysMin": null,
                         *                 "daysMax": null,
                         *                 "freeShippingThreshold": null,
                         *                 "supportsLocalPickup": null,
                         *                 "note": null
                         *               }
                         *             },
                         *             "url": "https://tcgstore.se/products/sylveon-ex-sv8a-069-187-pokemon-scarlet-violet-terastal-festival-japanskt",
                         *             "shopUrlId": null,
                         *             "price": 59,
                         *             "currency": "SEK",
                         *             "inStock": false,
                         *             "inPreorder": false,
                         *             "inMonitor": false,
                         *             "isFullyBooked": false,
                         *             "scrapedName": null,
                         *             "scrapedType": null,
                         *             "matchScore": 15,
                         *             "hasCategoryMismatch": false,
                         *             "cardType": null,
                         *             "itemCondition": null,
                         *             "gradingCompany": null,
                         *             "grade": null,
                         *             "matchedAt": "2026-07-30T02:30:06.000Z",
                         *             "updatedAt": "2026-08-12T14:18:16.455Z",
                         *             "bargain": null
                         *           },
                         *           {
                         *             "id": "6a6973c2de85705573238e68",
                         *             "shop": {
                         *               "technicalName": "shinycards",
                         *               "name": "Shinycards",
                         *               "delivery": {
                         *                 "cost": null,
                         *                 "currency": null,
                         *                 "daysMin": null,
                         *                 "daysMax": null,
                         *                 "freeShippingThreshold": null,
                         *                 "supportsLocalPickup": null,
                         *                 "note": null
                         *               }
                         *             },
                         *             "url": "https://www.shinycards.se/pokemon/singles-loskort/kopia-bulbasaur-reverse-holo-mew001-black-star-promo-pokemon-scarlet-violet-151",
                         *             "shopUrlId": null,
                         *             "price": 29,
                         *             "currency": "SEK",
                         *             "inStock": true,
                         *             "inPreorder": false,
                         *             "inMonitor": false,
                         *             "isFullyBooked": false,
                         *             "scrapedName": null,
                         *             "scrapedType": null,
                         *             "matchScore": 15,
                         *             "hasCategoryMismatch": false,
                         *             "cardType": null,
                         *             "itemCondition": null,
                         *             "gradingCompany": null,
                         *             "grade": null,
                         *             "matchedAt": "2026-07-29T03:30:08.000Z",
                         *             "updatedAt": "2026-08-12T14:18:16.455Z",
                         *             "bargain": null
                         *           },
                         *           {
                         *             "id": "6a68b919de85705573237cb5",
                         *             "shop": {
                         *               "technicalName": "poketalk",
                         *               "name": "Poketalk",
                         *               "delivery": {
                         *                 "cost": null,
                         *                 "currency": null,
                         *                 "daysMin": null,
                         *                 "daysMax": null,
                         *                 "freeShippingThreshold": null,
                         *                 "supportsLocalPickup": null,
                         *                 "note": null
                         *               }
                         *             },
                         *             "url": "https://www.poketalk.se/products/pokemon-scarlet-violet-booster-pack-kop-nu-hos-poketalk",
                         *             "shopUrlId": null,
                         *             "price": 79,
                         *             "currency": "SEK",
                         *             "inStock": false,
                         *             "inPreorder": false,
                         *             "inMonitor": false,
                         *             "isFullyBooked": false,
                         *             "scrapedName": null,
                         *             "scrapedType": null,
                         *             "matchScore": 40,
                         *             "hasCategoryMismatch": false,
                         *             "cardType": null,
                         *             "itemCondition": null,
                         *             "gradingCompany": null,
                         *             "grade": null,
                         *             "matchedAt": "2026-07-28T14:12:30.000Z",
                         *             "updatedAt": "2026-08-12T14:18:16.455Z",
                         *             "bargain": null
                         *           }
                         *         ],
                         *         "pagination": {
                         *           "total": 7,
                         *           "limit": 100,
                         *           "skip": 0,
                         *           "hasMore": false
                         *         }
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ItemFullStats"];
                    };
                };
                /** @description Missing or invalid bearer token */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Valid token but no active Premium subscription */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Product not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Rate limit exceeded */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/price-stats/product/{id}/daily": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get daily price stats for a specific product
         * @description **Requires the `premium` level.** The same user JWT as any signed-in request, plus an active or trialing subscription — a valid token without one is answered 403 `premiumRequired`. A `ServiceToken` from `API_AUTH_TOKENS` is accepted in place of the subscription, so our own back-end services can read this without holding a seat.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Number of days to retrieve (from today backwards) */
                    days?: number;
                };
                header?: never;
                path: {
                    /** @description Product ID (MongoDB ObjectId or technicalName) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Daily price stats for the product */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "item": {
                         *         "id": "684aea450554072ffe597b44",
                         *         "name": "Scarlet & Violet Booster Pack"
                         *       },
                         *       "dailyStats": [
                         *         {
                         *           "statDate": "2026-07-21",
                         *           "averagePrice": 150
                         *         },
                         *         {
                         *           "statDate": "2026-07-26",
                         *           "averagePrice": 200
                         *         },
                         *         {
                         *           "statDate": "2026-07-28",
                         *           "averagePrice": 65
                         *         }
                         *       ]
                         *     }
                         */
                        "application/json": components["schemas"]["ItemDailyStats"];
                    };
                };
                /** @description Missing or invalid bearer token */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Valid token but no active Premium subscription */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Product not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Rate limit exceeded */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/price-stats/product/{id}/daily-last-30": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get daily price stats for the last 30 days (fixed, no query param for safety)
         * @description **Requires the `premium` level.** Daily Tradera price averages for the last 30 days, one point per date.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Product ID (MongoDB ObjectId or technicalName) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Daily price stats for the last 30 days */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "item": {
                         *         "id": "684aea450554072ffe597b44",
                         *         "name": "Scarlet & Violet Booster Pack"
                         *       },
                         *       "dailyStats": [
                         *         {
                         *           "statDate": "2026-07-21",
                         *           "averagePrice": 150
                         *         },
                         *         {
                         *           "statDate": "2026-07-26",
                         *           "averagePrice": 200
                         *         },
                         *         {
                         *           "statDate": "2026-07-28",
                         *           "averagePrice": 65
                         *         }
                         *       ]
                         *     }
                         */
                        "application/json": components["schemas"]["ItemDailyStats"];
                    };
                };
                /** @description Product not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/price-stats/product/{id}/estimated-value": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get estimated value for a product
         * @description **Requires the `premium` level.** The same user JWT as any signed-in request, plus an active or trialing subscription — a valid token without one is answered 403 `premiumRequired`. A `ServiceToken` from `API_AUTH_TOKENS` is accepted in place of the subscription, so our own back-end services can read this without holding a seat.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Product ID (MongoDB ObjectId or technicalName) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Estimated value for the product */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "item": {
                         *         "id": "684aea450554072ffe597b44",
                         *         "name": "Scarlet & Violet Booster Pack"
                         *       },
                         *       "estimate": {
                         *         "estimatedValue": 138.75,
                         *         "estimateUpdatedAt": "2026-08-02T00:00:00.000Z",
                         *         "dataPointCount": 4
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ItemEstimatedValue"];
                    };
                };
                /** @description Missing or invalid bearer token */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Valid token but no active Premium subscription */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Product not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Rate limit exceeded */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/price-stats/product/{id}/by-variant": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get price statistics grouped by card type, condition, and grade
         * @description **Requires the `premium` level.** The same user JWT as any signed-in request, plus an active or trialing subscription — a valid token without one is answered 403 `premiumRequired`. A `ServiceToken` from `API_AUTH_TOKENS` is accepted in place of the subscription, so our own back-end services can read this without holding a seat.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Number of days to include in average calculation */
                    days?: number;
                };
                header?: never;
                path: {
                    /** @description Product ID (MongoDB ObjectId or technicalName) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Price stats grouped by variant */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "item": {
                         *         "id": "69808864100d0aea4dc3f7f4",
                         *         "name": "Mega Evolution Ascended Heroes Fezandipiti ex"
                         *       },
                         *       "variants": {
                         *         "loose": {},
                         *         "graded": {}
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ItemVariantStats"];
                    };
                };
                /** @description Missing or invalid bearer token */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Valid token but no active Premium subscription */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Product not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Rate limit exceeded */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/price-stats/product/{id}/daily-by-variant": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get daily price history for a specific card variant
         * @description **Requires the `premium` level.** The same user JWT as any signed-in request, plus an active or trialing subscription — a valid token without one is answered 403 `premiumRequired`. A `ServiceToken` from `API_AUTH_TOKENS` is accepted in place of the subscription, so our own back-end services can read this without holding a seat.
         */
        get: {
            parameters: {
                query: {
                    /** @description Type of card (loose or graded) */
                    cardType: "loose" | "graded";
                    /** @description Card condition (required for loose cards) */
                    condition?: "NM" | "LP" | "MP" | "HP" | "DMG";
                    /** @description Grading company (required for graded cards) */
                    gradingCompany?: "PSA" | "BGS" | "CGC" | "SGC" | "ACE";
                    /** @description Grade number (required for graded cards) */
                    grade?: number;
                    /** @description Number of days to retrieve */
                    days?: number;
                };
                header?: never;
                path: {
                    /** @description Product ID (MongoDB ObjectId or technicalName) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Daily price history for the variant */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "item": {
                         *         "id": "69808864100d0aea4dc3f7f4",
                         *         "name": "Mega Evolution Ascended Heroes Fezandipiti ex"
                         *       },
                         *       "variant": {
                         *         "cardType": "loose",
                         *         "condition": "NM",
                         *         "gradingCompany": null,
                         *         "grade": null
                         *       },
                         *       "dailyStats": []
                         *     }
                         */
                        "application/json": components["schemas"]["ItemVariantDailyStats"];
                    };
                };
                /** @description Invalid query parameters */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Missing or invalid bearer token */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Valid token but no active Premium subscription */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Product not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Rate limit exceeded */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/price-stats/top-products": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get top products by shop availability
         * @description Returns top N products ranked by number of shop matches, used for build-time route generation
         */
        get: {
            parameters: {
                query?: {
                    /** @description Maximum number of products to return */
                    limit?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List of top products */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": [],
                         *       "pagination": {
                         *         "total": 0,
                         *         "limit": 1,
                         *         "skip": 0,
                         *         "hasMore": false
                         *       }
                         *     }
                         */
                        "application/json": {
                            data?: components["schemas"]["TopItem"][];
                            pagination?: components["schemas"]["PageMeta"];
                        };
                    };
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/product": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List products
         * @description `search` matches on word starts in the product name; multiple tokens must all match. Query params are validated by `searchListQuery` before the handler runs.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Whitespace-separated tokens, each matched against the start of a word */
                    search?: string;
                    limit?: number;
                    skip?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Products in the standard list envelope */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": [
                         *         {
                         *           "id": "684aea450554072ffe597b44",
                         *           "kind": "sealed",
                         *           "name": "Scarlet & Violet Booster Pack",
                         *           "shortName": "Scarlet & Violet Booster Pack",
                         *           "technicalName": "scarlet-violet-booster-pack",
                         *           "brand": {
                         *             "id": "6841cfd656b8f021ecb0483b",
                         *             "name": "Pokémon",
                         *             "technicalName": "pokemon",
                         *             "createdAt": "2025-06-05T17:11:50.316Z",
                         *             "updatedAt": "2025-06-05T17:11:50.316Z"
                         *           },
                         *           "manufacturer": "Pokemon",
                         *           "modelNumber": "4954135",
                         *           "category": {
                         *             "id": "6841d175d5919761e8ec14ed",
                         *             "name": "Booster Pack",
                         *             "technicalName": "booster-pack"
                         *           },
                         *           "expansion": {
                         *             "id": "684add666f3d257c659c73ad",
                         *             "name": "Scarlet & Violet Scarlet & Violet",
                         *             "shortName": "Scarlet & Violet",
                         *             "technicalName": "eng-scarlet-violet-scarlet-violet",
                         *             "language": "ENG",
                         *             "code": "sv1",
                         *             "cardCode": "SVI",
                         *             "seriesName": "Scarlet & Violet",
                         *             "releaseDate": "2023-03-31T00:00:00.000Z",
                         *             "logoUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/eng-scarlet-violet-scarlet-violet-logo.png",
                         *             "symbolUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/eng-scarlet-violet-scarlet-violet-symbol.png",
                         *             "imageUrl": null
                         *           },
                         *           "language": "ENG",
                         *           "alternativeNames": [
                         *             {
                         *               "name": "Scarlet & Violet Booster (6 Cards)",
                         *               "shortName": "Scarlet & Violet Booster (6 Cards)"
                         *             }
                         *           ],
                         *           "supportsMultipackPricing": true,
                         *           "imageUrl": "https://ik.imagekit.io/xgtytqdnv/products/eng-scarlet-violet-booster-pack.png",
                         *           "retailPrice": 65.67,
                         *           "estimatedValue": 138.75,
                         *           "shopCount": 5,
                         *           "pricingDataPoints": 4,
                         *           "pricingUpdatedAt": "2026-08-12T09:00:01.416Z",
                         *           "createdAt": "2025-06-12T14:55:01.203Z",
                         *           "updatedAt": "2026-08-12T09:00:01.623Z",
                         *           "upc": null,
                         *           "asin": null,
                         *           "epid": null,
                         *           "priceChartingId": "4954135",
                         *           "prisjaktId": null,
                         *           "lowestShopOffer": {
                         *             "shop": {
                         *               "technicalName": "shinycards",
                         *               "name": "Shinycards"
                         *             },
                         *             "url": "https://www.shinycards.se/pokemon/singles-loskort/kopia-bulbasaur-reverse-holo-mew001-black-star-promo-pokemon-scarlet-violet-151",
                         *             "price": 29,
                         *             "currency": "SEK",
                         *             "inStock": true,
                         *             "inPreorder": false,
                         *             "inMonitor": false,
                         *             "isFullyBooked": false,
                         *             "matchedAt": "2026-07-29T03:30:08.000Z",
                         *             "updatedAt": "2026-08-12T14:18:16.455Z",
                         *             "bargain": null
                         *           },
                         *           "referencePriceSnapshotsByProvider": {
                         *             "tradera": {
                         *               "provider": "tradera",
                         *               "price": 55,
                         *               "currency": "SEK",
                         *               "priceSek": 55,
                         *               "snapshotDate": "2026-07-26T00:00:00.000Z"
                         *             }
                         *           }
                         *         },
                         *         {
                         *           "id": "684aea450554072ffe597b3c",
                         *           "kind": "sealed",
                         *           "name": "Scarlet & Violet Stellar Crown Booster Pack",
                         *           "shortName": "Stellar Crown Booster Pack",
                         *           "technicalName": "scarlet-violet-stellar-crown-booster-pack",
                         *           "brand": {
                         *             "id": "6841cfd656b8f021ecb0483b",
                         *             "name": "Pokémon",
                         *             "technicalName": "pokemon",
                         *             "createdAt": "2025-06-05T17:11:50.316Z",
                         *             "updatedAt": "2025-06-05T17:11:50.316Z"
                         *           },
                         *           "manufacturer": "Pokemon",
                         *           "modelNumber": "7418479",
                         *           "category": {
                         *             "id": "6841d175d5919761e8ec14ed",
                         *             "name": "Booster Pack",
                         *             "technicalName": "booster-pack"
                         *           },
                         *           "expansion": {
                         *             "id": "684add666f3d257c659c73c1",
                         *             "name": "Scarlet & Violet Stellar Crown",
                         *             "shortName": "Stellar Crown",
                         *             "technicalName": "eng-scarlet-violet-stellar-crown",
                         *             "language": "ENG",
                         *             "code": "sv7",
                         *             "cardCode": "SCR",
                         *             "seriesName": "Scarlet & Violet",
                         *             "releaseDate": "2024-09-13T00:00:00.000Z",
                         *             "logoUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/eng-scarlet-violet-stellar-crown-logo.png",
                         *             "symbolUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/eng-scarlet-violet-stellar-crown-symbol.png",
                         *             "imageUrl": null
                         *           },
                         *           "language": "ENG",
                         *           "alternativeNames": [
                         *             {
                         *               "name": "Scarlet & Violet Stellar Crown Booster",
                         *               "shortName": "Stellar Crown Booster"
                         *             }
                         *           ],
                         *           "supportsMultipackPricing": true,
                         *           "imageUrl": "https://ik.imagekit.io/xgtytqdnv/products/eng-scarlet-violet-stellar-crown-booster-pack.png",
                         *           "retailPrice": 104.33,
                         *           "estimatedValue": 129,
                         *           "shopCount": 7,
                         *           "pricingDataPoints": 3,
                         *           "pricingUpdatedAt": "2026-08-12T09:00:01.416Z",
                         *           "createdAt": "2025-06-12T14:55:01.197Z",
                         *           "updatedAt": "2026-08-12T09:00:01.623Z",
                         *           "upc": null,
                         *           "asin": null,
                         *           "epid": null,
                         *           "priceChartingId": "7418479",
                         *           "prisjaktId": null,
                         *           "lowestShopOffer": {
                         *             "shop": {
                         *               "technicalName": "swepoke",
                         *               "name": "Swepoke"
                         *             },
                         *             "url": "https://www.swepoke.se/swepoke-live/stellar-crown-booster-pack-live-max-5-per-kund",
                         *             "price": 75,
                         *             "currency": "SEK",
                         *             "inStock": true,
                         *             "inPreorder": false,
                         *             "inMonitor": false,
                         *             "isFullyBooked": false,
                         *             "matchedAt": "2026-04-03T16:17:54.000Z",
                         *             "updatedAt": "2026-08-12T14:18:16.455Z",
                         *             "bargain": null
                         *           },
                         *           "referencePriceSnapshotsByProvider": {
                         *             "cardmarket": {
                         *               "provider": "cardmarket",
                         *               "price": 5.49,
                         *               "currency": "EUR",
                         *               "priceSek": 60.19,
                         *               "snapshotDate": "2026-08-12T00:00:00.000Z"
                         *             },
                         *             "tradera": {
                         *               "provider": "tradera",
                         *               "price": 110,
                         *               "currency": "SEK",
                         *               "priceSek": 110,
                         *               "snapshotDate": "2026-05-17T00:00:00.000Z"
                         *             }
                         *           }
                         *         },
                         *         {
                         *           "id": "684aea450554072ffe597b34",
                         *           "kind": "sealed",
                         *           "name": "Scarlet & Violet Obsidian Flames Booster Pack",
                         *           "shortName": "Obsidian Flames Booster Pack",
                         *           "technicalName": "scarlet-violet-obsidian-flames-booster-pack",
                         *           "brand": {
                         *             "id": "6841cfd656b8f021ecb0483b",
                         *             "name": "Pokémon",
                         *             "technicalName": "pokemon",
                         *             "createdAt": "2025-06-05T17:11:50.316Z",
                         *             "updatedAt": "2025-06-05T17:11:50.316Z"
                         *           },
                         *           "manufacturer": "Pokemon",
                         *           "modelNumber": "5605517",
                         *           "category": {
                         *             "id": "6841d175d5919761e8ec14ed",
                         *             "name": "Booster Pack",
                         *             "technicalName": "booster-pack"
                         *           },
                         *           "expansion": {
                         *             "id": "684add666f3d257c659c73b3",
                         *             "name": "Scarlet & Violet Obsidian Flames",
                         *             "shortName": "Obsidian Flames",
                         *             "technicalName": "eng-scarlet-violet-obsidian-flames",
                         *             "language": "ENG",
                         *             "code": "sv3",
                         *             "cardCode": "OBF",
                         *             "seriesName": "Scarlet & Violet",
                         *             "releaseDate": "2023-08-11T00:00:00.000Z",
                         *             "logoUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/eng-scarlet-violet-obsidian-flames-logo.png",
                         *             "symbolUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/eng-scarlet-violet-obsidian-flames-symbol.png",
                         *             "imageUrl": null
                         *           },
                         *           "language": "ENG",
                         *           "alternativeNames": [
                         *             {
                         *               "name": "Scarlet & Violet Obsidian Flames Booster",
                         *               "shortName": "Obsidian Flames Booster"
                         *             }
                         *           ],
                         *           "supportsMultipackPricing": true,
                         *           "imageUrl": "https://ik.imagekit.io/xgtytqdnv/products/eng-scarlet-violet-obsidian-flames-booster-pack.png",
                         *           "retailPrice": 125.67,
                         *           "estimatedValue": 105.07,
                         *           "shopCount": 5,
                         *           "pricingDataPoints": 12,
                         *           "pricingUpdatedAt": "2026-08-12T09:00:01.416Z",
                         *           "createdAt": "2025-06-12T14:55:01.191Z",
                         *           "updatedAt": "2026-08-12T09:00:01.623Z",
                         *           "upc": null,
                         *           "asin": null,
                         *           "epid": null,
                         *           "priceChartingId": "5605517",
                         *           "prisjaktId": null,
                         *           "lowestShopOffer": {
                         *             "shop": {
                         *               "technicalName": "cardlevels",
                         *               "name": "Cardlevels"
                         *             },
                         *             "url": "https://cardlevels.se/products/pokemon-tcg-scarlet-violet-obsidian-flames-booster-pack",
                         *             "price": 99,
                         *             "currency": "SEK",
                         *             "inStock": true,
                         *             "inPreorder": false,
                         *             "inMonitor": false,
                         *             "isFullyBooked": false,
                         *             "matchedAt": "2026-03-11T04:45:03.000Z",
                         *             "updatedAt": "2026-08-12T14:18:16.454Z",
                         *             "bargain": null
                         *           },
                         *           "referencePriceSnapshotsByProvider": {
                         *             "tradera": {
                         *               "provider": "tradera",
                         *               "price": 94.33,
                         *               "currency": "SEK",
                         *               "priceSek": 94.33,
                         *               "snapshotDate": "2026-08-09T00:00:00.000Z"
                         *             },
                         *             "cardmarket": {
                         *               "provider": "cardmarket",
                         *               "price": 6.9,
                         *               "currency": "EUR",
                         *               "priceSek": 75.65,
                         *               "snapshotDate": "2026-08-12T00:00:00.000Z"
                         *             }
                         *           }
                         *         }
                         *       ],
                         *       "pagination": {
                         *         "total": 40,
                         *         "limit": 3,
                         *         "skip": 16,
                         *         "hasMore": true
                         *       }
                         *     }
                         */
                        "application/json": {
                            data?: components["schemas"]["ProductWithPricing"][];
                            pagination?: components["schemas"]["PageMeta"];
                        };
                    };
                };
                /** @description Invalid query parameters */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/product/{id}/matches": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get shop matches for a product
         * @description The latest match per shop for this product — the current shop price. History across time is the `premium` level's `/shop-match-stats` surface.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Keep only matches whose shop currently has stock */
                    inStock?: boolean;
                    limit?: number;
                    skip?: number;
                    cardType?: "loose" | "graded";
                    condition?: string;
                    gradingCompany?: "PSA" | "BGS" | "CGC" | "SGC" | "ACE" | "RAUKCARD";
                    grade?: number;
                };
                header?: never;
                path: {
                    /** @description Product _id or technicalName */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Shop matches for the item */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "item": {
                         *         "id": "684aea450554072ffe597b44",
                         *         "name": "Scarlet & Violet Booster Pack"
                         *       },
                         *       "data": [
                         *         {
                         *           "id": "6a6973c2de85705573238e68",
                         *           "shop": {
                         *             "technicalName": "shinycards",
                         *             "name": "Shinycards",
                         *             "delivery": {
                         *               "cost": null,
                         *               "currency": null,
                         *               "daysMin": null,
                         *               "daysMax": null,
                         *               "freeShippingThreshold": null,
                         *               "supportsLocalPickup": null,
                         *               "note": null
                         *             }
                         *           },
                         *           "url": "https://www.shinycards.se/pokemon/singles-loskort/kopia-bulbasaur-reverse-holo-mew001-black-star-promo-pokemon-scarlet-violet-151",
                         *           "shopUrlId": "69a8b1e41ccaaebe3996954d",
                         *           "price": 29,
                         *           "currency": "SEK",
                         *           "inStock": true,
                         *           "inPreorder": false,
                         *           "inMonitor": false,
                         *           "isFullyBooked": false,
                         *           "scrapedName": "Squirtle Reverse Holo - MEW007 Black Star Promo - Pokémon Scarlet & Violet: 151",
                         *           "scrapedType": "Pokemon TCG",
                         *           "matchScore": 15,
                         *           "hasCategoryMismatch": false,
                         *           "cardType": null,
                         *           "itemCondition": null,
                         *           "gradingCompany": null,
                         *           "grade": null,
                         *           "matchedAt": "2026-07-29T03:30:08.000Z",
                         *           "updatedAt": "2026-08-12T14:18:16.455Z",
                         *           "bargain": null
                         *         },
                         *         {
                         *           "id": "6a69a8cbde85705573238fe4",
                         *           "shop": {
                         *             "technicalName": "swepoke",
                         *             "name": "Swepoke",
                         *             "delivery": {
                         *               "cost": null,
                         *               "currency": null,
                         *               "daysMin": null,
                         *               "daysMax": null,
                         *               "freeShippingThreshold": null,
                         *               "supportsLocalPickup": null,
                         *               "note": null
                         *             }
                         *           },
                         *           "url": "https://www.swepoke.se/pokemon/singles-and-graded-cards/mimikyu-ex-scarlet-violet-promos-svp-004",
                         *           "shopUrlId": "69cb750b98a46fed36b8a138",
                         *           "price": 30,
                         *           "currency": "SEK",
                         *           "inStock": false,
                         *           "inPreorder": false,
                         *           "inMonitor": false,
                         *           "isFullyBooked": false,
                         *           "scrapedName": "Mimikyu ex Scarlet & Violet Promos SVP 004",
                         *           "scrapedType": "Pokemon TCG",
                         *           "matchScore": 15,
                         *           "hasCategoryMismatch": false,
                         *           "cardType": null,
                         *           "itemCondition": null,
                         *           "gradingCompany": null,
                         *           "grade": null,
                         *           "matchedAt": "2026-07-29T07:16:15.000Z",
                         *           "updatedAt": "2026-08-12T14:18:16.455Z",
                         *           "bargain": null
                         *         },
                         *         {
                         *           "id": "6a68b919de85705573237cb5",
                         *           "shop": {
                         *             "technicalName": "poketalk",
                         *             "name": "Poketalk",
                         *             "delivery": {
                         *               "cost": null,
                         *               "currency": null,
                         *               "daysMin": 3,
                         *               "daysMax": 5,
                         *               "freeShippingThreshold": null,
                         *               "supportsLocalPickup": null,
                         *               "note": null
                         *             }
                         *           },
                         *           "url": "https://www.poketalk.se/products/pokemon-scarlet-violet-booster-pack-kop-nu-hos-poketalk",
                         *           "shopUrlId": "69a8b1e31ccaaebe399692c1",
                         *           "price": 79,
                         *           "currency": "SEK",
                         *           "inStock": false,
                         *           "inPreorder": false,
                         *           "inMonitor": false,
                         *           "isFullyBooked": false,
                         *           "scrapedName": "Pokémon Scarlet & Violet: Base Booster Pack",
                         *           "scrapedType": "Booster Pack",
                         *           "matchScore": 40,
                         *           "hasCategoryMismatch": false,
                         *           "cardType": null,
                         *           "itemCondition": null,
                         *           "gradingCompany": null,
                         *           "grade": null,
                         *           "matchedAt": "2026-07-28T14:12:30.000Z",
                         *           "updatedAt": "2026-08-12T14:18:16.455Z",
                         *           "bargain": null
                         *         }
                         *       ],
                         *       "pagination": {
                         *         "total": 5,
                         *         "limit": 20,
                         *         "skip": 0,
                         *         "hasMore": false
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ItemShopMatches"];
                    };
                };
                /** @description Product not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/product/{id}/reference-prices": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get the cmapi reference price history (cardmarket/tcgplayer) for a sealed product
         * @description **Requires the `premium` level.** Daily reference prices ingested from cmapi, grouped into one series per price dimension. Sealed products have no graded/non-graded split, so `cardType` is null on every series. Prices are in each provider's native currency — no SEK conversion is applied.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Rolling window ending today. Ignored when from/to are supplied. */
                    days?: number;
                    from?: string;
                    to?: string;
                    provider?: "cardmarket" | "tcgplayer" | "ebay" | "tradera";
                };
                header?: never;
                path: {
                    /** @description Product _id or technicalName */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Grouped daily reference price series for the product */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "item": {
                         *         "id": "684aea450554072ffe597b44",
                         *         "name": "Scarlet & Violet Booster Pack"
                         *       },
                         *       "fromDate": "2026-05-15",
                         *       "toDate": "2026-08-12",
                         *       "metric": "price",
                         *       "currencyMode": "native",
                         *       "series": [
                         *         {
                         *           "source": "tradera",
                         *           "provider": "tradera",
                         *           "variant": null,
                         *           "cardType": null,
                         *           "gradingCompany": null,
                         *           "grade": null,
                         *           "currency": "SEK",
                         *           "sampleSize": 1,
                         *           "points": [
                         *             {
                         *               "snapshotDate": "2026-06-13T00:00:00.000Z",
                         *               "price": 92
                         *             },
                         *             {
                         *               "snapshotDate": "2026-06-14T00:00:00.000Z",
                         *               "price": 92
                         *             },
                         *             {
                         *               "snapshotDate": "2026-06-15T00:00:00.000Z",
                         *               "price": 92
                         *             }
                         *           ]
                         *         }
                         *       ]
                         *     }
                         */
                        "application/json": components["schemas"]["ItemReferencePrices"];
                    };
                };
                /** @description Invalid query parameters */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Product not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/product/{id}/prices": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get marketplace auction prices for a specific product
         * @description **Requires the `premium` level.** The same user JWT as any signed-in request, plus an active or trialing subscription — a valid token without one is answered 403 `premiumRequired`. A `ServiceToken` from `API_AUTH_TOKENS` is accepted in place of the subscription, so our own back-end services can read this without holding a seat.
         */
        get: {
            parameters: {
                query?: {
                    limit?: number;
                    skip?: number;
                };
                header?: never;
                path: {
                    /** @description Product _id or technicalName */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List of marketplace auction prices for the product */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "item": {
                         *         "id": "684aea450554072ffe597b44",
                         *         "name": "Scarlet & Violet Booster Pack"
                         *       },
                         *       "data": [
                         *         {
                         *           "id": "6a6fc2e157c75b8bf576c896",
                         *           "url": "https://www.tradera.com/item/741877926",
                         *           "price": 140,
                         *           "currency": "SEK",
                         *           "soldAt": "2026-08-02T17:34:03.000Z",
                         *           "itemId": "741877926",
                         *           "source": "tradera"
                         *         },
                         *         {
                         *           "id": "6a6fc30357c75b8bf576d2b3",
                         *           "url": "https://www.tradera.com/item/741453887",
                         *           "price": 65,
                         *           "currency": "SEK",
                         *           "soldAt": "2026-07-28T16:00:26.000Z",
                         *           "itemId": "741453887",
                         *           "source": "tradera"
                         *         },
                         *         {
                         *           "id": "6a6fc31557c75b8bf576d684",
                         *           "url": "https://www.tradera.com/item/741175540",
                         *           "price": 200,
                         *           "currency": "SEK",
                         *           "soldAt": "2026-07-26T17:43:59.000Z",
                         *           "itemId": "741175540",
                         *           "source": "tradera"
                         *         }
                         *       ],
                         *       "pagination": {
                         *         "total": 90,
                         *         "limit": 20,
                         *         "skip": 0,
                         *         "hasMore": true
                         *       },
                         *       "premiumRequired": true
                         *     }
                         */
                        "application/json": components["schemas"]["ItemSoldPrices"];
                    };
                };
                /** @description Missing or invalid bearer token */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Valid token but no active Premium subscription */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Product not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Rate limit exceeded */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/product/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a product by id or technical name */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Product _id or technicalName */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description The product, with its cached pricing */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "id": "684aea450554072ffe597b44",
                         *       "kind": "sealed",
                         *       "name": "Scarlet & Violet Booster Pack",
                         *       "shortName": "Scarlet & Violet Booster Pack",
                         *       "technicalName": "scarlet-violet-booster-pack",
                         *       "brand": {
                         *         "id": "6841cfd656b8f021ecb0483b",
                         *         "name": "Pokémon",
                         *         "technicalName": "pokemon",
                         *         "createdAt": "2025-06-05T17:11:50.316Z",
                         *         "updatedAt": "2025-06-05T17:11:50.316Z"
                         *       },
                         *       "manufacturer": "Pokemon",
                         *       "modelNumber": "4954135",
                         *       "category": {
                         *         "id": "6841d175d5919761e8ec14ed",
                         *         "name": "Booster Pack",
                         *         "technicalName": "booster-pack"
                         *       },
                         *       "expansion": {
                         *         "id": "684add666f3d257c659c73ad",
                         *         "name": "Scarlet & Violet Scarlet & Violet",
                         *         "shortName": "Scarlet & Violet",
                         *         "technicalName": "eng-scarlet-violet-scarlet-violet",
                         *         "language": "ENG",
                         *         "code": "sv1",
                         *         "cardCode": "SVI",
                         *         "seriesName": "Scarlet & Violet",
                         *         "releaseDate": "2023-03-31T00:00:00.000Z",
                         *         "logoUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/eng-scarlet-violet-scarlet-violet-logo.png",
                         *         "symbolUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/eng-scarlet-violet-scarlet-violet-symbol.png",
                         *         "imageUrl": null
                         *       },
                         *       "language": "ENG",
                         *       "alternativeNames": [
                         *         {
                         *           "name": "Scarlet & Violet Booster (6 Cards)",
                         *           "shortName": "Scarlet & Violet Booster (6 Cards)"
                         *         }
                         *       ],
                         *       "supportsMultipackPricing": true,
                         *       "imageUrl": "https://ik.imagekit.io/xgtytqdnv/products/eng-scarlet-violet-booster-pack.png",
                         *       "retailPrice": 65.67,
                         *       "estimatedValue": 138.75,
                         *       "shopCount": 5,
                         *       "pricingDataPoints": 4,
                         *       "pricingUpdatedAt": "2026-08-12T09:00:01.416Z",
                         *       "createdAt": "2025-06-12T14:55:01.203Z",
                         *       "updatedAt": "2026-08-12T09:00:01.623Z",
                         *       "upc": null,
                         *       "asin": null,
                         *       "epid": null,
                         *       "priceChartingId": "4954135",
                         *       "prisjaktId": null,
                         *       "lowestShopOffer": {
                         *         "shop": {
                         *           "technicalName": "shinycards",
                         *           "name": "Shinycards"
                         *         },
                         *         "url": "https://www.shinycards.se/pokemon/singles-loskort/kopia-bulbasaur-reverse-holo-mew001-black-star-promo-pokemon-scarlet-violet-151",
                         *         "price": 29,
                         *         "currency": "SEK",
                         *         "inStock": true,
                         *         "inPreorder": false,
                         *         "inMonitor": false,
                         *         "isFullyBooked": false,
                         *         "matchedAt": "2026-07-29T03:30:08.000Z",
                         *         "updatedAt": "2026-08-12T14:18:16.455Z",
                         *         "bargain": null
                         *       },
                         *       "referencePriceSnapshotsByProvider": {
                         *         "tradera": {
                         *           "provider": "tradera",
                         *           "price": 55,
                         *           "currency": "SEK",
                         *           "priceSek": 55,
                         *           "snapshotDate": "2026-07-26T00:00:00.000Z"
                         *         }
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ProductWithPricing"];
                    };
                };
                /** @description Product not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/product/{id}/pricing/live": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get freshly computed pricing for a product
         * @description Recomputes rather than reading the cached figures on the product. Signed-in users only, and rate limited to 30 requests per minute per client.
         *
         *     **Requires the `premium` level.** The same user JWT as any signed-in request, plus an active or trialing subscription — a valid token without one is answered 403 `premiumRequired`. A `ServiceToken` from `API_AUTH_TOKENS` is accepted in place of the subscription, so our own back-end services can read this without holding a seat.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Product _id or technicalName */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Live pricing for the item */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "id": "684aea450554072ffe597b44",
                         *       "name": "Scarlet & Violet Booster Pack",
                         *       "technicalName": "scarlet-violet-booster-pack",
                         *       "pricing": {
                         *         "retailPrice": 49,
                         *         "estimatedValue": 138.75,
                         *         "shopCount": 5,
                         *         "pricingDataPoints": 4,
                         *         "calculatedAt": "2026-08-12T16:46:14.807Z"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["LivePricingForItem"];
                    };
                };
                /** @description Missing or invalid bearer token */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Product not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Rate limit exceeded */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/shop-match-stats/product/{productId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get price history across all shops for a product
         * @description **Requires the `premium` level.** The same user JWT as any signed-in request, plus an active or trialing subscription — a valid token without one is answered 403 `premiumRequired`. A `ServiceToken` from `API_AUTH_TOKENS` is accepted in place of the subscription, so our own back-end services can read this without holding a seat.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Start date (YYYY-MM-DD) */
                    startDate?: string;
                    /** @description End date (YYYY-MM-DD) */
                    endDate?: string;
                    /** @description Filter by specific shop */
                    shop?: string;
                };
                header?: never;
                path: {
                    /** @description Product _id or technicalName */
                    productId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Price history for the product. Currently empty for every product in this database — the daily-stats aggregation job (see `/shop-match-stats/daily/update*`) has not been run recently, so the `ShopProductMatchDailyStats` collection has no documents yet. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "item": {
                         *         "id": "684aea450554072ffe597b44",
                         *         "name": "Scarlet & Violet Booster Pack"
                         *       },
                         *       "shops": [],
                         *       "recordCount": 0
                         *     }
                         */
                        "application/json": components["schemas"]["ItemShopPriceHistory"];
                    };
                };
                /** @description Missing or invalid bearer token */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Valid token but no active Premium subscription */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Product not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Rate limit exceeded */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/shop-match-stats/shop/{shop}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get price history for all products at a specific shop
         * @description **Requires the `premium` level.** The same user JWT as any signed-in request, plus an active or trialing subscription — a valid token without one is answered 403 `premiumRequired`. A `ServiceToken` from `API_AUTH_TOKENS` is accepted in place of the subscription, so our own back-end services can read this without holding a seat.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Start date (YYYY-MM-DD) */
                    startDate?: string;
                    /** @description End date (YYYY-MM-DD) */
                    endDate?: string;
                    /** @description Maximum products to return */
                    limit?: number;
                };
                header?: never;
                path: {
                    /** @description Shop identifier */
                    shop: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Price history for the shop. Currently empty for every shop in this database — the daily-stats aggregation job (see `/shop-match-stats/daily/update*`) has not been run recently, so the `ShopProductMatchDailyStats` collection has no documents yet. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "shop": "samlarhobby",
                         *       "items": [],
                         *       "itemCount": 0
                         *     }
                         */
                        "application/json": components["schemas"]["ShopPriceHistoryList"];
                    };
                };
                /** @description Missing or invalid bearer token */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Valid token but no active Premium subscription */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Rate limit exceeded */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/shop-match-stats/compare": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Compare prices for a product across multiple shops
         * @description **Requires the `premium` level.** The same user JWT as any signed-in request, plus an active or trialing subscription — a valid token without one is answered 403 `premiumRequired`. A `ServiceToken` from `API_AUTH_TOKENS` is accepted in place of the subscription, so our own back-end services can read this without holding a seat.
         */
        get: {
            parameters: {
                query: {
                    /** @description Product _id or technicalName */
                    productId: string;
                    /** @description Specific date to compare (defaults to latest) */
                    date?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Price comparison across shops. Currently empty for every product in this database — the daily-stats aggregation job (see `/shop-match-stats/daily/update*`) has not been run recently, so the `ShopProductMatchDailyStats` collection has no documents yet. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "item": {
                         *         "id": "684aea450554072ffe597b44",
                         *         "name": "Scarlet & Violet Booster Pack"
                         *       },
                         *       "items": [],
                         *       "stats": null
                         *     }
                         */
                        "application/json": components["schemas"]["ItemPriceComparison"];
                    };
                };
                /** @description Missing or invalid bearer token */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Valid token but no active Premium subscription */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Product not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Rate limit exceeded */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/shop-matches": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get all shop matches with optional filtering (returns latest per url+shop)
         * @description The latest match per shop url — the current shop price. History across time is the `premium` level's `/shop-match-stats` surface.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Filter by shop name */
                    shop?: string;
                    /** @description Filter by stock status */
                    inStock?: boolean;
                    /** @description Filter by whether product is linked */
                    linked?: boolean;
                    /** @description Maximum number of results */
                    limit?: number;
                    /** @description Number of results to skip */
                    skip?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Shop matches in the standard list envelope */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": [
                         *         {
                         *           "id": "6a64548fa84aaf948fe90529",
                         *           "shop": {
                         *             "technicalName": "poketalk",
                         *             "name": "Poketalk"
                         *           },
                         *           "url": "https://www.poketalk.se/products/pokemon-mega-evolution-pitch-black-booster-bundle",
                         *           "shopUrlId": "6a5be9eb021c705b6071ab37",
                         *           "price": 649,
                         *           "currency": "SEK",
                         *           "inStock": true,
                         *           "inPreorder": false,
                         *           "inMonitor": false,
                         *           "isFullyBooked": false,
                         *           "scrapedName": "Pokémon Mega & Evolution: Pitch Black Booster Bundle",
                         *           "scrapedType": "Booster Pack",
                         *           "matchScore": 30,
                         *           "hasCategoryMismatch": true,
                         *           "cardType": null,
                         *           "itemCondition": null,
                         *           "gradingCompany": null,
                         *           "grade": null,
                         *           "item": null,
                         *           "expansion": {
                         *             "id": "6a59f45a43df5e336e542eb1",
                         *             "name": "Mega Evolution Pitch Black",
                         *             "shortName": "Pitch Black",
                         *             "technicalName": "eng-mega-evolution-pitch-black",
                         *             "language": "ENG",
                         *             "code": "me5",
                         *             "cardCode": "PBL",
                         *             "seriesName": "Mega Evolution",
                         *             "releaseDate": "2026-07-17T00:00:00.000Z",
                         *             "logoUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/eng-mega-evolution-pitch-black-logo.png",
                         *             "symbolUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/eng-mega-evolution-pitch-black-symbol.png",
                         *             "imageUrl": null
                         *           },
                         *           "category": {
                         *             "id": "684aea420554072ffe5979a1",
                         *             "name": "Booster Bundle",
                         *             "technicalName": "booster-bundle"
                         *           },
                         *           "matchedAt": "2026-07-23T06:15:35.000Z",
                         *           "updatedAt": "2026-08-12T15:37:24.715Z",
                         *           "bargain": null
                         *         },
                         *         {
                         *           "id": "6a631141a84aaf948fe8fca2",
                         *           "shop": {
                         *             "technicalName": "swepoke",
                         *             "name": "Swepoke"
                         *           },
                         *           "url": "https://www.swepoke.se/alla-produkter/pokemon-pitch-black-booster-bundle-forhandsbokning",
                         *           "shopUrlId": "6a631141a84aaf948fe8fca1",
                         *           "price": 499,
                         *           "currency": "SEK",
                         *           "inStock": true,
                         *           "inPreorder": false,
                         *           "inMonitor": false,
                         *           "isFullyBooked": false,
                         *           "scrapedName": "Pokemon Pitch Black Booster Bundle",
                         *           "scrapedType": "Booster Pack",
                         *           "matchScore": 30,
                         *           "hasCategoryMismatch": true,
                         *           "cardType": null,
                         *           "itemCondition": null,
                         *           "gradingCompany": null,
                         *           "grade": null,
                         *           "item": null,
                         *           "expansion": {
                         *             "id": "6a59f45a43df5e336e542eb1",
                         *             "name": "Mega Evolution Pitch Black",
                         *             "shortName": "Pitch Black",
                         *             "technicalName": "eng-mega-evolution-pitch-black",
                         *             "language": "ENG",
                         *             "code": "me5",
                         *             "cardCode": "PBL",
                         *             "seriesName": "Mega Evolution",
                         *             "releaseDate": "2026-07-17T00:00:00.000Z",
                         *             "logoUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/eng-mega-evolution-pitch-black-logo.png",
                         *             "symbolUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/eng-mega-evolution-pitch-black-symbol.png",
                         *             "imageUrl": null
                         *           },
                         *           "category": {
                         *             "id": "684aea420554072ffe5979a1",
                         *             "name": "Booster Bundle",
                         *             "technicalName": "booster-bundle"
                         *           },
                         *           "matchedAt": "2026-07-24T07:16:12.000Z",
                         *           "updatedAt": "2026-08-12T15:37:24.715Z",
                         *           "bargain": null
                         *         }
                         *       ],
                         *       "pagination": {
                         *         "total": 3533,
                         *         "limit": 3,
                         *         "skip": 0,
                         *         "hasMore": true
                         *       }
                         *     }
                         */
                        "application/json": {
                            data?: components["schemas"]["ShopMatchWithItem"][];
                            pagination?: components["schemas"]["PageMeta"];
                        };
                    };
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/shop-matches/shops": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get list of all shops with match counts (based on latest records only) */
        get: {
            parameters: {
                query?: {
                    /** @description Items per page */
                    limit?: number;
                    /** @description Rows to skip. Matches the `skip` returned in the pagination block. */
                    skip?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Shops with their match counts, in the standard list envelope */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": [
                         *         {
                         *           "shop": {
                         *             "technicalName": "alphaspel",
                         *             "name": "Alphaspel",
                         *             "logoUrl": null,
                         *             "websiteUrl": null,
                         *             "description": null,
                         *             "isActive": true,
                         *             "isTemporarilyClosed": false,
                         *             "isOptedOut": false,
                         *             "deliveryNote": null
                         *           },
                         *           "matchCount": 14,
                         *           "linkedMatchCount": 14,
                         *           "inStockCount": 10,
                         *           "preorderCount": 0,
                         *           "monitorCount": 0,
                         *           "fullyBookedCount": 0,
                         *           "lastMatchedAt": "2026-08-12T14:18:16.455Z"
                         *         },
                         *         {
                         *           "shop": {
                         *             "technicalName": "cardlevels",
                         *             "name": "Cardlevels",
                         *             "logoUrl": null,
                         *             "websiteUrl": null,
                         *             "description": null,
                         *             "isActive": true,
                         *             "isTemporarilyClosed": false,
                         *             "isOptedOut": false,
                         *             "deliveryNote": null
                         *           },
                         *           "matchCount": 28,
                         *           "linkedMatchCount": 28,
                         *           "inStockCount": 28,
                         *           "preorderCount": 0,
                         *           "monitorCount": 0,
                         *           "fullyBookedCount": 0,
                         *           "lastMatchedAt": "2026-08-12T14:18:16.455Z"
                         *         },
                         *         {
                         *           "shop": {
                         *             "technicalName": "coolcard",
                         *             "name": "Coolcard",
                         *             "logoUrl": null,
                         *             "websiteUrl": null,
                         *             "description": null,
                         *             "isActive": true,
                         *             "isTemporarilyClosed": false,
                         *             "isOptedOut": false,
                         *             "deliveryNote": null
                         *           },
                         *           "matchCount": 79,
                         *           "linkedMatchCount": 79,
                         *           "inStockCount": 62,
                         *           "preorderCount": 0,
                         *           "monitorCount": 0,
                         *           "fullyBookedCount": 0,
                         *           "lastMatchedAt": "2026-08-12T14:18:16.455Z"
                         *         }
                         *       ],
                         *       "pagination": {
                         *         "total": 18,
                         *         "limit": 3,
                         *         "skip": 0,
                         *         "hasMore": true
                         *       }
                         *     }
                         */
                        "application/json": {
                            data?: components["schemas"]["ShopMatchStats"][];
                            pagination?: components["schemas"]["PageMeta"];
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/shop-matches/{shop}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get all matches for a specific shop (returns latest per url)
         * @description The latest match per shop url — the current shop price. History across time is the `premium` level's `/shop-match-stats` surface.
         */
        get: {
            parameters: {
                query?: {
                    inStock?: boolean;
                    limit?: number;
                    skip?: number;
                };
                header?: never;
                path: {
                    shop: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Matches for the shop */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "shop": {
                         *         "technicalName": "samlarhobby",
                         *         "name": "Samlarhobby",
                         *         "logoUrl": null,
                         *         "websiteUrl": null,
                         *         "description": null,
                         *         "isActive": true,
                         *         "isTemporarilyClosed": false,
                         *         "isOptedOut": false,
                         *         "deliveryNote": null
                         *       },
                         *       "data": [
                         *         {
                         *           "id": "6a757f013f38ef493c70c060",
                         *           "shop": {
                         *             "technicalName": "samlarhobby",
                         *             "name": "Samlarhobby"
                         *           },
                         *           "url": "https://www.samlarhobby.se/products/blastoise-ex-mew-200-151",
                         *           "shopUrlId": "6a757f013f38ef493c70c05e",
                         *           "price": 1480,
                         *           "currency": "SEK",
                         *           "inStock": true,
                         *           "inPreorder": false,
                         *           "inMonitor": false,
                         *           "isFullyBooked": false,
                         *           "scrapedName": "Blastoise ex (MEW 200) 151",
                         *           "scrapedType": "Pokemon TCG",
                         *           "matchScore": 90,
                         *           "hasCategoryMismatch": false,
                         *           "cardType": null,
                         *           "itemCondition": null,
                         *           "gradingCompany": null,
                         *           "grade": null,
                         *           "item": null,
                         *           "expansion": {
                         *             "id": "684add666f3d257c659c73b5",
                         *             "name": "Scarlet & Violet 151",
                         *             "shortName": "151",
                         *             "technicalName": "eng-scarlet-violet-151",
                         *             "language": "ENG",
                         *             "code": "sv3pt5",
                         *             "cardCode": "MEW",
                         *             "seriesName": "Scarlet & Violet",
                         *             "releaseDate": "2023-09-22T00:00:00.000Z",
                         *             "logoUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/eng-scarlet-violet-151-logo.png",
                         *             "symbolUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/eng-scarlet-violet-151-symbol.png",
                         *             "imageUrl": null
                         *           },
                         *           "category": null,
                         *           "matchedAt": "2026-08-07T06:45:11.000Z",
                         *           "updatedAt": "2026-08-12T14:18:16.455Z",
                         *           "bargain": null
                         *         },
                         *         {
                         *           "id": "6a72dbffe3aad9ac35b8f991",
                         *           "shop": {
                         *             "technicalName": "samlarhobby",
                         *             "name": "Samlarhobby"
                         *           },
                         *           "url": "https://www.samlarhobby.se/products/bulbasaur-mep-037-mep-black-star-promos",
                         *           "shopUrlId": "6a61b872a84aaf948fe8f31d",
                         *           "price": 470,
                         *           "currency": "SEK",
                         *           "inStock": true,
                         *           "inPreorder": false,
                         *           "inMonitor": false,
                         *           "isFullyBooked": false,
                         *           "scrapedName": "Bulbasaur (MEP 037) MEP Black Star Promos",
                         *           "scrapedType": "Pokemon TCG",
                         *           "matchScore": 90,
                         *           "hasCategoryMismatch": false,
                         *           "cardType": null,
                         *           "itemCondition": null,
                         *           "gradingCompany": null,
                         *           "grade": null,
                         *           "item": null,
                         *           "expansion": {
                         *             "id": "6a5f8693d7d69cc373a5d751",
                         *             "name": "Mega Evolution MEP Black Star Promos",
                         *             "shortName": "MEP Black Star Promos",
                         *             "technicalName": "eng-mega-evolution-mep-black-star-promos",
                         *             "language": "ENG",
                         *             "code": "mep",
                         *             "cardCode": null,
                         *             "seriesName": "Mega Evolution",
                         *             "releaseDate": "2025-09-26T00:00:00.000Z",
                         *             "logoUrl": "https://ik.imagekit.io/xgtytqdnv/expansions/eng-mega-evolution-mep-black-star-promos-logo.png",
                         *             "symbolUrl": null,
                         *             "imageUrl": null
                         *           },
                         *           "category": {
                         *             "id": "6980884f100d0aea4dc3f5bd",
                         *             "name": "Pokemon",
                         *             "technicalName": "pokemon"
                         *           },
                         *           "matchedAt": "2026-08-05T06:45:09.000Z",
                         *           "updatedAt": "2026-08-12T14:18:16.455Z",
                         *           "bargain": null
                         *         }
                         *       ],
                         *       "pagination": {
                         *         "total": 123,
                         *         "limit": 3,
                         *         "skip": 0,
                         *         "hasMore": true
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ShopMatchesForShop"];
                    };
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiError"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/shop-urls/submit": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * User submits a shop URL for scraping
         * @description **Requires the `premium` level.** The same user JWT as any signed-in request, plus an active or trialing subscription — a valid token without one is answered 403 `premiumRequired`.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        url: string;
                        shop: string;
                    };
                };
            };
            responses: {
                /** @description URL submitted successfully */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ShopUrlMutationResult"];
                    };
                };
                /** @description Missing or invalid fields */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Premium subscription required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description URL already exists */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/shop-urls/{id}/product": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Manually assign a product to a shop URL (premium)
         * @description **Requires the `premium` level.** The same user JWT as any signed-in request, plus an active or trialing subscription — a valid token without one is answered 403 `premiumRequired`.
         */
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** @description MongoDB ObjectId of the product, or null to unlink */
                        productId: string;
                    };
                };
            };
            responses: {
                /** @description Product assigned successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ShopUrlMutationResult"];
                    };
                };
                /** @description Premium required */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description ShopUrl not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        trace?: never;
    };
    "/shops": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all shops */
        get: {
            parameters: {
                query?: {
                    /** @description Filter by active status */
                    active?: boolean;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List of all shops */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": [
                         *         {
                         *           "id": "697b8f1027d51753138bec76",
                         *           "name": "Alphaspel",
                         *           "technicalName": "alphaspel",
                         *           "websiteUrl": null,
                         *           "logoUrl": null,
                         *           "description": null,
                         *           "defaultDeliveryCost": null,
                         *           "deliveryCurrency": null,
                         *           "deliveryDaysMin": null,
                         *           "deliveryDaysMax": null,
                         *           "freeShippingThreshold": 1000,
                         *           "supportsLocalPickup": false,
                         *           "deliveryNote": null,
                         *           "isActive": true,
                         *           "isTemporarilyClosed": false,
                         *           "isOptedOut": false,
                         *           "matchCount": null,
                         *           "linkedMatchCount": null,
                         *           "inStockCount": null,
                         *           "preorderCount": null,
                         *           "monitorCount": null,
                         *           "fullyBookedCount": null,
                         *           "lastMatchedAt": "2026-01-29T16:47:12.000Z",
                         *           "createdAt": "2026-01-29T16:47:12.632Z",
                         *           "updatedAt": "2026-08-07T04:15:11.540Z"
                         *         },
                         *         {
                         *           "id": "697cec543e7640041a607161",
                         *           "name": "Cardlevels",
                         *           "technicalName": "cardlevels",
                         *           "websiteUrl": null,
                         *           "logoUrl": null,
                         *           "description": null,
                         *           "defaultDeliveryCost": null,
                         *           "deliveryCurrency": null,
                         *           "deliveryDaysMin": null,
                         *           "deliveryDaysMax": null,
                         *           "freeShippingThreshold": 2999,
                         *           "supportsLocalPickup": false,
                         *           "deliveryNote": null,
                         *           "isActive": true,
                         *           "isTemporarilyClosed": false,
                         *           "isOptedOut": false,
                         *           "matchCount": null,
                         *           "linkedMatchCount": null,
                         *           "inStockCount": null,
                         *           "preorderCount": null,
                         *           "monitorCount": null,
                         *           "fullyBookedCount": null,
                         *           "lastMatchedAt": "2026-01-30T17:37:24.000Z",
                         *           "createdAt": "2026-01-30T17:37:24.252Z",
                         *           "updatedAt": "2026-08-07T04:45:10.558Z"
                         *         },
                         *         {
                         *           "id": "697b8f1827d51753138bec7c",
                         *           "name": "Coolcard",
                         *           "technicalName": "coolcard",
                         *           "websiteUrl": null,
                         *           "logoUrl": null,
                         *           "description": null,
                         *           "defaultDeliveryCost": null,
                         *           "deliveryCurrency": null,
                         *           "deliveryDaysMin": null,
                         *           "deliveryDaysMax": null,
                         *           "freeShippingThreshold": null,
                         *           "supportsLocalPickup": false,
                         *           "deliveryNote": null,
                         *           "isActive": true,
                         *           "isTemporarilyClosed": false,
                         *           "isOptedOut": false,
                         *           "matchCount": null,
                         *           "linkedMatchCount": null,
                         *           "inStockCount": null,
                         *           "preorderCount": null,
                         *           "monitorCount": null,
                         *           "fullyBookedCount": null,
                         *           "lastMatchedAt": "2026-01-29T16:47:20.000Z",
                         *           "createdAt": "2026-01-29T16:47:20.368Z",
                         *           "updatedAt": "2026-01-29T16:47:20.368Z"
                         *         }
                         *       ],
                         *       "pagination": {
                         *         "total": 20,
                         *         "limit": 20,
                         *         "skip": 0,
                         *         "hasMore": false
                         *       }
                         *     }
                         */
                        "application/json": {
                            data?: components["schemas"]["Shop"][];
                            pagination?: components["schemas"]["PageMeta"];
                        };
                    };
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/shops/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a shop by ID or technical name */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Shop _id or technicalName */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Shop details */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "id": "697b8f1027d51753138bec76",
                         *       "name": "Alphaspel",
                         *       "technicalName": "alphaspel",
                         *       "websiteUrl": null,
                         *       "logoUrl": null,
                         *       "description": null,
                         *       "defaultDeliveryCost": null,
                         *       "deliveryCurrency": null,
                         *       "deliveryDaysMin": null,
                         *       "deliveryDaysMax": null,
                         *       "freeShippingThreshold": 1000,
                         *       "supportsLocalPickup": false,
                         *       "deliveryNote": null,
                         *       "isActive": true,
                         *       "isTemporarilyClosed": false,
                         *       "isOptedOut": false,
                         *       "matchCount": 14,
                         *       "linkedMatchCount": 14,
                         *       "inStockCount": 9,
                         *       "preorderCount": 0,
                         *       "monitorCount": 0,
                         *       "fullyBookedCount": 0,
                         *       "lastMatchedAt": "2026-08-12T14:18:16.455Z",
                         *       "createdAt": "2026-01-29T16:47:12.632Z",
                         *       "updatedAt": "2026-08-07T04:15:11.540Z"
                         *     }
                         */
                        "application/json": components["schemas"]["Shop"];
                    };
                };
                /** @description Shop not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Platform overview counts
         * @description Aggregate document counts across the platform. All values are raw (unrounded); the UI rounds them for display.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Platform counts */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "shopCount": 20,
                         *       "categoryCount": 377,
                         *       "expansionCount": 524,
                         *       "productCount": 9759,
                         *       "priceCount": 523374
                         *     }
                         */
                        "application/json": components["schemas"]["PlatformStats"];
                    };
                };
                /** @description Server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        ApiError: {
            error: {
                /** @enum {string} */
                code: "validationFailed" | "unauthorized" | "forbidden" | "notFound" | "conflict" | "readOnlyField" | "rateLimited" | "premiumRequired" | "internalError";
                message: string;
                details: unknown;
            };
        };
        BargainListResponse: {
            data: {
                url: string;
                /** @example 149.5 */
                price: number | undefined;
                /**
                 * @description ISO-4217 currency code
                 * @example SEK
                 */
                currency: string | undefined;
                shop: {
                    /** @example cardlevels */
                    technicalName: string;
                    /** @example Cardlevels */
                    name: string;
                };
                inStock: boolean;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                matchedAt: string;
                product: {
                    /**
                     * @description Resource identifier
                     * @example 6a577711abc1ce71383d3e10
                     */
                    id: string;
                    /** @enum {string} */
                    kind: "sealed" | "card";
                    name: string;
                    technicalName: string;
                    imageUrl: string | undefined;
                };
                bargain: {
                    discountPercent: number;
                    /** @enum {string} */
                    referenceSource: "retail" | "tradera" | "cardmarket";
                };
            }[];
            pagination: {
                /** @description Total matching records, ignoring pagination */
                total: number;
                limit: number;
                skip: number;
                hasMore: boolean;
            };
        };
        BargainSearchResponse: {
            data: {
                url: string;
                /** @example 149.5 */
                price: number | undefined;
                /**
                 * @description ISO-4217 currency code
                 * @example SEK
                 */
                currency: string | undefined;
                shop: {
                    /** @example cardlevels */
                    technicalName: string;
                    /** @example Cardlevels */
                    name: string;
                };
                inStock: boolean;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                matchedAt: string;
                product: {
                    /**
                     * @description Resource identifier
                     * @example 6a577711abc1ce71383d3e10
                     */
                    id: string;
                    /** @enum {string} */
                    kind: "sealed" | "card";
                    name: string;
                    technicalName: string;
                    imageUrl: string | undefined;
                };
                bargain: {
                    discountPercent: number;
                    /** @enum {string} */
                    referenceSource: "retail" | "tradera" | "cardmarket";
                };
            }[];
            pagination: {
                /** @description Total matching records, ignoring pagination */
                total: number;
                limit: number;
                skip: number;
                hasMore: boolean;
            };
        };
        CardWithPricing: {
            /**
             * @description Resource identifier
             * @example 6a577711abc1ce71383d3e10
             */
            id: string;
            name: string;
            shortName: string | undefined;
            technicalName: string;
            brand: {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                /** @example Pokémon */
                name: string;
                /** @example pokemon */
                technicalName: string;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                createdAt: string;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                updatedAt: string;
            };
            manufacturer: string;
            modelNumber: string | undefined;
            category: {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                /** @example Booster Box */
                name: string;
                /** @example booster-box */
                technicalName: string;
            } | undefined;
            expansion: {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                /** @example Mega Evolution 30th Celebration */
                name: string;
                /** @example 30th Celebration */
                shortName: string;
                /** @example jpn-mega-evolution-30th-celebration */
                technicalName: string;
                /**
                 * @description Printing language of the item
                 * @example JPN
                 * @enum {string}
                 */
                language: "ENG" | "JPN" | "CHI";
                /** @example m6a */
                code: string | undefined;
                /** @example m6a */
                cardCode: string | undefined;
                /** @example Mega Evolution */
                seriesName: string | undefined;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                releaseDate: string | undefined;
                /**
                 * @description Absolute asset URL, or null when absent
                 * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                 */
                logoUrl: string | undefined;
                /**
                 * @description Absolute asset URL, or null when absent
                 * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                 */
                symbolUrl: string | undefined;
                /**
                 * @description Absolute asset URL, or null when absent
                 * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                 */
                imageUrl: string | undefined;
            } | undefined;
            /**
             * @description Printing language of the item
             * @example JPN
             * @enum {string|null}
             */
            language: "ENG" | "JPN" | "CHI" | undefined;
            alternativeNames: {
                name: string;
                shortName: string | undefined;
            }[];
            supportsMultipackPricing: boolean;
            /**
             * @description Absolute asset URL, or null when absent
             * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
             */
            imageUrl: string | undefined;
            /**
             * @description Cheapest current shop price, in SEK
             * @example 149.5
             */
            retailPrice: number | undefined;
            /**
             * @description Estimated market value, in SEK
             * @example 149.5
             */
            estimatedValue: number | undefined;
            /** @description Active shops currently tracking this item */
            shopCount: number;
            /** @description Observations the estimate rests on */
            pricingDataPoints: number;
            /**
             * Format: date-time
             * @example 2026-07-15T12:03:29.322Z
             */
            pricingUpdatedAt: string | undefined;
            /**
             * Format: date-time
             * @example 2026-07-15T12:03:29.322Z
             */
            createdAt: string;
            /**
             * Format: date-time
             * @example 2026-07-15T12:03:29.322Z
             */
            updatedAt: string;
            /** @enum {string} */
            kind: "card";
            /** @example 4/102 */
            cardNumber: string;
            /** @example Rare Holo */
            rarity: string | undefined;
            artist: string | undefined;
            cardmarketId: string | undefined;
            tcgplayerId: string | undefined;
            variants: {
                normal: boolean;
                holo: boolean;
                reverse: boolean;
                firstEdition: boolean;
                wPromo: boolean;
            } | undefined;
            prisjaktId: string | undefined;
            lowestShopOffer: {
                shop: {
                    /** @example cardlevels */
                    technicalName: string;
                    /** @example Cardlevels */
                    name: string;
                };
                url: string;
                /** @example 149.5 */
                price: number;
                /**
                 * @description ISO-4217 currency code
                 * @example SEK
                 */
                currency: string;
                inStock: boolean;
                inPreorder: boolean;
                inMonitor: boolean;
                isFullyBooked: boolean;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                matchedAt: string;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                updatedAt: string;
                bargain: {
                    discountPercent: number;
                    /** @enum {string} */
                    referenceSource: "retail" | "tradera" | "cardmarket";
                } | undefined;
            } | undefined;
            referencePriceSnapshotsByProvider: {
                [key: string]: {
                    /** @enum {string} */
                    provider: "cardmarket" | "tcgplayer" | "ebay" | "tradera";
                    /** @example 149.5 */
                    price: number;
                    /**
                     * @description ISO-4217 currency code
                     * @example SEK
                     */
                    currency: string;
                    /**
                     * @description price converted to SEK at the rate stored on the row
                     * @example 149.5
                     */
                    priceSek: number;
                    /**
                     * Format: date-time
                     * @example 2026-07-15T12:03:29.322Z
                     */
                    snapshotDate: string;
                };
            };
        };
        Expansion: {
            /**
             * @description Resource identifier
             * @example 6a577711abc1ce71383d3e10
             */
            id: string;
            /** @example Mega Evolution 30th Celebration */
            name: string;
            /** @example 30th Celebration */
            shortName: string;
            /** @example jpn-mega-evolution-30th-celebration */
            technicalName: string;
            /**
             * @description Printing language of the item
             * @example JPN
             * @enum {string}
             */
            language: "ENG" | "JPN" | "CHI";
            /** @example m6a */
            code: string | undefined;
            /** @example m6a */
            cardCode: string | undefined;
            /** @example Mega Evolution */
            seriesName: string | undefined;
            /**
             * Format: date-time
             * @example 2026-07-15T12:03:29.322Z
             */
            releaseDate: string | undefined;
            /**
             * @description Absolute asset URL, or null when absent
             * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
             */
            logoUrl: string | undefined;
            /**
             * @description Absolute asset URL, or null when absent
             * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
             */
            symbolUrl: string | undefined;
            /**
             * @description Absolute asset URL, or null when absent
             * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
             */
            imageUrl: string | undefined;
            year: number | undefined;
            brand: {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                /** @example Pokémon */
                name: string;
                /** @example pokemon */
                technicalName: string;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                createdAt: string;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                updatedAt: string;
            };
            alternativeNames: {
                name: string;
                shortName: string | undefined;
            }[];
            /** @description Sealed products in this expansion */
            sealedCount: number;
            /** @description Cards in this expansion */
            cardCount: number;
            /** @description Sealed products plus cards */
            productCount: number;
            /**
             * Format: date-time
             * @example 2026-07-15T12:03:29.322Z
             */
            createdAt: string;
            /**
             * Format: date-time
             * @example 2026-07-15T12:03:29.322Z
             */
            updatedAt: string;
        };
        ExpansionContents: {
            expansion: {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                /** @example Mega Evolution 30th Celebration */
                name: string;
                /** @example 30th Celebration */
                shortName: string;
                /** @example jpn-mega-evolution-30th-celebration */
                technicalName: string;
                /**
                 * @description Printing language of the item
                 * @example JPN
                 * @enum {string}
                 */
                language: "ENG" | "JPN" | "CHI";
                /** @example m6a */
                code: string | undefined;
                /** @example m6a */
                cardCode: string | undefined;
                /** @example Mega Evolution */
                seriesName: string | undefined;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                releaseDate: string | undefined;
                /**
                 * @description Absolute asset URL, or null when absent
                 * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                 */
                logoUrl: string | undefined;
                /**
                 * @description Absolute asset URL, or null when absent
                 * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                 */
                symbolUrl: string | undefined;
                /**
                 * @description Absolute asset URL, or null when absent
                 * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                 */
                imageUrl: string | undefined;
            };
            cards: {
                count: number;
                items: {
                    /**
                     * @description Resource identifier
                     * @example 6a577711abc1ce71383d3e10
                     */
                    id: string;
                    name: string;
                    shortName: string | undefined;
                    technicalName: string;
                    brand: {
                        /**
                         * @description Resource identifier
                         * @example 6a577711abc1ce71383d3e10
                         */
                        id: string;
                        /** @example Pokémon */
                        name: string;
                        /** @example pokemon */
                        technicalName: string;
                        /**
                         * Format: date-time
                         * @example 2026-07-15T12:03:29.322Z
                         */
                        createdAt: string;
                        /**
                         * Format: date-time
                         * @example 2026-07-15T12:03:29.322Z
                         */
                        updatedAt: string;
                    };
                    manufacturer: string;
                    modelNumber: string | undefined;
                    category: {
                        /**
                         * @description Resource identifier
                         * @example 6a577711abc1ce71383d3e10
                         */
                        id: string;
                        /** @example Booster Box */
                        name: string;
                        /** @example booster-box */
                        technicalName: string;
                    } | undefined;
                    expansion: {
                        /**
                         * @description Resource identifier
                         * @example 6a577711abc1ce71383d3e10
                         */
                        id: string;
                        /** @example Mega Evolution 30th Celebration */
                        name: string;
                        /** @example 30th Celebration */
                        shortName: string;
                        /** @example jpn-mega-evolution-30th-celebration */
                        technicalName: string;
                        /**
                         * @description Printing language of the item
                         * @example JPN
                         * @enum {string}
                         */
                        language: "ENG" | "JPN" | "CHI";
                        /** @example m6a */
                        code: string | undefined;
                        /** @example m6a */
                        cardCode: string | undefined;
                        /** @example Mega Evolution */
                        seriesName: string | undefined;
                        /**
                         * Format: date-time
                         * @example 2026-07-15T12:03:29.322Z
                         */
                        releaseDate: string | undefined;
                        /**
                         * @description Absolute asset URL, or null when absent
                         * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                         */
                        logoUrl: string | undefined;
                        /**
                         * @description Absolute asset URL, or null when absent
                         * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                         */
                        symbolUrl: string | undefined;
                        /**
                         * @description Absolute asset URL, or null when absent
                         * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                         */
                        imageUrl: string | undefined;
                    } | undefined;
                    /**
                     * @description Printing language of the item
                     * @example JPN
                     * @enum {string|null}
                     */
                    language: "ENG" | "JPN" | "CHI" | undefined;
                    alternativeNames: {
                        name: string;
                        shortName: string | undefined;
                    }[];
                    supportsMultipackPricing: boolean;
                    /**
                     * @description Absolute asset URL, or null when absent
                     * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                     */
                    imageUrl: string | undefined;
                    /**
                     * @description Cheapest current shop price, in SEK
                     * @example 149.5
                     */
                    retailPrice: number | undefined;
                    /**
                     * @description Estimated market value, in SEK
                     * @example 149.5
                     */
                    estimatedValue: number | undefined;
                    /** @description Active shops currently tracking this item */
                    shopCount: number;
                    /** @description Observations the estimate rests on */
                    pricingDataPoints: number;
                    /**
                     * Format: date-time
                     * @example 2026-07-15T12:03:29.322Z
                     */
                    pricingUpdatedAt: string | undefined;
                    /**
                     * Format: date-time
                     * @example 2026-07-15T12:03:29.322Z
                     */
                    createdAt: string;
                    /**
                     * Format: date-time
                     * @example 2026-07-15T12:03:29.322Z
                     */
                    updatedAt: string;
                    /** @enum {string} */
                    kind: "card";
                    /** @example 4/102 */
                    cardNumber: string;
                    /** @example Rare Holo */
                    rarity: string | undefined;
                    artist: string | undefined;
                    cardmarketId: string | undefined;
                    tcgplayerId: string | undefined;
                    variants: {
                        normal: boolean;
                        holo: boolean;
                        reverse: boolean;
                        firstEdition: boolean;
                        wPromo: boolean;
                    } | undefined;
                    prisjaktId: string | undefined;
                    lowestShopOffer: {
                        shop: {
                            /** @example cardlevels */
                            technicalName: string;
                            /** @example Cardlevels */
                            name: string;
                        };
                        url: string;
                        /** @example 149.5 */
                        price: number;
                        /**
                         * @description ISO-4217 currency code
                         * @example SEK
                         */
                        currency: string;
                        inStock: boolean;
                        inPreorder: boolean;
                        inMonitor: boolean;
                        isFullyBooked: boolean;
                        /**
                         * Format: date-time
                         * @example 2026-07-15T12:03:29.322Z
                         */
                        matchedAt: string;
                        /**
                         * Format: date-time
                         * @example 2026-07-15T12:03:29.322Z
                         */
                        updatedAt: string;
                        bargain: {
                            discountPercent: number;
                            /** @enum {string} */
                            referenceSource: "retail" | "tradera" | "cardmarket";
                        } | undefined;
                    } | undefined;
                    referencePriceSnapshotsByProvider: {
                        [key: string]: {
                            /** @enum {string} */
                            provider: "cardmarket" | "tcgplayer" | "ebay" | "tradera";
                            /** @example 149.5 */
                            price: number;
                            /**
                             * @description ISO-4217 currency code
                             * @example SEK
                             */
                            currency: string;
                            /**
                             * @description price converted to SEK at the rate stored on the row
                             * @example 149.5
                             */
                            priceSek: number;
                            /**
                             * Format: date-time
                             * @example 2026-07-15T12:03:29.322Z
                             */
                            snapshotDate: string;
                        };
                    };
                }[];
            };
            sealed: {
                count: number;
                items: {
                    /**
                     * @description Resource identifier
                     * @example 6a577711abc1ce71383d3e10
                     */
                    id: string;
                    name: string;
                    shortName: string | undefined;
                    technicalName: string;
                    brand: {
                        /**
                         * @description Resource identifier
                         * @example 6a577711abc1ce71383d3e10
                         */
                        id: string;
                        /** @example Pokémon */
                        name: string;
                        /** @example pokemon */
                        technicalName: string;
                        /**
                         * Format: date-time
                         * @example 2026-07-15T12:03:29.322Z
                         */
                        createdAt: string;
                        /**
                         * Format: date-time
                         * @example 2026-07-15T12:03:29.322Z
                         */
                        updatedAt: string;
                    };
                    manufacturer: string;
                    modelNumber: string | undefined;
                    category: {
                        /**
                         * @description Resource identifier
                         * @example 6a577711abc1ce71383d3e10
                         */
                        id: string;
                        /** @example Booster Box */
                        name: string;
                        /** @example booster-box */
                        technicalName: string;
                    } | undefined;
                    expansion: {
                        /**
                         * @description Resource identifier
                         * @example 6a577711abc1ce71383d3e10
                         */
                        id: string;
                        /** @example Mega Evolution 30th Celebration */
                        name: string;
                        /** @example 30th Celebration */
                        shortName: string;
                        /** @example jpn-mega-evolution-30th-celebration */
                        technicalName: string;
                        /**
                         * @description Printing language of the item
                         * @example JPN
                         * @enum {string}
                         */
                        language: "ENG" | "JPN" | "CHI";
                        /** @example m6a */
                        code: string | undefined;
                        /** @example m6a */
                        cardCode: string | undefined;
                        /** @example Mega Evolution */
                        seriesName: string | undefined;
                        /**
                         * Format: date-time
                         * @example 2026-07-15T12:03:29.322Z
                         */
                        releaseDate: string | undefined;
                        /**
                         * @description Absolute asset URL, or null when absent
                         * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                         */
                        logoUrl: string | undefined;
                        /**
                         * @description Absolute asset URL, or null when absent
                         * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                         */
                        symbolUrl: string | undefined;
                        /**
                         * @description Absolute asset URL, or null when absent
                         * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                         */
                        imageUrl: string | undefined;
                    } | undefined;
                    /**
                     * @description Printing language of the item
                     * @example JPN
                     * @enum {string|null}
                     */
                    language: "ENG" | "JPN" | "CHI" | undefined;
                    alternativeNames: {
                        name: string;
                        shortName: string | undefined;
                    }[];
                    supportsMultipackPricing: boolean;
                    /**
                     * @description Absolute asset URL, or null when absent
                     * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                     */
                    imageUrl: string | undefined;
                    /**
                     * @description Cheapest current shop price, in SEK
                     * @example 149.5
                     */
                    retailPrice: number | undefined;
                    /**
                     * @description Estimated market value, in SEK
                     * @example 149.5
                     */
                    estimatedValue: number | undefined;
                    /** @description Active shops currently tracking this item */
                    shopCount: number;
                    /** @description Observations the estimate rests on */
                    pricingDataPoints: number;
                    /**
                     * Format: date-time
                     * @example 2026-07-15T12:03:29.322Z
                     */
                    pricingUpdatedAt: string | undefined;
                    /**
                     * Format: date-time
                     * @example 2026-07-15T12:03:29.322Z
                     */
                    createdAt: string;
                    /**
                     * Format: date-time
                     * @example 2026-07-15T12:03:29.322Z
                     */
                    updatedAt: string;
                    /** @enum {string} */
                    kind: "sealed";
                    upc: string | undefined;
                    asin: string | undefined;
                    epid: string | undefined;
                    priceChartingId: string | undefined;
                    prisjaktId: string | undefined;
                    lowestShopOffer: {
                        shop: {
                            /** @example cardlevels */
                            technicalName: string;
                            /** @example Cardlevels */
                            name: string;
                        };
                        url: string;
                        /** @example 149.5 */
                        price: number;
                        /**
                         * @description ISO-4217 currency code
                         * @example SEK
                         */
                        currency: string;
                        inStock: boolean;
                        inPreorder: boolean;
                        inMonitor: boolean;
                        isFullyBooked: boolean;
                        /**
                         * Format: date-time
                         * @example 2026-07-15T12:03:29.322Z
                         */
                        matchedAt: string;
                        /**
                         * Format: date-time
                         * @example 2026-07-15T12:03:29.322Z
                         */
                        updatedAt: string;
                        bargain: {
                            discountPercent: number;
                            /** @enum {string} */
                            referenceSource: "retail" | "tradera" | "cardmarket";
                        } | undefined;
                    } | undefined;
                    referencePriceSnapshotsByProvider: {
                        [key: string]: {
                            /** @enum {string} */
                            provider: "cardmarket" | "tcgplayer" | "ebay" | "tradera";
                            /** @example 149.5 */
                            price: number;
                            /**
                             * @description ISO-4217 currency code
                             * @example SEK
                             */
                            currency: string;
                            /**
                             * @description price converted to SEK at the rate stored on the row
                             * @example 149.5
                             */
                            priceSek: number;
                            /**
                             * Format: date-time
                             * @example 2026-07-15T12:03:29.322Z
                             */
                            snapshotDate: string;
                        };
                    };
                }[];
            };
        };
        ExpansionLivePricing: {
            expansion: {
                technicalName: string;
            };
            items: {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                name: string;
                technicalName: string;
                pricing: {
                    /** @example 149.5 */
                    retailPrice: number | undefined;
                    /** @example 149.5 */
                    estimatedValue: number | undefined;
                    shopCount: number;
                    pricingDataPoints: number;
                    /**
                     * Format: date-time
                     * @example 2026-07-15T12:03:29.322Z
                     */
                    calculatedAt: string;
                };
            }[];
        };
        ItemDailyStats: {
            item: {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                name: string;
            };
            dailyStats: {
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                statDate: string;
                /** @example 149.5 */
                averagePrice: number;
            }[];
        };
        ItemEstimatedValue: {
            item: {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                name: string;
            };
            estimate: {
                /** @example 149.5 */
                estimatedValue: number | undefined;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                estimateUpdatedAt: string | undefined;
                dataPointCount: number;
            };
        };
        ItemFullStats: {
            item: {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                name: string;
                shortName: string | undefined;
                technicalName: string;
                brand: {
                    /**
                     * @description Resource identifier
                     * @example 6a577711abc1ce71383d3e10
                     */
                    id: string;
                    /** @example Pokémon */
                    name: string;
                    /** @example pokemon */
                    technicalName: string;
                    /**
                     * Format: date-time
                     * @example 2026-07-15T12:03:29.322Z
                     */
                    createdAt: string;
                    /**
                     * Format: date-time
                     * @example 2026-07-15T12:03:29.322Z
                     */
                    updatedAt: string;
                };
                manufacturer: string;
                modelNumber: string | undefined;
                category: {
                    /**
                     * @description Resource identifier
                     * @example 6a577711abc1ce71383d3e10
                     */
                    id: string;
                    /** @example Booster Box */
                    name: string;
                    /** @example booster-box */
                    technicalName: string;
                } | undefined;
                expansion: {
                    /**
                     * @description Resource identifier
                     * @example 6a577711abc1ce71383d3e10
                     */
                    id: string;
                    /** @example Mega Evolution 30th Celebration */
                    name: string;
                    /** @example 30th Celebration */
                    shortName: string;
                    /** @example jpn-mega-evolution-30th-celebration */
                    technicalName: string;
                    /**
                     * @description Printing language of the item
                     * @example JPN
                     * @enum {string}
                     */
                    language: "ENG" | "JPN" | "CHI";
                    /** @example m6a */
                    code: string | undefined;
                    /** @example m6a */
                    cardCode: string | undefined;
                    /** @example Mega Evolution */
                    seriesName: string | undefined;
                    /**
                     * Format: date-time
                     * @example 2026-07-15T12:03:29.322Z
                     */
                    releaseDate: string | undefined;
                    /**
                     * @description Absolute asset URL, or null when absent
                     * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                     */
                    logoUrl: string | undefined;
                    /**
                     * @description Absolute asset URL, or null when absent
                     * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                     */
                    symbolUrl: string | undefined;
                    /**
                     * @description Absolute asset URL, or null when absent
                     * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                     */
                    imageUrl: string | undefined;
                } | undefined;
                /**
                 * @description Printing language of the item
                 * @example JPN
                 * @enum {string|null}
                 */
                language: "ENG" | "JPN" | "CHI" | undefined;
                alternativeNames: {
                    name: string;
                    shortName: string | undefined;
                }[];
                supportsMultipackPricing: boolean;
                /**
                 * @description Absolute asset URL, or null when absent
                 * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                 */
                imageUrl: string | undefined;
                /**
                 * @description Cheapest current shop price, in SEK
                 * @example 149.5
                 */
                retailPrice: number | undefined;
                /**
                 * @description Estimated market value, in SEK
                 * @example 149.5
                 */
                estimatedValue: number | undefined;
                /** @description Active shops currently tracking this item */
                shopCount: number;
                /** @description Observations the estimate rests on */
                pricingDataPoints: number;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                pricingUpdatedAt: string | undefined;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                createdAt: string;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                updatedAt: string;
                /** @enum {string} */
                kind: "card";
                /** @example 4/102 */
                cardNumber: string;
                /** @example Rare Holo */
                rarity: string | undefined;
                artist: string | undefined;
                cardmarketId: string | undefined;
                tcgplayerId: string | undefined;
                variants: {
                    normal: boolean;
                    holo: boolean;
                    reverse: boolean;
                    firstEdition: boolean;
                    wPromo: boolean;
                } | undefined;
                prisjaktId: string | undefined;
            } | {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                name: string;
                shortName: string | undefined;
                technicalName: string;
                brand: {
                    /**
                     * @description Resource identifier
                     * @example 6a577711abc1ce71383d3e10
                     */
                    id: string;
                    /** @example Pokémon */
                    name: string;
                    /** @example pokemon */
                    technicalName: string;
                    /**
                     * Format: date-time
                     * @example 2026-07-15T12:03:29.322Z
                     */
                    createdAt: string;
                    /**
                     * Format: date-time
                     * @example 2026-07-15T12:03:29.322Z
                     */
                    updatedAt: string;
                };
                manufacturer: string;
                modelNumber: string | undefined;
                category: {
                    /**
                     * @description Resource identifier
                     * @example 6a577711abc1ce71383d3e10
                     */
                    id: string;
                    /** @example Booster Box */
                    name: string;
                    /** @example booster-box */
                    technicalName: string;
                } | undefined;
                expansion: {
                    /**
                     * @description Resource identifier
                     * @example 6a577711abc1ce71383d3e10
                     */
                    id: string;
                    /** @example Mega Evolution 30th Celebration */
                    name: string;
                    /** @example 30th Celebration */
                    shortName: string;
                    /** @example jpn-mega-evolution-30th-celebration */
                    technicalName: string;
                    /**
                     * @description Printing language of the item
                     * @example JPN
                     * @enum {string}
                     */
                    language: "ENG" | "JPN" | "CHI";
                    /** @example m6a */
                    code: string | undefined;
                    /** @example m6a */
                    cardCode: string | undefined;
                    /** @example Mega Evolution */
                    seriesName: string | undefined;
                    /**
                     * Format: date-time
                     * @example 2026-07-15T12:03:29.322Z
                     */
                    releaseDate: string | undefined;
                    /**
                     * @description Absolute asset URL, or null when absent
                     * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                     */
                    logoUrl: string | undefined;
                    /**
                     * @description Absolute asset URL, or null when absent
                     * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                     */
                    symbolUrl: string | undefined;
                    /**
                     * @description Absolute asset URL, or null when absent
                     * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                     */
                    imageUrl: string | undefined;
                } | undefined;
                /**
                 * @description Printing language of the item
                 * @example JPN
                 * @enum {string|null}
                 */
                language: "ENG" | "JPN" | "CHI" | undefined;
                alternativeNames: {
                    name: string;
                    shortName: string | undefined;
                }[];
                supportsMultipackPricing: boolean;
                /**
                 * @description Absolute asset URL, or null when absent
                 * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                 */
                imageUrl: string | undefined;
                /**
                 * @description Cheapest current shop price, in SEK
                 * @example 149.5
                 */
                retailPrice: number | undefined;
                /**
                 * @description Estimated market value, in SEK
                 * @example 149.5
                 */
                estimatedValue: number | undefined;
                /** @description Active shops currently tracking this item */
                shopCount: number;
                /** @description Observations the estimate rests on */
                pricingDataPoints: number;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                pricingUpdatedAt: string | undefined;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                createdAt: string;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                updatedAt: string;
                /** @enum {string} */
                kind: "sealed";
                upc: string | undefined;
                asin: string | undefined;
                epid: string | undefined;
                priceChartingId: string | undefined;
                prisjaktId: string | undefined;
            };
            stats: {
                dailyStats: {
                    /**
                     * Format: date-time
                     * @example 2026-07-15T12:03:29.322Z
                     */
                    statDate: string;
                    /** @example 149.5 */
                    averagePrice: number;
                }[];
                variantStats: {
                    /** @description Distinct cardType/condition/company/grade combinations */
                    variantCount: number;
                    looseCount: number;
                    gradedCount: number;
                };
            };
            estimate: {
                /** @example 149.5 */
                estimatedValue: number | undefined;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                estimateUpdatedAt: string | undefined;
                dataPointCount: number;
            };
            shopMatches: {
                data: {
                    /**
                     * @description Resource identifier
                     * @example 6a577711abc1ce71383d3e10
                     */
                    id: string;
                    shop: {
                        /** @example cardlevels */
                        technicalName: string;
                        /** @example Cardlevels */
                        name: string;
                        delivery: {
                            /** @example 149.5 */
                            cost: number | undefined;
                            currency: string | undefined;
                            daysMin: number | undefined;
                            daysMax: number | undefined;
                            /** @example 149.5 */
                            freeShippingThreshold: number | undefined;
                            supportsLocalPickup: boolean | undefined;
                            note: string | undefined;
                        };
                    };
                    url: string;
                    /**
                     * @description Resource identifier
                     * @example 6a577711abc1ce71383d3e10
                     */
                    shopUrlId: string | undefined;
                    /** @example 149.5 */
                    price: number | undefined;
                    /**
                     * @description ISO-4217 currency code
                     * @example SEK
                     */
                    currency: string | undefined;
                    inStock: boolean;
                    inPreorder: boolean;
                    inMonitor: boolean;
                    isFullyBooked: boolean;
                    scrapedName: string | undefined;
                    scrapedType: string | undefined;
                    matchScore: number | undefined;
                    hasCategoryMismatch: boolean;
                    /** @enum {string|null} */
                    cardType: "loose" | "graded" | undefined;
                    /** @enum {string|null} */
                    itemCondition: "NM" | "LP" | "MP" | "HP" | "DMG" | undefined;
                    /** @enum {string|null} */
                    gradingCompany: "PSA" | "BGS" | "CGC" | "SGC" | "ACE" | "RAUKCARD" | "TAG" | "GMA" | undefined;
                    grade: number | undefined;
                    /**
                     * Format: date-time
                     * @example 2026-07-15T12:03:29.322Z
                     */
                    matchedAt: string;
                    /**
                     * Format: date-time
                     * @example 2026-07-15T12:03:29.322Z
                     */
                    updatedAt: string;
                    bargain: {
                        discountPercent: number;
                        /** @enum {string} */
                        referenceSource: "retail" | "tradera" | "cardmarket";
                    } | undefined;
                }[];
                pagination: {
                    /** @description Total matching records, ignoring pagination */
                    total: number;
                    limit: number;
                    skip: number;
                    hasMore: boolean;
                };
            };
        };
        ItemPriceComparison: {
            item: {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                name: string;
            };
            items: {
                shop: string;
                /** @example 149.5 */
                price: number;
                /**
                 * @description ISO-4217 currency code
                 * @example SEK
                 */
                currency: string;
                inStock: boolean;
                url: string;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                snapshotDate: string;
            }[];
            stats: {
                /** @example 149.5 */
                lowestPrice: number;
                /** @example 149.5 */
                highestPrice: number;
                /** @example 149.5 */
                averagePrice: number;
                inStockCount: number;
            } | undefined;
        };
        ItemReferencePrices: {
            item: {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                name: string;
            };
            /**
             * Format: date-time
             * @example 2026-07-15T12:03:29.322Z
             */
            fromDate: string;
            /**
             * Format: date-time
             * @example 2026-07-15T12:03:29.322Z
             */
            toDate: string;
            /** @enum {string} */
            metric: "price" | "low" | "mid" | "high" | "avg" | "avg1" | "avg7" | "avg30" | "directLow";
            /** @enum {string} */
            currencyMode: "native" | "sek";
            series: {
                /** @enum {string} */
                source: "tcgdex" | "cmapi" | "tradera";
                /** @enum {string} */
                provider: "cardmarket" | "tcgplayer" | "ebay" | "tradera";
                /** @enum {string|null} */
                variant: "normal" | "holo" | "reverse" | undefined;
                /** @enum {string|null} */
                cardType: "loose" | "graded" | undefined;
                /** @enum {string|null} */
                gradingCompany: "PSA" | "BGS" | "CGC" | "SGC" | "ACE" | "RAUKCARD" | "TAG" | "GMA" | undefined;
                grade: number | undefined;
                currency: string;
                sampleSize: number | undefined;
                points: {
                    /**
                     * Format: date-time
                     * @example 2026-07-15T12:03:29.322Z
                     */
                    snapshotDate: string;
                    price: number;
                }[];
            }[];
        };
        ItemShopMatches: {
            item: {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                name: string;
            };
            data: {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                shop: {
                    /** @example cardlevels */
                    technicalName: string;
                    /** @example Cardlevels */
                    name: string;
                    delivery: {
                        /** @example 149.5 */
                        cost: number | undefined;
                        currency: string | undefined;
                        daysMin: number | undefined;
                        daysMax: number | undefined;
                        /** @example 149.5 */
                        freeShippingThreshold: number | undefined;
                        supportsLocalPickup: boolean | undefined;
                        note: string | undefined;
                    };
                };
                url: string;
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                shopUrlId: string | undefined;
                /** @example 149.5 */
                price: number | undefined;
                /**
                 * @description ISO-4217 currency code
                 * @example SEK
                 */
                currency: string | undefined;
                inStock: boolean;
                inPreorder: boolean;
                inMonitor: boolean;
                isFullyBooked: boolean;
                scrapedName: string | undefined;
                scrapedType: string | undefined;
                matchScore: number | undefined;
                hasCategoryMismatch: boolean;
                /** @enum {string|null} */
                cardType: "loose" | "graded" | undefined;
                /** @enum {string|null} */
                itemCondition: "NM" | "LP" | "MP" | "HP" | "DMG" | undefined;
                /** @enum {string|null} */
                gradingCompany: "PSA" | "BGS" | "CGC" | "SGC" | "ACE" | "RAUKCARD" | "TAG" | "GMA" | undefined;
                grade: number | undefined;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                matchedAt: string;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                updatedAt: string;
                bargain: {
                    discountPercent: number;
                    /** @enum {string} */
                    referenceSource: "retail" | "tradera" | "cardmarket";
                } | undefined;
            }[];
            pagination: {
                /** @description Total matching records, ignoring pagination */
                total: number;
                limit: number;
                skip: number;
                hasMore: boolean;
            };
        };
        ItemShopPriceHistory: {
            item: {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                name: string;
            };
            shops: {
                /** @description The shop's technicalName */
                shop: string;
                history: {
                    /**
                     * Format: date-time
                     * @example 2026-07-15T12:03:29.322Z
                     */
                    snapshotDate: string;
                    /** @example 149.5 */
                    price: number;
                    /**
                     * @description ISO-4217 currency code
                     * @example SEK
                     */
                    currency: string;
                    inStock: boolean;
                    url: string;
                }[];
            }[];
            recordCount: number;
        };
        ItemSoldPrices: {
            item: {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                name: string;
            };
            data: {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                url: string;
                /** @example 149.5 */
                price: number;
                /**
                 * @description ISO-4217 currency code
                 * @example SEK
                 */
                currency: string;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                soldAt: string | undefined;
                itemId: string | undefined;
                /** @example tradera */
                source: string | undefined;
            }[];
            pagination: {
                /** @description Total matching records, ignoring pagination */
                total: number;
                limit: number;
                skip: number;
                hasMore: boolean;
            };
            /** @enum {boolean} */
            premiumRequired: true;
        };
        ItemStats: {
            item: {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                name: string;
                shortName: string | undefined;
                technicalName: string;
                brand: {
                    /**
                     * @description Resource identifier
                     * @example 6a577711abc1ce71383d3e10
                     */
                    id: string;
                    /** @example Pokémon */
                    name: string;
                    /** @example pokemon */
                    technicalName: string;
                    /**
                     * Format: date-time
                     * @example 2026-07-15T12:03:29.322Z
                     */
                    createdAt: string;
                    /**
                     * Format: date-time
                     * @example 2026-07-15T12:03:29.322Z
                     */
                    updatedAt: string;
                };
                manufacturer: string;
                modelNumber: string | undefined;
                category: {
                    /**
                     * @description Resource identifier
                     * @example 6a577711abc1ce71383d3e10
                     */
                    id: string;
                    /** @example Booster Box */
                    name: string;
                    /** @example booster-box */
                    technicalName: string;
                } | undefined;
                expansion: {
                    /**
                     * @description Resource identifier
                     * @example 6a577711abc1ce71383d3e10
                     */
                    id: string;
                    /** @example Mega Evolution 30th Celebration */
                    name: string;
                    /** @example 30th Celebration */
                    shortName: string;
                    /** @example jpn-mega-evolution-30th-celebration */
                    technicalName: string;
                    /**
                     * @description Printing language of the item
                     * @example JPN
                     * @enum {string}
                     */
                    language: "ENG" | "JPN" | "CHI";
                    /** @example m6a */
                    code: string | undefined;
                    /** @example m6a */
                    cardCode: string | undefined;
                    /** @example Mega Evolution */
                    seriesName: string | undefined;
                    /**
                     * Format: date-time
                     * @example 2026-07-15T12:03:29.322Z
                     */
                    releaseDate: string | undefined;
                    /**
                     * @description Absolute asset URL, or null when absent
                     * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                     */
                    logoUrl: string | undefined;
                    /**
                     * @description Absolute asset URL, or null when absent
                     * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                     */
                    symbolUrl: string | undefined;
                    /**
                     * @description Absolute asset URL, or null when absent
                     * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                     */
                    imageUrl: string | undefined;
                } | undefined;
                /**
                 * @description Printing language of the item
                 * @example JPN
                 * @enum {string|null}
                 */
                language: "ENG" | "JPN" | "CHI" | undefined;
                alternativeNames: {
                    name: string;
                    shortName: string | undefined;
                }[];
                supportsMultipackPricing: boolean;
                /**
                 * @description Absolute asset URL, or null when absent
                 * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                 */
                imageUrl: string | undefined;
                /**
                 * @description Cheapest current shop price, in SEK
                 * @example 149.5
                 */
                retailPrice: number | undefined;
                /**
                 * @description Estimated market value, in SEK
                 * @example 149.5
                 */
                estimatedValue: number | undefined;
                /** @description Active shops currently tracking this item */
                shopCount: number;
                /** @description Observations the estimate rests on */
                pricingDataPoints: number;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                pricingUpdatedAt: string | undefined;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                createdAt: string;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                updatedAt: string;
                /** @enum {string} */
                kind: "card";
                /** @example 4/102 */
                cardNumber: string;
                /** @example Rare Holo */
                rarity: string | undefined;
                artist: string | undefined;
                cardmarketId: string | undefined;
                tcgplayerId: string | undefined;
                variants: {
                    normal: boolean;
                    holo: boolean;
                    reverse: boolean;
                    firstEdition: boolean;
                    wPromo: boolean;
                } | undefined;
                prisjaktId: string | undefined;
            } | {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                name: string;
                shortName: string | undefined;
                technicalName: string;
                brand: {
                    /**
                     * @description Resource identifier
                     * @example 6a577711abc1ce71383d3e10
                     */
                    id: string;
                    /** @example Pokémon */
                    name: string;
                    /** @example pokemon */
                    technicalName: string;
                    /**
                     * Format: date-time
                     * @example 2026-07-15T12:03:29.322Z
                     */
                    createdAt: string;
                    /**
                     * Format: date-time
                     * @example 2026-07-15T12:03:29.322Z
                     */
                    updatedAt: string;
                };
                manufacturer: string;
                modelNumber: string | undefined;
                category: {
                    /**
                     * @description Resource identifier
                     * @example 6a577711abc1ce71383d3e10
                     */
                    id: string;
                    /** @example Booster Box */
                    name: string;
                    /** @example booster-box */
                    technicalName: string;
                } | undefined;
                expansion: {
                    /**
                     * @description Resource identifier
                     * @example 6a577711abc1ce71383d3e10
                     */
                    id: string;
                    /** @example Mega Evolution 30th Celebration */
                    name: string;
                    /** @example 30th Celebration */
                    shortName: string;
                    /** @example jpn-mega-evolution-30th-celebration */
                    technicalName: string;
                    /**
                     * @description Printing language of the item
                     * @example JPN
                     * @enum {string}
                     */
                    language: "ENG" | "JPN" | "CHI";
                    /** @example m6a */
                    code: string | undefined;
                    /** @example m6a */
                    cardCode: string | undefined;
                    /** @example Mega Evolution */
                    seriesName: string | undefined;
                    /**
                     * Format: date-time
                     * @example 2026-07-15T12:03:29.322Z
                     */
                    releaseDate: string | undefined;
                    /**
                     * @description Absolute asset URL, or null when absent
                     * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                     */
                    logoUrl: string | undefined;
                    /**
                     * @description Absolute asset URL, or null when absent
                     * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                     */
                    symbolUrl: string | undefined;
                    /**
                     * @description Absolute asset URL, or null when absent
                     * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                     */
                    imageUrl: string | undefined;
                } | undefined;
                /**
                 * @description Printing language of the item
                 * @example JPN
                 * @enum {string|null}
                 */
                language: "ENG" | "JPN" | "CHI" | undefined;
                alternativeNames: {
                    name: string;
                    shortName: string | undefined;
                }[];
                supportsMultipackPricing: boolean;
                /**
                 * @description Absolute asset URL, or null when absent
                 * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                 */
                imageUrl: string | undefined;
                /**
                 * @description Cheapest current shop price, in SEK
                 * @example 149.5
                 */
                retailPrice: number | undefined;
                /**
                 * @description Estimated market value, in SEK
                 * @example 149.5
                 */
                estimatedValue: number | undefined;
                /** @description Active shops currently tracking this item */
                shopCount: number;
                /** @description Observations the estimate rests on */
                pricingDataPoints: number;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                pricingUpdatedAt: string | undefined;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                createdAt: string;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                updatedAt: string;
                /** @enum {string} */
                kind: "sealed";
                upc: string | undefined;
                asin: string | undefined;
                epid: string | undefined;
                priceChartingId: string | undefined;
                prisjaktId: string | undefined;
            };
            dailyStats: {
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                statDate: string;
                /** @example 149.5 */
                averagePrice: number;
            }[];
            estimate: {
                /** @example 149.5 */
                estimatedValue: number | undefined;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                estimateUpdatedAt: string | undefined;
                dataPointCount: number;
            };
            variantStats: {
                /** @description Distinct cardType/condition/company/grade combinations */
                variantCount: number;
                looseCount: number;
                gradedCount: number;
            };
        };
        ItemVariantDailyStats: {
            item: {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                name: string;
            };
            variant: {
                /** @enum {string|null} */
                cardType: "loose" | "graded" | undefined;
                /** @enum {string|null} */
                condition: "NM" | "LP" | "MP" | "HP" | "DMG" | undefined;
                /** @enum {string|null} */
                gradingCompany: "PSA" | "BGS" | "CGC" | "SGC" | "ACE" | "RAUKCARD" | "TAG" | "GMA" | undefined;
                grade: number | undefined;
            };
            dailyStats: {
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                statDate: string;
                /** @example 149.5 */
                averagePrice: number;
            }[];
        };
        ItemVariantStats: {
            item: {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                name: string;
            };
            variants: {
                loose: {
                    [key: string]: {
                        /** @example 149.5 */
                        averagePrice: number;
                        dataPointCount: number;
                        /**
                         * Format: date-time
                         * @example 2026-07-15T12:03:29.322Z
                         */
                        lastSaleDate: string;
                    };
                };
                graded: {
                    [key: string]: {
                        [key: string]: {
                            /** @example 149.5 */
                            averagePrice: number;
                            dataPointCount: number;
                            /**
                             * Format: date-time
                             * @example 2026-07-15T12:03:29.322Z
                             */
                            lastSaleDate: string;
                        };
                    };
                };
            };
        };
        LivePricingForItem: {
            /**
             * @description Resource identifier
             * @example 6a577711abc1ce71383d3e10
             */
            id: string;
            name: string;
            technicalName: string;
            pricing: {
                /** @example 149.5 */
                retailPrice: number | undefined;
                /** @example 149.5 */
                estimatedValue: number | undefined;
                shopCount: number;
                pricingDataPoints: number;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                calculatedAt: string;
            };
        };
        PackRate: {
            /**
             * @description Resource identifier
             * @example 6a577711abc1ce71383d3e10
             */
            id: string;
            expansion: {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                /** @example Mega Evolution 30th Celebration */
                name: string;
                /** @example 30th Celebration */
                shortName: string;
                /** @example jpn-mega-evolution-30th-celebration */
                technicalName: string;
                /**
                 * @description Printing language of the item
                 * @example JPN
                 * @enum {string}
                 */
                language: "ENG" | "JPN" | "CHI";
                /** @example m6a */
                code: string | undefined;
                /** @example m6a */
                cardCode: string | undefined;
                /** @example Mega Evolution */
                seriesName: string | undefined;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                releaseDate: string | undefined;
                /**
                 * @description Absolute asset URL, or null when absent
                 * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                 */
                logoUrl: string | undefined;
                /**
                 * @description Absolute asset URL, or null when absent
                 * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                 */
                symbolUrl: string | undefined;
                /**
                 * @description Absolute asset URL, or null when absent
                 * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                 */
                imageUrl: string | undefined;
            };
            buckets: {
                /** @example Double rare */
                rarity: string;
                /**
                 * @description Relative draw weight (normalised across buckets)
                 * @example 24
                 */
                weight: number;
            }[];
            /**
             * Format: date-time
             * @example 2026-07-15T12:03:29.322Z
             */
            createdAt: string;
            /**
             * Format: date-time
             * @example 2026-07-15T12:03:29.322Z
             */
            updatedAt: string;
        };
        PageMeta: {
            /** @description Total matching records, ignoring pagination */
            total: number;
            limit: number;
            skip: number;
            hasMore: boolean;
        };
        PlatformStats: {
            shopCount: number;
            categoryCount: number;
            expansionCount: number;
            productCount: number;
            priceCount: number;
        };
        ProductWithPricing: {
            /**
             * @description Resource identifier
             * @example 6a577711abc1ce71383d3e10
             */
            id: string;
            name: string;
            shortName: string | undefined;
            technicalName: string;
            brand: {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                /** @example Pokémon */
                name: string;
                /** @example pokemon */
                technicalName: string;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                createdAt: string;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                updatedAt: string;
            };
            manufacturer: string;
            modelNumber: string | undefined;
            category: {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                /** @example Booster Box */
                name: string;
                /** @example booster-box */
                technicalName: string;
            } | undefined;
            expansion: {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                /** @example Mega Evolution 30th Celebration */
                name: string;
                /** @example 30th Celebration */
                shortName: string;
                /** @example jpn-mega-evolution-30th-celebration */
                technicalName: string;
                /**
                 * @description Printing language of the item
                 * @example JPN
                 * @enum {string}
                 */
                language: "ENG" | "JPN" | "CHI";
                /** @example m6a */
                code: string | undefined;
                /** @example m6a */
                cardCode: string | undefined;
                /** @example Mega Evolution */
                seriesName: string | undefined;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                releaseDate: string | undefined;
                /**
                 * @description Absolute asset URL, or null when absent
                 * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                 */
                logoUrl: string | undefined;
                /**
                 * @description Absolute asset URL, or null when absent
                 * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                 */
                symbolUrl: string | undefined;
                /**
                 * @description Absolute asset URL, or null when absent
                 * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                 */
                imageUrl: string | undefined;
            } | undefined;
            /**
             * @description Printing language of the item
             * @example JPN
             * @enum {string|null}
             */
            language: "ENG" | "JPN" | "CHI" | undefined;
            alternativeNames: {
                name: string;
                shortName: string | undefined;
            }[];
            supportsMultipackPricing: boolean;
            /**
             * @description Absolute asset URL, or null when absent
             * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
             */
            imageUrl: string | undefined;
            /**
             * @description Cheapest current shop price, in SEK
             * @example 149.5
             */
            retailPrice: number | undefined;
            /**
             * @description Estimated market value, in SEK
             * @example 149.5
             */
            estimatedValue: number | undefined;
            /** @description Active shops currently tracking this item */
            shopCount: number;
            /** @description Observations the estimate rests on */
            pricingDataPoints: number;
            /**
             * Format: date-time
             * @example 2026-07-15T12:03:29.322Z
             */
            pricingUpdatedAt: string | undefined;
            /**
             * Format: date-time
             * @example 2026-07-15T12:03:29.322Z
             */
            createdAt: string;
            /**
             * Format: date-time
             * @example 2026-07-15T12:03:29.322Z
             */
            updatedAt: string;
            /** @enum {string} */
            kind: "sealed";
            upc: string | undefined;
            asin: string | undefined;
            epid: string | undefined;
            priceChartingId: string | undefined;
            prisjaktId: string | undefined;
            lowestShopOffer: {
                shop: {
                    /** @example cardlevels */
                    technicalName: string;
                    /** @example Cardlevels */
                    name: string;
                };
                url: string;
                /** @example 149.5 */
                price: number;
                /**
                 * @description ISO-4217 currency code
                 * @example SEK
                 */
                currency: string;
                inStock: boolean;
                inPreorder: boolean;
                inMonitor: boolean;
                isFullyBooked: boolean;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                matchedAt: string;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                updatedAt: string;
                bargain: {
                    discountPercent: number;
                    /** @enum {string} */
                    referenceSource: "retail" | "tradera" | "cardmarket";
                } | undefined;
            } | undefined;
            referencePriceSnapshotsByProvider: {
                [key: string]: {
                    /** @enum {string} */
                    provider: "cardmarket" | "tcgplayer" | "ebay" | "tradera";
                    /** @example 149.5 */
                    price: number;
                    /**
                     * @description ISO-4217 currency code
                     * @example SEK
                     */
                    currency: string;
                    /**
                     * @description price converted to SEK at the rate stored on the row
                     * @example 149.5
                     */
                    priceSek: number;
                    /**
                     * Format: date-time
                     * @example 2026-07-15T12:03:29.322Z
                     */
                    snapshotDate: string;
                };
            };
        };
        Shop: {
            /**
             * @description Resource identifier
             * @example 6a577711abc1ce71383d3e10
             */
            id: string;
            /** @example Cardlevels */
            name: string;
            /** @example cardlevels */
            technicalName: string;
            websiteUrl: string | undefined;
            /**
             * @description Absolute asset URL, or null when absent
             * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
             */
            logoUrl: string | undefined;
            description: string | undefined;
            /** @example 149.5 */
            defaultDeliveryCost: number | undefined;
            /**
             * @description ISO-4217, or null
             * @example SEK
             */
            deliveryCurrency: string | undefined;
            deliveryDaysMin: number | undefined;
            deliveryDaysMax: number | undefined;
            /** @example 149.5 */
            freeShippingThreshold: number | undefined;
            supportsLocalPickup: boolean;
            deliveryNote: string | undefined;
            isActive: boolean;
            isTemporarilyClosed: boolean;
            isOptedOut: boolean;
            matchCount: number | undefined;
            /** @description Matches resolved to a catalog item */
            linkedMatchCount: number | undefined;
            inStockCount: number | undefined;
            preorderCount: number | undefined;
            monitorCount: number | undefined;
            fullyBookedCount: number | undefined;
            /**
             * Format: date-time
             * @example 2026-07-15T12:03:29.322Z
             */
            lastMatchedAt: string | undefined;
            /**
             * Format: date-time
             * @example 2026-07-15T12:03:29.322Z
             */
            createdAt: string;
            /**
             * Format: date-time
             * @example 2026-07-15T12:03:29.322Z
             */
            updatedAt: string;
        };
        ShopMatchStats: {
            shop: {
                technicalName: string;
                name: string;
                logoUrl: string | undefined;
                websiteUrl: string | undefined;
                description: string | undefined;
                isActive: boolean;
                isTemporarilyClosed: boolean;
                isOptedOut: boolean;
                deliveryNote: string | undefined;
            };
            matchCount: number;
            /** @description Matches resolved to a catalog item */
            linkedMatchCount: number;
            inStockCount: number;
            preorderCount: number;
            monitorCount: number;
            fullyBookedCount: number;
            /**
             * Format: date-time
             * @example 2026-07-15T12:03:29.322Z
             */
            lastMatchedAt: string | undefined;
        };
        ShopMatchWithItem: {
            /**
             * @description Resource identifier
             * @example 6a577711abc1ce71383d3e10
             */
            id: string;
            shop: {
                /** @example cardlevels */
                technicalName: string;
                /** @example Cardlevels */
                name: string;
            };
            url: string;
            /**
             * @description Resource identifier
             * @example 6a577711abc1ce71383d3e10
             */
            shopUrlId: string | undefined;
            /** @example 149.5 */
            price: number | undefined;
            /**
             * @description ISO-4217 currency code
             * @example SEK
             */
            currency: string | undefined;
            inStock: boolean;
            inPreorder: boolean;
            inMonitor: boolean;
            isFullyBooked: boolean;
            scrapedName: string | undefined;
            scrapedType: string | undefined;
            matchScore: number | undefined;
            hasCategoryMismatch: boolean;
            /** @enum {string|null} */
            cardType: "loose" | "graded" | undefined;
            /** @enum {string|null} */
            itemCondition: "NM" | "LP" | "MP" | "HP" | "DMG" | undefined;
            /** @enum {string|null} */
            gradingCompany: "PSA" | "BGS" | "CGC" | "SGC" | "ACE" | "RAUKCARD" | "TAG" | "GMA" | undefined;
            grade: number | undefined;
            item: {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                /** @enum {string} */
                kind: "card" | "sealed";
                name: string;
                shortName: string | undefined;
                technicalName: string;
                cardNumber: string | undefined;
                imageUrl: string | undefined;
                language: string | undefined;
                priceChartingId: string | undefined;
            } | undefined;
            expansion: {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                /** @example Mega Evolution 30th Celebration */
                name: string;
                /** @example 30th Celebration */
                shortName: string;
                /** @example jpn-mega-evolution-30th-celebration */
                technicalName: string;
                /**
                 * @description Printing language of the item
                 * @example JPN
                 * @enum {string}
                 */
                language: "ENG" | "JPN" | "CHI";
                /** @example m6a */
                code: string | undefined;
                /** @example m6a */
                cardCode: string | undefined;
                /** @example Mega Evolution */
                seriesName: string | undefined;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                releaseDate: string | undefined;
                /**
                 * @description Absolute asset URL, or null when absent
                 * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                 */
                logoUrl: string | undefined;
                /**
                 * @description Absolute asset URL, or null when absent
                 * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                 */
                symbolUrl: string | undefined;
                /**
                 * @description Absolute asset URL, or null when absent
                 * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                 */
                imageUrl: string | undefined;
            } | undefined;
            category: {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                /** @example Booster Box */
                name: string;
                /** @example booster-box */
                technicalName: string;
            } | undefined;
            /**
             * Format: date-time
             * @example 2026-07-15T12:03:29.322Z
             */
            matchedAt: string;
            /**
             * Format: date-time
             * @example 2026-07-15T12:03:29.322Z
             */
            updatedAt: string;
            bargain: {
                discountPercent: number;
                /** @enum {string} */
                referenceSource: "retail" | "tradera" | "cardmarket";
            } | undefined;
        };
        ShopMatchesForShop: {
            shop: {
                technicalName: string;
                name: string;
                logoUrl: string | undefined;
                websiteUrl: string | undefined;
                description: string | undefined;
                isActive: boolean;
                isTemporarilyClosed: boolean;
                isOptedOut: boolean;
                deliveryNote: string | undefined;
            } | undefined;
            data: {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                shop: {
                    /** @example cardlevels */
                    technicalName: string;
                    /** @example Cardlevels */
                    name: string;
                };
                url: string;
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                shopUrlId: string | undefined;
                /** @example 149.5 */
                price: number | undefined;
                /**
                 * @description ISO-4217 currency code
                 * @example SEK
                 */
                currency: string | undefined;
                inStock: boolean;
                inPreorder: boolean;
                inMonitor: boolean;
                isFullyBooked: boolean;
                scrapedName: string | undefined;
                scrapedType: string | undefined;
                matchScore: number | undefined;
                hasCategoryMismatch: boolean;
                /** @enum {string|null} */
                cardType: "loose" | "graded" | undefined;
                /** @enum {string|null} */
                itemCondition: "NM" | "LP" | "MP" | "HP" | "DMG" | undefined;
                /** @enum {string|null} */
                gradingCompany: "PSA" | "BGS" | "CGC" | "SGC" | "ACE" | "RAUKCARD" | "TAG" | "GMA" | undefined;
                grade: number | undefined;
                item: {
                    /**
                     * @description Resource identifier
                     * @example 6a577711abc1ce71383d3e10
                     */
                    id: string;
                    /** @enum {string} */
                    kind: "card" | "sealed";
                    name: string;
                    shortName: string | undefined;
                    technicalName: string;
                    cardNumber: string | undefined;
                    imageUrl: string | undefined;
                    language: string | undefined;
                    priceChartingId: string | undefined;
                } | undefined;
                expansion: {
                    /**
                     * @description Resource identifier
                     * @example 6a577711abc1ce71383d3e10
                     */
                    id: string;
                    /** @example Mega Evolution 30th Celebration */
                    name: string;
                    /** @example 30th Celebration */
                    shortName: string;
                    /** @example jpn-mega-evolution-30th-celebration */
                    technicalName: string;
                    /**
                     * @description Printing language of the item
                     * @example JPN
                     * @enum {string}
                     */
                    language: "ENG" | "JPN" | "CHI";
                    /** @example m6a */
                    code: string | undefined;
                    /** @example m6a */
                    cardCode: string | undefined;
                    /** @example Mega Evolution */
                    seriesName: string | undefined;
                    /**
                     * Format: date-time
                     * @example 2026-07-15T12:03:29.322Z
                     */
                    releaseDate: string | undefined;
                    /**
                     * @description Absolute asset URL, or null when absent
                     * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                     */
                    logoUrl: string | undefined;
                    /**
                     * @description Absolute asset URL, or null when absent
                     * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                     */
                    symbolUrl: string | undefined;
                    /**
                     * @description Absolute asset URL, or null when absent
                     * @example https://ik.imagekit.io/xgtytqdnv/expansions/example-image.webp
                     */
                    imageUrl: string | undefined;
                } | undefined;
                category: {
                    /**
                     * @description Resource identifier
                     * @example 6a577711abc1ce71383d3e10
                     */
                    id: string;
                    /** @example Booster Box */
                    name: string;
                    /** @example booster-box */
                    technicalName: string;
                } | undefined;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                matchedAt: string;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                updatedAt: string;
                bargain: {
                    discountPercent: number;
                    /** @enum {string} */
                    referenceSource: "retail" | "tradera" | "cardmarket";
                } | undefined;
            }[];
            pagination: {
                /** @description Total matching records, ignoring pagination */
                total: number;
                limit: number;
                skip: number;
                hasMore: boolean;
            };
        };
        ShopPriceHistoryList: {
            shop: string;
            items: {
                item: {
                    /**
                     * @description Resource identifier
                     * @example 6a577711abc1ce71383d3e10
                     */
                    id: string;
                    name: string;
                };
                history: {
                    /**
                     * Format: date-time
                     * @example 2026-07-15T12:03:29.322Z
                     */
                    snapshotDate: string;
                    /** @example 149.5 */
                    price: number;
                    /**
                     * @description ISO-4217 currency code
                     * @example SEK
                     */
                    currency: string;
                    inStock: boolean;
                    url: string;
                }[];
                /** @example 149.5 */
                latestPrice: number | undefined;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                latestDate: string | undefined;
            }[];
            itemCount: number;
        };
        ShopUrlMutationResult: {
            message: string;
            shopUrl: {
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                id: string;
                url: string;
                shop: string | undefined;
                /** @enum {string} */
                status: "pending" | "active" | "invalid" | "rejected" | "sanityRejected";
                /** @enum {string} */
                discoveredBy: "scraper" | "user";
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                itemId: string | undefined;
                /** @enum {string|null} */
                itemKind: "card" | "sealed" | undefined;
                lockedItem: boolean;
                priceChartingId: string | undefined;
                scrapedName: string | undefined;
                matchScore: number | undefined;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                lastMatchedAt: string | undefined;
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                expansionId: string | undefined;
                /**
                 * @description Resource identifier
                 * @example 6a577711abc1ce71383d3e10
                 */
                categoryId: string | undefined;
                submittedByUserId: string | undefined;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                createdAt: string;
                /**
                 * Format: date-time
                 * @example 2026-07-15T12:03:29.322Z
                 */
                updatedAt: string;
            };
        };
        TopItem: {
            /**
             * @description Resource identifier
             * @example 6a577711abc1ce71383d3e10
             */
            id: string;
            slug: string | undefined;
            shopMatchCount: number;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
