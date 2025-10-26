export async function displayAd(
  keywords = [],
  locations = [],
  categories = [],
  excludeKeywords = [],
  excludeLocations = [],
  excludeCategories = []
) {
  console.log("Fetching ad...");
  try {
    const params = new URLSearchParams();

    if (keywords?.length) params.append("keywords", keywords.join(","));
    if (locations?.length) params.append("locations", locations.join(","));
    if (categories?.length) params.append("categories", categories.join(","));
    if (excludeKeywords?.length)
      params.append("excludeKeywords", excludeKeywords.join(","));
    if (excludeLocations?.length)
      params.append("excludeLocations", excludeLocations.join(","));
    if (excludeCategories?.length)
      params.append("excludeCategories", excludeCategories.join(","));

    const url = "/getad?" + params.toString();
    const response = await fetch(url);

    console.log("Response status:", response.status);

    const json = await response.json();
    const ad = json.ad;
    console.log("Ad data:", ad);

    const container = document.getElementById("ad-container");
    if (!container) return;
    if (!ad) {
      container.innerHTML = "<p>No ads available.</p>";
      return;
    }

    const adKeywords = ad.keywords?.join(", ") || "N/A";
    const adCategory = ad.category?.join(", ") || "N/A";
    const adLocation =
      [ad.city, ad.state, ad.country].filter(Boolean).join(", ") || "N/A";

    container.innerHTML = `
    <div class="ad-card-container">
    <p><strong>Query Endpoint:</strong> ${url}</p>
      <div class="ad-card">
        <h2>${ad.title || "Untitled Ad"}</h2>
        <p>${ad.description || ""}</p>
        <p><strong>Keywords:</strong> ${adKeywords}</p>
        <p><strong>Location:</strong> ${adLocation}</p>
        <p><strong>Category:</strong> ${adCategory}</p>
        <a href="${ad.targetUrl || "#"}" target="_blank">Visit Ad</a>
      </div>
    </div>`;
  } catch (error) {
    console.error("Error fetching ad:", error);
    const container = document.getElementById("ad-container");
    if (container) {
      container.innerText = "Error loading ad.";
    }
  }
}

// Initial load
displayAd();
