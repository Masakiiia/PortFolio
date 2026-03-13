import os
import json
import requests

# Récupération des secrets
NOTION_TOKEN = os.getenv("NOTION_TOKEN")
DATABASE_ID = os.getenv("NOTION_DATABASE_ID")

headers = {
    "Authorization": f"Bearer {NOTION_TOKEN}",
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28"
}

def fetch_notion_data():
    url = f"https://api.notion.com/v1/databases/{DATABASE_ID}/query"
    # On filtre pour ne prendre que les articles avec une note >= 7
    payload = {
        "filter": {
            "property": "Note", # Remplace par le nom exact de ta colonne
            "number": { "greater_than_or_equal_to": 7 }
        }
    }
    response = requests.post(url, headers=headers, json=payload)
    data = response.json()
    
    articles = []
    for page in data.get("results", []):
        props = page["properties"]
        # On extrait les données (adapte les noms des colonnes)
        articles.append({
            "Titre": props["Nom"]["title"][0]["text"]["content"] if props.get("Nom") else "Sans titre",
            "URL": props["Lien"]["url"] if props.get("Lien") else "#",
            "Resume": props["Résumé"]["rich_text"][0]["text"]["content"] if props.get("Résumé") else "",
            "Theme": props["Thème"]["select"]["name"] if props.get("Thème") else "Tech",
            "Date": page["created_time"]
        })
    return articles

if __name__ == "__main__":
    articles = fetch_notion_data()
    os.makedirs("data", exist_ok=True)
    with open("data/articles.json", "w", encoding="utf-8") as f:
        json.dump(articles, f, ensure_ascii=False, indent=4)
