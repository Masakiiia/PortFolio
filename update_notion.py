import os
import json
import requests

NOTION_TOKEN = os.getenv("NOTION_TOKEN")
DATABASE_ID = os.getenv("NOTION_DATABASE_ID")

headers = {
    "Authorization": f"Bearer {NOTION_TOKEN}",
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28"
}

def fetch_notion_data():
    url = f"https://api.notion.com/v1/databases/{DATABASE_ID}/query"
    
    # On filtre sur la Note >= 7
    payload = {
        "filter": {
            "property": "Note",
            "number": { "greater_than_or_equal_to": 7 }
        }
    }
    
    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
    data = response.json()
    
    articles = []
    seen_urls = set()
    for page in data.get("results", []):
        props = page["properties"]
        
        # --- EXTRACTION SÉCURISÉE ---
        # Titre (Colonne 'Nom')
        titre = "Sans titre"
        if "Nom" in props and props["Nom"].get("title"):
            titre = props["Nom"]["title"][0]["text"]["content"]

        # URL
        url_link = props["URL"].get("url", "#") if "URL" in props else "#"
        # Si l'URL a déjà été vue ou est vide, on saute cet article
        if url_link == "#" or url_link in seen_urls:
            continue
        
        seen_urls.add(url_link)

        # Synthèse (Colonne 'Synthèse')
        synthese = "Aucune synthèse disponible."
        if "Synthèse" in props and props["Synthèse"].get("rich_text"):
            synthese = props["Synthèse"]["rich_text"][0]["text"]["content"]

        # Tags (Colonne 'Tags')
        tags_list = []
        if "Tags" in props and props["Tags"].get("multi_select"):
            tags_list = [t["name"] for t in props["Tags"]["multi_select"]]
        tags_string = ", ".join(tags_list) if tags_list else "Tech"

        # Date (On essaie la colonne 'Date', sinon on prend la date de création de la page)
        date_val = page["created_time"] # Valeur par défaut
        if "Date" in props and props["Date"].get("date") and props["Date"]["date"]:
            date_val = props["Date"]["date"]["start"]

        articles.append({
            "Titre": titre,
            "URL": url_link,
            "Resume": synthese,
            "Theme": tags_string,
            "Date": date_val
        })
    return articles

if __name__ == "__main__":
    try:
        articles_data = fetch_notion_data()
        os.makedirs("data", exist_ok=True)
        with open("data/articles.json", "w", encoding="utf-8") as f:
            json.dump(articles_data, f, ensure_ascii=False, indent=4)
        print(f"Succès : {len(articles_data)} articles exportés.")
    except Exception as e:
        print(f"Erreur détaillée : {e}")
        exit(1)
