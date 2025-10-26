import { Ad } from "../types/Ad";
import adsJson from "../data/ads.json";

export class AdDatasource {
  private ads: Ad[];

  constructor() {
    this.ads = adsJson.map((ad) => ({
      id: ad.id,
      title: ad.title,
      description: ad.description,
      keywords: ad.keywords || [],
      url: ad.url || "#",
      city: ad.city || "",
      state: ad.state || "",
      country: ad.country || "",
      category: ad.category || [],
    }));
  }

  getAds(): Ad[] {
    return this.ads;
  }

  findBestAd(targeting: {
    keywords?: string[];
    categories?: string[];
    locations?: string[];
    excludeKeywords?: string[];
    excludeCategories?: string[];
    excludeLocations?: string[];
  }): Ad | null {
    const eligibleAds = this.ads.filter((ad) =>
      this.isAdEligible(ad, targeting)
    );

    if (eligibleAds.length === 0) return null;

    // Score eligible ads
    const scoredAds = eligibleAds.map((ad) => ({
      ad,
      score: this.calculateAdScore(ad, targeting),
    }));

    // Find max score
    const maxScore = Math.max(...scoredAds.map((s) => s.score));

    // Filter all ads with max score
    const topAds = scoredAds
      .filter((s) => s.score === maxScore)
      .map((s) => s.ad);

    // Return one randomly if multiple ads tie
    const randomIndex = Math.floor(Math.random() * topAds.length);
    return topAds[randomIndex];
  }

  private isAdEligible(
    ad: Ad,
    targeting: {
      keywords?: string[];
      categories?: string[];
      locations?: string[];
      excludeKeywords?: string[];
      excludeCategories?: string[];
      excludeLocations?: string[];
    }
  ): boolean {
    const normalize = (arr?: string[]) =>
      arr?.map((s) => s.toLowerCase()) || [];

    const adKeywords = normalize(ad.keywords);
    const adCategories = normalize(ad.category);
    const adLocations = normalize([ad.city, ad.state, ad.country]);
    const tExcludeKeywords = normalize(targeting.excludeKeywords);
    const tExcludeCategories = normalize(targeting.excludeCategories);
    const tExcludeLocations = normalize(targeting.excludeLocations);

    // Exclusion checks (case-insensitive)
    if (tExcludeKeywords.some((kw) => adKeywords.includes(kw))) return false;
    if (tExcludeCategories.some((cat) => adCategories.includes(cat)))
      return false;
    if (tExcludeLocations.some((loc) => adLocations.includes(loc)))
      return false;

    return true;
  }

  private calculateAdScore(
    ad: Ad,
    targeting: {
      keywords?: string[];
      categories?: string[];
      locations?: string[];
    }
  ): number {
    let score = 1;

    const normalize = (arr?: string[]) =>
      arr?.map((s) => s.toLowerCase()) || [];

    const adKeywords = normalize(ad.keywords);
    const adCategories = normalize(ad.category);
    const adLocations = normalize([ad.city, ad.state, ad.country]);
    const tKeywords = normalize(targeting.keywords);
    const tCategories = normalize(targeting.categories);
    const tLocations = normalize(targeting.locations);

    if (tKeywords) {
      const matches = tKeywords.filter((kw) => adKeywords.includes(kw)).length;
      score += matches * 0.1;
    }

    if (tCategories) {
      const matches = tCategories.filter((cat) =>
        adCategories.includes(cat)
      ).length;
      score += matches * 0.08;
    }

    if (tLocations) {
      const matches = tLocations.filter((loc) =>
        adLocations.includes(loc)
      ).length;
      score += matches * 0.05;
    }

    return score;
  }
}
