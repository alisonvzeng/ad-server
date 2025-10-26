import { Request, Response } from "express";
import { AdDatasource } from "../datasource/AdDatasource";

export class GetAdHandler {
  private adDatasource: AdDatasource;

  constructor(adDatasource: AdDatasource) {
    this.adDatasource = adDatasource;
  }

  public handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const targeting = {
        keywords: this.parseArrayParam(req.query.keywords),
        locations: this.parseArrayParam(req.query.locations),
        categories: this.parseArrayParam(req.query.categories),
        excludeKeywords: this.parseArrayParam(req.query.excludeKeywords),
        excludeLocations: this.parseArrayParam(req.query.excludeLocations),
        excludeCategories: this.parseArrayParam(req.query.excludeCategories),
      };

      const bestAd = this.adDatasource.findBestAd(targeting);

      if (!bestAd) {
        res.status(404).json({
          success: false,
          message: "No suitable ad found",
        });
        return;
      }

      res.json({
        success: true,
        ad: bestAd,
      });
    } catch (error) {
      console.error("Error in GetAdHandler:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  private parseArrayParam(param: any): string[] | undefined {
    if (!param) return undefined;
    if (Array.isArray(param)) return param as string[];
    if (typeof param === "string") return param.split(",");
    return undefined;
  }
}
